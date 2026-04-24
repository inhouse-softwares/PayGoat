"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetInstanceByIdQuery } from "@/lib/store/api/instancesApi";
import { useGetCollectionsQuery } from "@/lib/store/api/collectionsApi";
import type { PaymentCollection } from "@/lib/payment-store";
import printReceipts from "@/utils/print-reciepts";

type Person = {
  name: string;
  email: string;
  fields: Record<string, string>;
};

export type Receipt = {
  index: number;
  name: string;
  email: string;
  fields: Record<string, string>;
  paymentType: string;
  unitAmount: number;
  totalAmount: number;
  quantity: number;
  reference: string;
  collectedAt: string;
  instanceName: string;
};

type Step = "reason" | "details" | "receipts";

function emptyPerson(): Person {
  return { name: "", email: "", fields: {} };
}

export function PaymentCollectionForm({ instanceId }: { instanceId: string }) {
  const { data: instance, isLoading: instanceLoading } = useGetInstanceByIdQuery(instanceId);
  const { data: collections = [], refetch: refetchCollections } = useGetCollectionsQuery(instanceId);

  const [step, setStep] = useState<Step>("reason");
  const [selectedPaymentTypeId, setSelectedPaymentTypeId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [persons, setPersons] = useState<Person[]>([emptyPerson()]);
  const [isInitiating, setIsInitiating] = useState(false);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [viewingCollection, setViewingCollection] = useState<PaymentCollection | null>(null);

  const paymentInFlight = useRef(false);

  function buildReceiptsFromCollection(c: PaymentCollection): Receipt[] {
    const qty = c.quantity || 1;
    const unitAmt = c.amount / qty;
    const rawPersons: Array<Record<string, string>> =
      Array.isArray((c.metadata as any)?.persons) ? (c.metadata as any).persons : [{ name: c.payer }];
    return rawPersons.map((p, i) => ({
      index: i,
      name: p.name ?? c.payer,
      email: p.email ?? "",
      fields: Object.fromEntries(Object.entries(p).filter(([k]) => k !== "name" && k !== "email")),
      paymentType: c.paymentType ?? "",
      unitAmount: unitAmt,
      totalAmount: c.amount,
      quantity: qty,
      reference: c.paystackReference ?? "",
      collectedAt: c.collectedAt,
      instanceName: c.instanceName,
    }));
  }

  const selectedPaymentType = instance?.paymentTypes?.find((pt) => pt.id === selectedPaymentTypeId);
  const unitAmount = selectedPaymentType?.amount || 0;
  const totalAmount = unitAmount * quantity;

  const instanceCollections = useMemo(
    () => collections.filter((entry) => entry.instanceId === instanceId).slice(0, 10),
    [collections, instanceId],
  );

  useEffect(() => {
    if (document.getElementById("paystack-inline")) return;
    const script = document.createElement("script");
    script.id = "paystack-inline";
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function handleContinueToDetails() {
    if (!selectedPaymentType || quantity < 1) return;
    setPersons(Array.from({ length: quantity }, () => emptyPerson()));
    setStep("details");
  }

  function updatePerson(index: number, patch: Partial<Person>) {
    setPersons((prev) => prev.map((p, i) => i === index ? { ...p, ...patch } : p));
  }

  function updatePersonField(personIndex: number, key: string, value: string) {
    setPersons((prev) =>
      prev.map((p, i) => i === personIndex ? { ...p, fields: { ...p.fields, [key]: value } } : p)
    );
  }

  function validatePersons(): string | null {
    for (let i = 0; i < persons.length; i++) {
      const p = persons[i];
      if (!p.name.trim()) return `Person ${i + 1}: name is required`;
      if (!p.email.trim() || !p.email.includes("@")) return `Person ${i + 1}: valid email is required`;
      if (instance?.formFields) {
        for (const f of instance.formFields) {
          if (f.required && !p.fields[f.key]?.trim()) return `Person ${i + 1}: ${f.label} is required`;
        }
      }
    }
    return null;
  }

  async function handleProceedToPayment() {
    if (paymentInFlight.current) return;

    const validationError = validatePersons();
    if (validationError) { alert(validationError); return; }

    if (!instance || !selectedPaymentType || totalAmount <= 0) return;

    if (!window.PaystackPop) {
      alert("Payment gateway is still loading. Please try again in a moment.");
      return;
    }

    paymentInFlight.current = true;
    setIsInitiating(true);

    const reference = `PG-${instance.id.slice(-6)}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
    const activeSplitCode = selectedPaymentType.splitCode || instance.splitCode;
    // Use first person's email for Paystack (required field)
    const payerEmail = persons[0].email.trim();
    const payerName = quantity === 1 ? persons[0].name.trim() : `Group of ${quantity} (${persons[0].name.trim()})`;

    try {
      const initRes = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payerEmail,
          amount: Math.round(totalAmount * 100),
          reference,
          split_code: activeSplitCode,
          metadata: {
            payer_name: payerName,
            instance_id: instance.id,
            payment_type: selectedPaymentType.name,
            quantity,
          },
        }),
      });

      if (!initRes.ok) {
        const err = await initRes.json();
        throw new Error(err.error || "Failed to initialize payment");
      }

      new window.PaystackPop().newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: payerEmail,
        amount: Math.round(totalAmount * 100),
        ref: reference,
        split_code: activeSplitCode,
        metadata: { payer_name: payerName, instance_id: instance.id, payment_type: selectedPaymentType.name, quantity },

        onSuccess: async (transaction) => {
          try {
            const idclAmount = Number(((totalAmount * instance.idclPercent) / 100).toFixed(2));
            const motAmount = Number((totalAmount - idclAmount).toFixed(2));
            const collectedAt = new Date().toLocaleString();

            const verifyRes = await fetch(`/api/paystack/verify/${transaction.reference}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                instanceId: instance.id,
                instanceName: instance.name,
                splitCode: activeSplitCode,
                paymentTypeId: selectedPaymentType.id,
                paymentType: selectedPaymentType.name,
                payer: payerName,
                amount: totalAmount,
                quantity,
                idclAmount,
                motAmount,
                metadata: { persons: persons.map((p) => ({ name: p.name, email: p.email, ...p.fields })) },
                collectedAt,
              }),
            });

            if (!verifyRes.ok) {
              const err = await verifyRes.json();
              alert(`Payment received but could not be recorded. Reference: ${transaction.reference}\n\n${err.error ?? ""}`);
              return;
            }

            // Build per-person receipts
            setReceipts(
              persons.map((p, i) => ({
                index: i,
                name: p.name,
                email: p.email,
                fields: p.fields,
                paymentType: selectedPaymentType.name,
                unitAmount,
                totalAmount,
                quantity,
                reference: transaction.reference,
                collectedAt,
                instanceName: instance.name,
              }))
            );
            setStep("receipts");
            refetchCollections();
          } finally {
            paymentInFlight.current = false;
            setIsInitiating(false);
          }
        },

        onCancel: () => {
          paymentInFlight.current = false;
          setIsInitiating(false);
        },
      });
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.message || "Failed to start payment. Please try again.");
      paymentInFlight.current = false;
      setIsInitiating(false);
    }
  }

  function handleNewPayment() {
    setStep("reason");
    setSelectedPaymentTypeId("");
    setQuantity(1);
    setPersons([emptyPerson()]);
    setReceipts([]);
  }

  if (instanceLoading) {
    return <div className="py-10 text-center text-sm text-[var(--muted-foreground)]">Loading…</div>;
  }

  if (!instance) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
        <p className="text-lg font-semibold text-[var(--foreground)]">Payment instance not found</p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          The selected instance is unavailable. Return to the payment instances page and choose another one.
        </p>
        <Link href="/pay" className="mt-4 inline-flex rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">
          Back to Instances
        </Link>
      </div>
    );
  }

  // ─── RECEIPTS STEP ────────────────────────────────────────────────────────
  if (step === "receipts") {
    return (
      <div className="space-y-5">
        {/* Header row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[var(--foreground)] sm:text-2xl">Payment Successful</h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {receipts.length} receipt{receipts.length > 1 ? "s" : ""} ready — ₦{receipts[0]?.totalAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })} total
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => printReceipts(receipts)}
              className="flex-1 rounded-xl border border-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft)] sm:flex-none"
            >
              🖨 Print Receipts
            </button>
            <button
              onClick={handleNewPayment}
              className="flex-1 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 sm:flex-none"
            >
              New Payment
            </button>
          </div>
        </div>

        {/* Receipt cards grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {receipts.map((r) => (
            <div key={r.index} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--accent)]">
                  Person {r.index + 1}{receipts.length > 1 ? ` of ${receipts.length}` : ""}
                </span>
                <span className="font-mono text-xs text-[var(--muted-foreground)]">{r.reference.slice(-10)}</span>
              </div>
              <p className="mt-3 text-base font-bold text-[var(--foreground)]">{r.name}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{r.email}</p>
              {Object.entries(r.fields).map(([k, v]) => (
                <p key={k} className="mt-1 text-xs text-[var(--foreground)]">
                  <span className="text-[var(--muted-foreground)]">{k}:</span> {v}
                </p>
              ))}
              <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                <span className="text-sm text-[var(--muted-foreground)]">{r.paymentType}</span>
                <span className="font-bold text-[var(--accent)]">₦{r.unitAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">{r.collectedAt}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── REASON + COUNT STEP ──────────────────────────────────────────────────
  if (step === "reason") {
    return (
      <>
        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <Link href="/pay" className="text-sm font-medium text-[var(--accent)]">← Instances</Link>
            <h1 className="mt-1 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">{instance.name}</h1>
          </div>
          <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)] truncate max-w-[160px] sm:max-w-none">{instance.splitCode}</span>
        </div>

        <div className="mt-5 space-y-4">
          {/* Step 1: Payment Reason */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Step 1 — Payment Reason</p>
            {instance.paymentTypes && instance.paymentTypes.length > 0 ? (
              <div className="space-y-2">
                {instance.paymentTypes.map((pt) => (
                  <label
                    key={pt.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition ${
                      selectedPaymentTypeId === pt.id
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]/30"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentType"
                      value={pt.id}
                      checked={selectedPaymentTypeId === pt.id}
                      onChange={(e) => { setSelectedPaymentTypeId(e.target.value); setQuantity(1); }}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <p className="font-semibold text-[var(--foreground)]">{pt.name}</p>
                        <p className="font-bold text-[var(--accent)]">₦{pt.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}<span className="ml-0.5 text-xs font-normal text-[var(--muted-foreground)]">/person</span></p>
                      </div>
                      {pt.description && <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{pt.description}</p>}
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center text-sm text-[var(--muted-foreground)]">
                No payment types configured. Contact your administrator.
              </p>
            )}
          </div>

          {/* Step 2: Number of people — only shown after reason is selected */}
          {selectedPaymentType && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Step 2 — Number of People</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="h-12 w-12 shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xl font-bold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40"
                >−</button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                  className="h-12 w-16 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 text-center text-base font-semibold text-[var(--foreground)] outline-none focus:border-[var(--accent)] sm:w-20"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(100, q + 1))}
                  className="h-12 w-12 shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xl font-bold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >+</button>
                <div className="min-w-0 flex-1 rounded-xl border border-[var(--accent-soft)] bg-[var(--accent-soft)]/20 px-3 py-2 text-right">
                  <p className="text-xs text-[var(--muted-foreground)]">Total</p>
                  <p className="text-lg font-bold text-[var(--accent)] sm:text-xl">₦{totalAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              {quantity > 1 && (
                <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                  {quantity} × ₦{unitAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })} — one charge covers all {quantity} people
                </p>
              )}
              <button
                type="button"
                onClick={handleContinueToDetails}
                className="mt-4 h-12 w-full rounded-xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.98]"
              >
                Continue — {quantity === 1 ? "Fill In Details" : `Details for ${quantity} People`} →
              </button>
            </div>
          )}
        </div>

        {/* Recent Collections */}
        <section className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[var(--foreground)] sm:text-lg">Recent Collections</h2>
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)] sm:text-sm">Latest payments under this instance.</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-right">
              <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Total</p>
              <p className="text-base font-semibold text-[var(--foreground)] sm:text-xl">
                ₦{collections.filter((c) => c.instanceId === instanceId).reduce((s, c) => s + c.amount, 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Mobile-friendly list */}
          <div className="mt-4 space-y-2 sm:hidden">
            {instanceCollections.length === 0 ? (
              <p className="py-4 text-center text-sm text-[var(--muted-foreground)]">No payments collected yet.</p>
            ) : instanceCollections.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">{c.payer}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{c.collectedAt}</p>
                </div>
                <div className="ml-3 flex shrink-0 items-center gap-2">
                  <span className="font-semibold text-[var(--accent)]">₦{c.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                  <button
                    onClick={() => setViewingCollection(c)}
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
                  >View</button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="mt-4 hidden overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] sm:block">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-[var(--surface-alt)] text-left text-xs uppercase tracking-widest text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-3 py-2">Payer</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Collected</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {instanceCollections.length === 0 ? (
                  <tr><td colSpan={4} className="px-3 py-6 text-center text-[var(--muted-foreground)]">No payments collected yet.</td></tr>
                ) : (
                  instanceCollections.map((c) => (
                    <tr key={c.id} className="border-t border-[var(--border)] text-[var(--foreground)]">
                      <td className="px-3 py-3 font-medium">{c.payer}</td>
                      <td className="px-3 py-3">₦{c.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-3 text-[var(--muted-foreground)]">{c.collectedAt}</td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => setViewingCollection(c)}
                          className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
                        >View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Collection detail modal */}
        {viewingCollection && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
            onClick={() => setViewingCollection(null)}
          >
            <div
              className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[var(--border)] px-5 py-4">
                <div className="min-w-0 pr-4">
                  <p className="truncate text-base font-bold text-[var(--foreground)]">{viewingCollection.payer}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {viewingCollection.paymentType} · {viewingCollection.collectedAt}
                  </p>
                </div>
                <button onClick={() => setViewingCollection(null)} className="shrink-0 text-2xl leading-none text-[var(--muted-foreground)] hover:text-[var(--foreground)]">×</button>
              </div>

              {/* Body */}
              <div className="max-h-[55vh] overflow-y-auto px-5 py-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <div className="flex-1 min-w-[90px] rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                    <p className="text-xs text-[var(--muted-foreground)]">Amount</p>
                    <p className="mt-0.5 font-bold text-[var(--accent)]">₦{viewingCollection.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
                  </div>
                  {(viewingCollection.quantity ?? 1) > 1 && (
                    <div className="flex-1 min-w-[70px] rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                      <p className="text-xs text-[var(--muted-foreground)]">People</p>
                      <p className="mt-0.5 font-bold text-[var(--foreground)]">{viewingCollection.quantity}</p>
                    </div>
                  )}
                  {viewingCollection.paystackReference && (
                    <div className="flex-1 min-w-[110px] rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 overflow-hidden">
                      <p className="text-xs text-[var(--muted-foreground)]">Reference</p>
                      <p className="mt-0.5 truncate font-mono text-xs text-[var(--foreground)]">{viewingCollection.paystackReference}</p>
                    </div>
                  )}
                </div>

                {Array.isArray((viewingCollection.metadata as any)?.persons) && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Payer Details</p>
                    {((viewingCollection.metadata as any).persons as Array<Record<string, string>>).map((p, i) => (
                      <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {(viewingCollection.quantity ?? 1) > 1 && (
                            <span className="mr-2 text-xs font-normal text-[var(--muted-foreground)]">#{i + 1}</span>
                          )}
                          {p.name}
                        </p>
                        {p.email && <p className="text-xs text-[var(--muted-foreground)]">{p.email}</p>}
                        {Object.entries(p).filter(([k]) => k !== "name" && k !== "email").map(([k, v]) => (
                          <p key={k} className="mt-0.5 text-xs text-[var(--foreground)]">
                            <span className="text-[var(--muted-foreground)]">{k}:</span> {v}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-2 border-t border-[var(--border)] px-5 py-4">
                <button onClick={() => setViewingCollection(null)} className="h-11 flex-1 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-soft)]">
                  Close
                </button>
                <button
                  onClick={() => { printReceipts(buildReceiptsFromCollection(viewingCollection)); }}
                  className="h-11 flex-[2] rounded-xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95"
                >
                  🖨 Reprint Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // ─── DETAILS STEP (per-person forms) ─────────────────────────────────────
  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <button type="button" onClick={() => setStep("reason")} className="text-sm font-medium text-[var(--accent)]">← Back</button>
          <h1 className="mt-1 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">{instance.name}</h1>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)] sm:text-sm">
            {selectedPaymentType?.name} · {quantity} {quantity === 1 ? "person" : "people"}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--accent-soft)] bg-[var(--accent-soft)]/20 px-3 py-2 text-right">
          <p className="text-xs text-[var(--muted-foreground)]">Total</p>
          <p className="font-bold text-[var(--accent)]">₦{totalAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Progress bar for multi-person */}
      {quantity > 1 && (
        <div className="mt-3 flex gap-1">
          {Array.from({ length: quantity }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: persons[i]?.name ? "var(--accent)" : "var(--border)" }}
            />
          ))}
        </div>
      )}

      <div className="mt-4 space-y-3 pb-28 sm:pb-4">
        {persons.map((person, i) => (
          <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
                Person {i + 1}{quantity > 1 ? ` of ${quantity}` : ""}
              </span>
              {quantity > 1 && (
                <span className="text-xs text-[var(--muted-foreground)]">₦{unitAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
              )}
            </div>
            <div className="space-y-2">
              <input
                value={person.name}
                onChange={(e) => updatePerson(i, { name: e.target.value })}
                placeholder="Full name"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              />
              <input
                type="email"
                value={person.email}
                onChange={(e) => updatePerson(i, { email: e.target.value })}
                placeholder="Email address (optional)"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              />
              {instance.formFields && instance.formFields.length > 0 && instance.formFields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
                    {field.label}{field.required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
                  </label>
                  {field.type === "select" && field.options && field.options.length > 0 ? (
                    <select
                      value={person.fields[field.key] ?? ""}
                      onChange={(e) => updatePersonField(i, field.key, e.target.value)}
                      className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                    >
                      <option value="">Select {field.label}…</option>
                      {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={person.fields[field.key] ?? ""}
                      onChange={(e) => updatePersonField(i, field.key, e.target.value)}
                      placeholder={field.label}
                      className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky action footer */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-3 border-t border-[var(--border)] bg-[var(--surface)]/95 p-4 backdrop-blur-sm sm:relative sm:border-0 sm:bg-transparent sm:p-0 sm:pt-4 sm:backdrop-blur-none">
        <button
          type="button"
          onClick={() => setStep("reason")}
          className="h-12 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--border)] sm:flex-none sm:px-6"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleProceedToPayment}
          disabled={isInitiating}
          className="h-12 flex-[3] rounded-xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isInitiating
            ? "Initiating…"
            : `Pay ₦${totalAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`}
        </button>
      </div>
    </>
  );
}

