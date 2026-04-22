"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetInstanceByIdQuery, useDeleteInstanceMutation } from "@/lib/store/api/instancesApi";

export function InstanceDetailClient({ instanceId }: { instanceId: string }) {
  const router = useRouter();
  const { data: instanceData, isLoading, isError } = useGetInstanceByIdQuery(instanceId);
  const [deleteInstance, { isLoading: isDeleting }] = useDeleteInstanceMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const instance = instanceData;
  const collections = instanceData?.collections || [];

  if (isError) {
    router.push("/pay");
    return null;
  }

  const handleDelete = async () => {
    try {
      await deleteInstance(instanceId).unwrap();
      router.push("/pay");
    } catch (error) {
      console.error("Error deleting instance:", error);
      alert("Failed to delete instance");
    }
  };

  if (isLoading || !instance) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--muted-foreground)]">Loading...</p>
      </div>
    );
  }

  const totalCollected = collections.reduce((sum, c) => sum + c.amount, 0);
  const entities = instance.entities || [
    { name: "IDCL", percentage: instance.idclPercent },
    { name: "MOT", percentage: 100 - instance.idclPercent },
  ];
  const entityTotals = entities.map((entity) => ({
    name: entity.name,
    percentage: entity.percentage,
    amount: (totalCollected * entity.percentage) / 100,
  }));

  const statusClasses: Record<string, string> = {
    Completed: "bg-[#e6f6ed] text-[var(--success)]",
    Pending: "bg-[#fff3dd] text-[var(--warning)]",
    Failed: "bg-[#fde8e8] text-[var(--danger)]",
  };

  return (
    <>
      <div className="space-y-5 p-15">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/pay"
                className="text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1 className="text-2xl font-semibold text-[var(--foreground)]">
                {instance.name}
              </h1>
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                {instance.splitCode}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {instance.summary}
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-xl border border-[var(--danger)] bg-[var(--danger)]/10 px-4 py-2 text-sm font-semibold text-[var(--danger)] transition hover:bg-[var(--danger)]/20"
          >
            Delete Instance
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">
              Total Collected
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              ${totalCollected.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {collections.length} transaction{collections.length !== 1 ? "s" : ""}
            </p>
          </div>

          {entityTotals.map((entity) => (
            <div
              key={entity.name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <p className="text-sm text-[var(--muted-foreground)]">
                {entity.name} ({entity.percentage}%)
              </p>
              <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
                ${entity.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Split allocation
              </p>
            </div>
          ))}
        </div>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border)] px-4 py-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Transaction History
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              All payments collected through this instance
            </p>
          </div>

          {collections.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-[var(--muted-foreground)]">
                No transactions yet for this instance
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-[var(--surface-alt)] text-left text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Payer</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    {entities.map((entity) => (
                      <th key={entity.name} className="px-4 py-3 font-semibold">
                        {entity.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {collections.map((collection) => (
                    <tr
                      key={collection.id}
                      className="border-t border-[var(--border)] text-[var(--foreground)] even:bg-[var(--surface-soft)]"
                    >
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {new Date(collection.collectedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">{collection.payer}</td>
                      <td className="px-4 py-3 font-semibold">
                        ${collection.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      {entities.map((entity) => {
                        const entityAmount = (collection.amount * entity.percentage) / 100;
                        return (
                          <td key={entity.name} className="px-4 py-3">
                            ${entityAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Revenue Split Configuration
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Percentage allocation for each entity
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {entities.map((entity) => (
              <div
                key={entity.name}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
              >
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {entity.name}
                </p>
                <p className="mt-1 text-2xl font-semibold text-[var(--accent)]">
                  {entity.percentage}%
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-[var(--foreground)]">
              Delete Instance?
            </h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Are you sure you want to delete <strong>{instance.name}</strong>? This action cannot be undone. Transaction history will be preserved but the instance will no longer be available for new payments.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--border)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-[var(--danger)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-90"
              >
                Delete Instance
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
