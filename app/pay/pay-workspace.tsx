"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import type { UserRole } from "@/lib/auth-types";
import {
  getStoredPaymentInstances,
  savePaymentInstances,
  type PaymentInstance,
} from "@/lib/payment-store";

export function PayWorkspace({ role }: { role: UserRole }) {
  const [instances, setInstances] = useState<PaymentInstance[]>(() => getStoredPaymentInstances());
  const [instanceName, setInstanceName] = useState("");
  const [splitCode, setSplitCode] = useState("");
  const [idclPercent, setIdclPercent] = useState("35");

  useEffect(() => {
    savePaymentInstances(instances);
  }, [instances]);

  function handleCreateInstance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = instanceName.trim();
    const trimmedSplitCode = splitCode.trim().toUpperCase();
    const idcl = Number(idclPercent);

    if (!trimmedName || !trimmedSplitCode || !Number.isFinite(idcl) || idcl <= 0 || idcl >= 100) {
      return;
    }

    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newInstance: PaymentInstance = {
      id: `${slug || "instance"}-${Date.now()}`,
      name: trimmedName,
      splitCode: trimmedSplitCode,
      idclPercent: idcl,
      summary: `${trimmedName} payment collection with automatic IDCL and MOT split.`,
    };

    setInstances((current) => [newInstance, ...current]);
    setInstanceName("");
    setSplitCode("");
    setIdclPercent("35");
  }

  if (role === "operator") {
    return (
      <>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Payment Instances</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Select a payment instance to begin collecting payments with its assigned split code.
        </p>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {instances.map((instance) => (
            <Link
              key={instance.id}
              href={`/pay/${instance.id}`}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[0_18px_30px_-24px_rgba(13,110,253,0.55)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    Payment Instance
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">{instance.name}</h2>
                </div>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  {instance.splitCode}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">{instance.summary}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm">
                <div>
                  <p className="text-[var(--muted-foreground)]">IDCL Split</p>
                  <p className="mt-1 font-semibold text-[var(--foreground)]">{instance.idclPercent}%</p>
                </div>
                <div>
                  <p className="text-[var(--muted-foreground)]">MOT Split</p>
                  <p className="mt-1 font-semibold text-[var(--foreground)]">{100 - instance.idclPercent}%</p>
                </div>
              </div>

              <div className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--accent)]">
                Open payment page
              </div>
            </Link>
          ))}
        </section>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Payment Instances</h1>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
        Create and manage payment instances that operators will use during collection.
      </p>

      <section className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Configured Instances</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Each instance has a split code that determines how collected payments are shared.
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-[var(--surface-alt)] text-left text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-3 py-2">Instance</th>
                  <th className="px-3 py-2">Split Code</th>
                  <th className="px-3 py-2">IDCL %</th>
                  <th className="px-3 py-2">MOT %</th>
                </tr>
              </thead>
              <tbody>
                {instances.map((instance) => (
                  <tr key={instance.id} className="border-t border-[var(--border)] text-[var(--foreground)]">
                    <td className="px-3 py-2 font-medium">{instance.name}</td>
                    <td className="px-3 py-2 font-mono text-xs">{instance.splitCode}</td>
                    <td className="px-3 py-2">{instance.idclPercent}%</td>
                    <td className="px-3 py-2">{100 - instance.idclPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Create Instance</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Operators will see every published instance on their payment instance grid.
          </p>

          <form className="mt-4 grid gap-3" onSubmit={handleCreateInstance}>
            <input
              value={instanceName}
              onChange={(event) => setInstanceName(event.target.value)}
              placeholder="Instance name (e.g. Transport)"
              className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              required
            />
            <input
              value={splitCode}
              onChange={(event) => setSplitCode(event.target.value)}
              placeholder="Split code (e.g. TRN-35)"
              className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              required
            />
            <input
              value={idclPercent}
              onChange={(event) => setIdclPercent(event.target.value)}
              type="number"
              min="1"
              max="99"
              placeholder="IDCL %"
              className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              required
            />
            <button
              type="submit"
              className="h-10 rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:brightness-95"
            >
              Create Instance
            </button>
          </form>
        </article>
      </section>
    </>
  );
}
