"use client";

import Link from "next/link";
import type { UserRole } from "@/lib/auth-types";
import { useGetInstancesQuery } from "@/lib/store/api/instancesApi";

export function PayWorkspace({ role }: { role: UserRole }) {
  const { data: instances = [], isLoading } = useGetInstancesQuery();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Payment Instances</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Select a payment instance to begin collecting payments.
          </p>
        </div>
        {role === "admin" && (
          <Link
            href="/pay/configure"
            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
          >
            Configure Instances
          </Link>
        )}
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <p className="text-[var(--muted-foreground)]">Loading instances...</p>
        ) : instances.length === 0 ? (
          <p className="text-[var(--muted-foreground)]">No payment instances available.</p>
        ) : (
          instances.map((instance) => (
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

              {instance.paymentTypes && instance.paymentTypes.length > 0 && (
                <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                  <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">Payment Types</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {instance.paymentTypes.map((pt) => (
                      <span key={pt.id} className="rounded-lg bg-[var(--accent-soft)] px-2 py-1 text-xs font-medium text-[var(--accent)]">
                        {pt.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--accent)]">
                Open payment page
              </div>
            </Link>
          ))
        )}
      </section>
    </>
  );
}
