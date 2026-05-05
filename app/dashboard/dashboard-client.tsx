"use client";

import { useMemo } from "react";
import { useGetInstancesQuery } from "@/lib/store/api/instancesApi";
import { useGetCollectionsQuery } from "@/lib/store/api/collectionsApi";
import Loader from "../components/loader";

export function DashboardClient() {
  const { data: instances = [], isLoading: instancesLoading } = useGetInstancesQuery();
  const { data: collections = [], isLoading: collectionsLoading } = useGetCollectionsQuery();

  const isLoading = instancesLoading || collectionsLoading;

  const totalCollected = useMemo(
    () => {
      if(!collections) return 0;
      return collections.reduce((sum, c) => sum + c.amount, 0);
    },
    [collections],
  );

  const instanceTotals = useMemo(() => {
    if(!instances || !collections) return [];
    return instances.map((instance) => {
      const instanceCollections = collections ? collections.filter((c) => c.instanceId === instance.id) : [];
      const total = instanceCollections.reduce((sum, c) => sum + c.amount, 0);
      return { instance, total, count: instanceCollections.length };
    });
  }, [instances, collections]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Payment Overview</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Track collections and earnings across all payment instances.
        </p>
      </div>

      {/* Grand total banner */}
      <section className="rounded-2xl bg-blue-700 px-4 py-5 text-white sm:px-6">
        <p className="text-sm text-white/80">Total Collected (All Instances)</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          ₦{totalCollected.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </p>
        <p className="mt-2 text-sm text-white/80">
          {collections.length} payment{collections.length !== 1 ? "s" : ""} across {instances.length} instance{instances.length !== 1 ? "s" : ""}
        </p>
      </section>

      {/* Per-instance breakdown */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">Collections by Instance</h2>
        {instanceTotals.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">No instances configured yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {instanceTotals.map(({ instance, total, count }) => (
              <div
                key={instance.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">Instance</p>
                    <p className="mt-1 font-semibold text-[var(--foreground)]">{instance.name}</p>
                  </div>
                  <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
                    {instance.splitCode}
                  </span>
                </div>
                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    ₦{total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {count} collection{count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent collections table */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-4 py-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Collections</h2>
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">Latest payments recorded across all instances.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-[var(--surface-alt)] text-left text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Instance</th>
                <th className="px-4 py-3 font-semibold">Payer</th>
                <th className="px-4 py-3 font-semibold">Payment Type</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {collections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[var(--muted-foreground)]">
                    No collections recorded yet.
                  </td>
                </tr>
              ) : (
                collections.slice(0, 20).map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-[var(--border)] text-[var(--foreground)] even:bg-[var(--surface-soft)]"
                  >
                    <td className="px-4 py-3 font-medium">{c.instanceName}</td>
                    <td className="px-4 py-3">{c.payer}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{c.paymentType ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold">
                      ₦{c.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{c.collectedAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
