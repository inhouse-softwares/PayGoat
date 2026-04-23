"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetInstanceByIdQuery } from "@/lib/store/api/instancesApi";
import { useGetCollectionsQuery } from "@/lib/store/api/collectionsApi";

type Person = {
  name: string;
  email: string;
  fields: Record<string, string>;
};

type Receipt = {
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

  const paymentInFlight = useRef(false);

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
      <>
        {/* Screen view */}
        <div className="no-print space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--foreground)]">Payment Successful</h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {receipts.length} receipt{receipts.length > 1 ? "s" : ""} ready — ₦{receipts[0]?.totalAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })} total
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="rounded-xl border border-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
              >
                Print All Receipts
              </button>
              <button
                onClick={handleNewPayment}
                className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
              >
                New Payment
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {receipts.map((r) => (
              <div key={r.index} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Person {r.index + 1}</span>
                  <span className="text-xs font-mono text-[var(--muted-foreground)]">{r.reference.slice(-10)}</span>
                </div>
                <p className="mt-2 text-base font-bold text-[var(--foreground)]">{r.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{r.email}</p>
                {Object.entries(r.fields).map(([k, v]) => (
                  <p key={k} className="mt-1 text-xs text-[var(--foreground)]"><span className="text-[var(--muted-foreground)]">{k}:</span> {v}</p>
                ))}
                <div className="mt-3 border-t border-[var(--border)] pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">{r.paymentType}</span>
                    <span className="font-bold text-[var(--accent)]">₦{r.unitAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">{r.collectedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Print-only receipts — POS 80mm paper */}
        <div className="print-only">
          {receipts.map((r) => (
            <div key={r.index} className="receipt-slip">
              <div className="receipt-header">
                <p className="receipt-title">{r.instanceName}</p>
                <p className="receipt-sub">{r.paymentType}</p>
              </div>
              <div className="receipt-divider" />
              <table className="receipt-table">
                <tbody>
                  <tr><td>Name</td><td>{r.name}</td></tr>
                  <tr><td>Email</td><td>{r.email}</td></tr>
                  {Object.entries(r.fields).map(([k, v]) => (
                    <tr key={k}><td>{k}</td><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className="receipt-divider" />
              <div className="receipt-amount">
                <span>Amount Paid</span>
                <span>₦{r.unitAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
              </div>
              {r.quantity > 1 && (
                <p className="receipt-note">Person {r.index + 1} of {r.quantity} · Total ₦{r.totalAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
              )}
              <div className="receipt-divider" />
              <p className="receipt-ref">Ref: {r.reference}</p>
              <p className="receipt-date">{r.collectedAt}</p>
              <p className="receipt-footer">Thank you</p>
            </div>
          ))}
        </div>
      </>
    );
  }

  // ─── REASON + COUNT STEP ──────────────────────────────────────────────────
  if (step === "reason") {
    return (
      <>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link href="/pay" className="text-sm font-medium text-[var(--accent)]">← Back to Instances</Link>
            <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{instance.name} Payments</h1>
          </div>
          <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">{instance.splitCode}</span>
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">

            {/* Step 1: Payment Reason */}
            <div>
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
                        className="mt-1 h-4 w-4 accent-[var(--accent)]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-[var(--foreground)]">{pt.name}</p>
                          <p className="font-bold text-[var(--accent)]">₦{pt.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })} / person</p>
                        </div>
                        {pt.description && <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{pt.description}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
                  <p className="text-sm text-[var(--muted-foreground)]">No payment types configured. Contact your administrator.</p>
                </div>
              )}
            </div>

            {/* Step 2: Number of people — only shown after reason is selected */}
            {selectedPaymentType && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Step 2 — Number of People</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="h-11 w-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xl font-bold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40"
                  >−</button>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                    className="h-11 w-20 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-center text-sm font-semibold text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(100, q + 1))}
                    className="h-11 w-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xl font-bold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >+</button>
                  <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-right">
                    <p className="text-xs text-[var(--muted-foreground)]">Total</p>
                    <p className="text-lg font-bold text-[var(--accent)]">₦{totalAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
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
                  className="mt-5 h-12 w-full rounded-xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95"
                >
                  Continue — Fill In {quantity === 1 ? "Details" : `Details for ${quantity} People`} →
                </button>
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Instance</h2>
            <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Name</p>
              <p className="mt-1 font-semibold text-[var(--foreground)]">{instance.name}</p>
            </div>
          </article>
        </section>

        {/* Recent Collections */}
        <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Collections</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">Latest payments accepted under this instance.</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Total Collected</p>
              <p className="mt-1 text-xl font-semibold text-[var(--foreground)]">
                ₦{collections.filter((c) => c.instanceId === instanceId).reduce((s, c) => s + c.amount, 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-[var(--surface-alt)] text-left text-xs uppercase tracking-widest text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-3 py-2">Payer</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Collected</th>
                </tr>
              </thead>
              <tbody>
                {instanceCollections.length === 0 ? (
                  <tr><td colSpan={3} className="px-3 py-6 text-center text-[var(--muted-foreground)]">No payments collected yet.</td></tr>
                ) : (
                  instanceCollections.map((c) => (
                    <tr key={c.id} className="border-t border-[var(--border)] text-[var(--foreground)]">
                      <td className="px-3 py-3 font-medium">{c.payer}</td>
                      <td className="px-3 py-3">₦{c.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-3 text-[var(--muted-foreground)]">{c.collectedAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  // ─── DETAILS STEP (per-person forms) ─────────────────────────────────────
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => setStep("reason")}
            className="text-sm font-medium text-[var(--accent)]"
          >
            ← Back
          </button>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{instance.name} — Payer Details</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {selectedPaymentType?.name} · {quantity} {quantity === 1 ? "person" : "people"} · ₦{totalAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })} total
          </p>
        </div>
        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">
          ₦{unitAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })} / person
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {persons.map((person, i) => (
          <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <p className="mb-3 text-sm font-bold text-[var(--foreground)]">
              Person {i + 1}
              {quantity > 1 && <span className="ml-2 text-xs font-normal text-[var(--muted-foreground)]">of {quantity}</span>}
            </p>
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
                placeholder="Email address"
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

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setStep("reason")}
          className="h-12 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--border)]"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleProceedToPayment}
          disabled={isInitiating}
          className="h-12 flex-[2] rounded-xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isInitiating
            ? "Initiating Payment…"
            : `Pay ₦${totalAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })} for ${quantity === 1 ? "1 person" : `${quantity} people`}`}
        </button>
      </div>
    </>
  );
}

