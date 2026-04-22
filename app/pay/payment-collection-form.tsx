"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useGetInstanceByIdQuery } from "@/lib/store/api/instancesApi";
import { useGetCollectionsQuery } from "@/lib/store/api/collectionsApi";

export function PaymentCollectionForm({ instanceId }: { instanceId: string }) {
  const { data: instance, isLoading: instanceLoading } = useGetInstanceByIdQuery(instanceId);
  const { data: collections = [], refetch: refetchCollections } = useGetCollectionsQuery(instanceId);

  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [selectedPaymentTypeId, setSelectedPaymentTypeId] = useState("");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isInitiating, setIsInitiating] = useState(false);

  // Race-condition guard: prevents double-submission even on fast repeated clicks
  const paymentInFlight = useRef(false);

  const selectedPaymentType = instance?.paymentTypes?.find((pt) => pt.id === selectedPaymentTypeId);
  const amount = selectedPaymentType?.amount || 0;

  const instanceCollections = useMemo(
    () => collections.filter((entry) => entry.instanceId === instanceId).slice(0, 10),
    [collections, instanceId],
  );

  // Load Paystack inline JS v2
  useEffect(() => {
    if (document.getElementById("paystack-inline")) return;
    const script = document.createElement("script");
    script.id = "paystack-inline";
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function handleProceedToPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (paymentInFlight.current) return; // guard against race / double-click

    if (!instance || !payerName.trim() || !payerEmail.trim() || !selectedPaymentType || amount <= 0) {
      alert("Please fill in all required fields");
      return;
    }

    if (!window.PaystackPop) {
      alert("Payment gateway is still loading. Please try again in a moment.");
      return;
    }

    paymentInFlight.current = true;
    setIsInitiating(true);

    // Generate a unique idempotency key for this payment attempt
    const reference = `PG-${instance.id.slice(-6)}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();

    try {
      // Server-side initialization so secret key never touches the client
      const initRes = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payerEmail.trim(),
          amount: Math.round(amount * 100), // kobo
          reference,
          split_code: instance.splitCode,
          metadata: {
            payer_name: payerName.trim(),
            instance_id: instance.id,
            payment_type: selectedPaymentType.name,
            ...fieldValues,
          },
        }),
      });

      if (!initRes.ok) {
        const err = await initRes.json();
        throw new Error(err.error || "Failed to initialize payment");
      }

      window.PaystackPop.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: payerEmail.trim(),
        amount: Math.round(amount * 100),
        ref: reference,
        split_code: instance.splitCode,
        metadata: {
          payer_name: payerName.trim(),
          instance_id: instance.id,
          payment_type: selectedPaymentType.name,
          ...fieldValues,
        },

        onSuccess: async (transaction) => {
          try {
            const idclAmount = Number(((amount * instance.idclPercent) / 100).toFixed(2));
            const motAmount = Number((amount - idclAmount).toFixed(2));

            // Verify with Paystack and atomically save collection — idempotent on duplicate
            const verifyRes = await fetch(`/api/paystack/verify/${transaction.reference}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                instanceId: instance.id,
                instanceName: instance.name,
                splitCode: instance.splitCode,
                paymentTypeId: selectedPaymentType.id,
                paymentType: selectedPaymentType.name,
                payer: payerName.trim(),
                amount,
                idclAmount,
                motAmount,
                metadata: { email: payerEmail.trim(), ...fieldValues },
                collectedAt: new Date().toLocaleString(),
              }),
            });

            if (!verifyRes.ok) {
              const err = await verifyRes.json();
              alert(`Payment received but could not be recorded. Please report reference: ${transaction.reference}\n\n${err.error ?? ""}`);
              return;
            }

            // Reset form and refresh table
            setPayerName("");
            setPayerEmail("");
            setSelectedPaymentTypeId("");
            setFieldValues({});
            refetchCollections();
          } finally {
            paymentInFlight.current = false;
            setIsInitiating(false);
          }
        },

        onCancel: () => {
          // User closed popup without paying — allow a fresh attempt
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

  if(instanceLoading){
    return <div>Loading...</div>
  }

  if (!instance) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
        <p className="text-lg font-semibold text-[var(--foreground)]">Payment instance not found</p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          The selected instance is unavailable. Return to the payment instances page and choose another one.
        </p>
        <Link
          href="/pay"
          className="mt-4 inline-flex rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          Back to Instances
        </Link>
      </div>
    );
  }

  return (
    <>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/pay" className="text-sm font-medium text-[var(--accent)]">
            Back to Instances
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{instance?.name} Payments</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Collect payments for this instance using split code {instance.splitCode}.</p>
        </div>
        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">
          {instance.splitCode}
        </span>
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Accept Payment</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Select the payment type and enter payer details to record the transaction.</p>

          <form className="mt-4 space-y-3" onSubmit={handleProceedToPayment}>
            <input
              value={payerName}
              onChange={(event) => setPayerName(event.target.value)}
              placeholder="Payer name"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              required
            />
            <input
              type="email"
              value={payerEmail}
              onChange={(event) => setPayerEmail(event.target.value)}
              placeholder="Payer email"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              required
            />

            {/* Dynamic fields defined by admin */}
            {instance.formFields && instance.formFields.length > 0 && instance.formFields.map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
                  {field.label}{field.required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
                </label>
                {field.type === "select" && field.options && field.options.length > 0 ? (
                  <select
                    value={fieldValues[field.key] ?? ""}
                    onChange={(e) => setFieldValues({ ...fieldValues, [field.key]: e.target.value })}
                    required={field.required}
                    className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                  >
                    <option value="">Select {field.label}...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={fieldValues[field.key] ?? ""}
                    onChange={(e) => setFieldValues({ ...fieldValues, [field.key]: e.target.value })}
                    placeholder={field.label}
                    required={field.required}
                    className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                  />
                )}
              </div>
            ))}
            
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                Payment Reason
              </label>
              {instance?.paymentTypes && instance.paymentTypes.length > 0 ? (
                <div className="space-y-2">
                  {instance.paymentTypes.map((paymentType) => (
                    <label
                      key={paymentType.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition ${
                        selectedPaymentTypeId === paymentType.id
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]/30"
                          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentType"
                        value={paymentType.id}
                        checked={selectedPaymentTypeId === paymentType.id}
                        onChange={(e) => setSelectedPaymentTypeId(e.target.value)}
                        className="mt-1 h-4 w-4 accent-[var(--accent)]"
                        required
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-[var(--foreground)]">{paymentType.name}</p>
                          <p className="text-lg font-bold text-[var(--accent)]">N{paymentType.amount.toFixed(2)}</p>
                        </div>
                        {paymentType.description && (
                          <p className="mt-1 text-xs text-[var(--muted-foreground)]">{paymentType.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    No payment types configured for this instance. Contact your administrator.
                  </p>
                </div>
              )}
            </div>

            {/* <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                <p className="text-sm text-[var(--muted-foreground)]">IDCL Share</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">${previewIdclAmount.toFixed(2)}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{instance.idclPercent}% of payment</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                <p className="text-sm text-[var(--muted-foreground)]">MOT Share</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">${previewMotAmount.toFixed(2)}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{100 - instance.idclPercent}% of payment</p>
              </div>
            </div> */}

            <button
              type="submit"
              disabled={isInitiating}
              className="h-11 w-full rounded-xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isInitiating ? "Initiating Payment…" : "Proceed to Payment"}
            </button>
          </form>
        </article>

        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Instance Details</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Review the configured split before collecting.</p>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Instance</p>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{instance.name}</p>
            </div>
            {/* <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Split Code</p>
              <p className="mt-2 font-mono text-sm text-[var(--foreground)]">{instance.splitCode}</p>
            </div> */}
            {/* <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Revenue Split</p>
              <p className="mt-2 text-sm text-[var(--foreground)]">
                IDCL {instance.idclPercent}% / MOT {100 - instance.idclPercent}%
              </p>
            </div> */}
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Collections</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">Latest payments accepted under this payment instance.</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Total Collected</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
              ${collections.filter((c) => c.instanceId === instanceId).reduce((sum, c) => sum + c.amount, 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[var(--surface-alt)] text-left text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              <tr>
                <th className="px-3 py-2">Payer</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">IDCL</th>
                <th className="px-3 py-2">MOT</th>
                <th className="px-3 py-2">Collected</th>
              </tr>
            </thead>
            <tbody>
              {instanceCollections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-[var(--muted-foreground)]">
                    No payments collected for this instance yet.
                  </td>
                </tr>
              ) : (
                instanceCollections.map((collection) => (
                  <tr key={collection.id} className="border-t border-[var(--border)] text-[var(--foreground)]">
                    <td className="px-3 py-3 font-medium">{collection.payer}</td>
                    <td className="px-3 py-3">${collection.amount.toFixed(2)}</td>
                    <td className="px-3 py-3 text-[var(--success)]">${collection.idclAmount.toFixed(2)}</td>
                    <td className="px-3 py-3">${collection.motAmount.toFixed(2)}</td>
                    <td className="px-3 py-3 text-[var(--muted-foreground)]">{collection.collectedAt}</td>
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
