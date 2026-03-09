"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  getStoredCollections,
  getStoredPaymentInstances,
  saveCollections,
  type PaymentCollection,
} from "@/lib/payment-store";

export function PaymentCollectionForm({ instanceId }: { instanceId: string }) {
  const [instances] = useState(() => getStoredPaymentInstances());
  const [collections, setCollections] = useState<PaymentCollection[]>(() => getStoredCollections());
  const [payerName, setPayerName] = useState("");
  const [amountInput, setAmountInput] = useState("");

  useEffect(() => {
    saveCollections(collections);
  }, [collections]);

  const instance = useMemo(
    () => instances.find((entry) => entry.id === instanceId),
    [instanceId, instances],
  );

  const parsedAmount = Number(amountInput);
  const amount = Number.isFinite(parsedAmount) ? parsedAmount : 0;
  const previewIdclAmount = instance ? (amount * instance.idclPercent) / 100 : 0;
  const previewMotAmount = amount - previewIdclAmount;

  const instanceCollections = useMemo(
    () => collections.filter((entry) => entry.instanceId === instanceId).slice(0, 5),
    [collections, instanceId],
  );

  function handleCollectPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!instance || !payerName.trim() || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    const idclAmount = Number(((amount * instance.idclPercent) / 100).toFixed(2));
    const motAmount = Number((amount - idclAmount).toFixed(2));

    const newCollection: PaymentCollection = {
      id: `collection-${Date.now()}`,
      instanceId: instance.id,
      instanceName: instance.name,
      splitCode: instance.splitCode,
      payer: payerName.trim(),
      amount: Number(amount.toFixed(2)),
      idclAmount,
      motAmount,
      collectedAt: new Date().toLocaleString(),
    };

    setCollections((current) => [newCollection, ...current]);
    setPayerName("");
    setAmountInput("");
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
          <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{instance.name} Payments</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Collect payments for this instance using split code {instance.splitCode}.</p>
        </div>
        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">
          {instance.splitCode}
        </span>
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Accept Payment</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Enter payer details and amount to calculate the split automatically.</p>

          <form className="mt-4 space-y-3" onSubmit={handleCollectPayment}>
            <input
              value={payerName}
              onChange={(event) => setPayerName(event.target.value)}
              placeholder="Payer name"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              required
            />
            <input
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              required
            />

            <div className="grid gap-3 sm:grid-cols-2">
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
            </div>

            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95"
            >
              Accept Payment
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
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Split Code</p>
              <p className="mt-2 font-mono text-sm text-[var(--foreground)]">{instance.splitCode}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Revenue Split</p>
              <p className="mt-2 text-sm text-[var(--foreground)]">
                IDCL {instance.idclPercent}% / MOT {100 - instance.idclPercent}%
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Collections</h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Latest payments accepted under this payment instance.</p>

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
