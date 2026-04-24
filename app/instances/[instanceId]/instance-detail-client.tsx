"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetInstanceByIdQuery, useDeleteInstanceMutation, useUpdateInstanceMutation } from "@/lib/store/api/instancesApi";
import type { FormFieldType } from "@/lib/payment-store";

type EditPaymentType = { id?: string; name: string; description: string; amount: string };
type EditFormField = { key: string; label: string; type: FormFieldType; required: boolean; options: string };

export function InstanceDetailClient({ instanceId }: { instanceId: string }) {
  const router = useRouter();
  const { data: instanceData, isLoading, isError } = useGetInstanceByIdQuery(instanceId);
  const [deleteInstance, { isLoading: isDeleting }] = useDeleteInstanceMutation();
  const [updateInstance, { isLoading: isSaving }] = useUpdateInstanceMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Edit form state — seeded from instance when modal opens
  const [editName, setEditName] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editPaymentTypes, setEditPaymentTypes] = useState<EditPaymentType[]>([]);
  const [editFormFields, setEditFormFields] = useState<EditFormField[]>([]);

  function openEdit() {
    if (!instanceData) return;
    setEditName(instanceData.name);
    setEditSummary(instanceData.summary);
    setEditPaymentTypes(
      (instanceData.paymentTypes ?? []).map((pt) => ({
        id: pt.id,
        name: pt.name,
        description: pt.description ?? "",
        amount: String(pt.amount),
      }))
    );
    setEditFormFields(
      ((instanceData.formFields as any[]) ?? []).map((f) => ({
        key: f.key,
        label: f.label,
        type: f.type as FormFieldType,
        required: f.required,
        options: Array.isArray(f.options) ? f.options.join(", ") : (f.options ?? ""),
      }))
    );
    setShowEdit(true);
  }

  async function handleSaveEdit() {
    const hasInvalidType = editPaymentTypes.some((pt) => !pt.name.trim() || !pt.amount || Number(pt.amount) <= 0);
    if (hasInvalidType) {
      alert("All payment types must have a name and a valid amount");
      return;
    }
    try {
      await updateInstance({
        id: instanceId,
        data: {
          name: editName.trim(),
          summary: editSummary.trim(),
          paymentTypes: editPaymentTypes.map((pt) => ({
            ...(pt.id ? { id: pt.id } : {}),
            name: pt.name.trim(),
            description: pt.description.trim() || undefined,
            amount: Number(pt.amount),
          })),
          formFields: editFormFields.map((f) => ({
            key: f.key.trim() || f.label.trim().toLowerCase().replace(/\s+/g, "_"),
            label: f.label.trim(),
            type: f.type,
            required: f.required,
            options: f.type === "select" && f.options
              ? f.options.split(",").map((o) => o.trim()).filter(Boolean)
              : undefined,
          })) as any,
        },
      }).unwrap();
      setShowEdit(false);
    } catch (err: any) {
      alert(err?.data?.error || err?.message || "Failed to save changes");
    }
  }

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
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/pay"
                className="text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
                {instance.name}
              </h1>
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)] max-w-[160px] truncate sm:max-w-none">
                {instance.splitCode}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
              {instance.summary}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={openEdit}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--border)] sm:px-4"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-xl border border-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 text-sm font-semibold text-[var(--danger)] transition hover:bg-[var(--danger)]/20 sm:px-4"
            >
              <span className="sm:hidden">Delete</span>
              <span className="hidden sm:inline">Delete Instance</span>
            </button>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">
              Total Collected
            </p>
            <p className="mt-1.5 text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
              ₦{totalCollected.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              <p className="mt-1.5 text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
                ₦{entity.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                        ₦{collection.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      {entities.map((entity) => {
                        const entityAmount = (collection.amount * entity.percentage) / 100;
                        return (
                          <td key={entity.name} className="px-4 py-3">
                            ₦{entityAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">Edit Instance</h2>
                <p className="text-xs text-[var(--muted-foreground)]">Note: Split entities and bank accounts cannot be changed after creation.</p>
              </div>
              <button onClick={() => setShowEdit(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-xl font-bold">×</button>
            </div>

            <div className="space-y-5 p-6">
              {/* Name & Summary */}
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Instance Name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Summary</label>
                  <textarea
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] resize-none"
                  />
                </div>
              </div>

              {/* Payment Types */}
              <div className="rounded-xl border-2 border-dashed border-[var(--accent)] bg-[var(--accent-soft)]/10 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[var(--foreground)]">Payment Types</label>
                  <button
                    type="button"
                    onClick={() => setEditPaymentTypes([...editPaymentTypes, { name: "", description: "", amount: "" }])}
                    className="text-xs font-semibold text-[var(--accent)] hover:underline"
                  >
                    + Add Type
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {editPaymentTypes.map((pt, i) => (
                    <div key={i} className="space-y-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                      <div className="flex gap-2">
                        <input
                          value={pt.name}
                          onChange={(e) => { const u = [...editPaymentTypes]; u[i].name = e.target.value; setEditPaymentTypes(u); }}
                          placeholder="Reason (e.g. Registration)"
                          className="h-9 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                        />
                        <input
                          value={pt.amount}
                          onChange={(e) => { const u = [...editPaymentTypes]; u[i].amount = e.target.value; setEditPaymentTypes(u); }}
                          type="number" min="0" step="0.01" placeholder="Amount"
                          className="h-9 w-28 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                        />
                        <button
                          type="button"
                          onClick={() => setEditPaymentTypes(editPaymentTypes.filter((_, j) => j !== i))}
                          className="h-9 w-9 rounded-xl border border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger)]/10"
                        >×</button>
                      </div>
                      <input
                        value={pt.description}
                        onChange={(e) => { const u = [...editPaymentTypes]; u[i].description = e.target.value; setEditPaymentTypes(u); }}
                        placeholder="Description (optional)"
                        className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                      />
                      {pt.id && (
                        <p className="text-xs text-[var(--muted-foreground)]">ID: <span className="font-mono">{pt.id.slice(-8)}</span></p>
                      )}
                    </div>
                  ))}
                  {editPaymentTypes.length === 0 && (
                    <p className="py-2 text-center text-xs text-[var(--muted-foreground)]">No payment types. Click &quot;+ Add Type&quot; to add one.</p>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="rounded-xl border-2 border-dashed border-[var(--border)] p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[var(--foreground)]">Operator Form Fields</label>
                  <button
                    type="button"
                    onClick={() => setEditFormFields([...editFormFields, { key: "", label: "", type: "text", required: true, options: "" }])}
                    className="text-xs font-semibold text-[var(--accent)] hover:underline"
                  >
                    + Add Field
                  </button>
                </div>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">Extra fields operators must fill in per payment (e.g. vehicle plate, ID number).</p>
                <div className="mt-3 space-y-2">
                  {editFormFields.map((field, i) => (
                    <div key={i} className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
                      <div className="flex gap-2">
                        <input
                          value={field.label}
                          onChange={(e) => { const u = [...editFormFields]; u[i].label = e.target.value; setEditFormFields(u); }}
                          placeholder="Field label (e.g. Vehicle Plate)"
                          className="h-9 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                        />
                        <select
                          value={field.type}
                          onChange={(e) => { const u = [...editFormFields]; u[i].type = e.target.value as FormFieldType; setEditFormFields(u); }}
                          className="h-9 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="select">Select</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setEditFormFields(editFormFields.filter((_, j) => j !== i))}
                          className="h-9 w-9 rounded-xl border border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger)]/10"
                        >×</button>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--foreground)]">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => { const u = [...editFormFields]; u[i].required = e.target.checked; setEditFormFields(u); }}
                            className="h-4 w-4 accent-[var(--accent)]"
                          />
                          Required
                        </label>
                        {field.type === "select" && (
                          <input
                            value={field.options}
                            onChange={(e) => { const u = [...editFormFields]; u[i].options = e.target.value; setEditFormFields(u); }}
                            placeholder="Options (comma-separated, e.g. Bus,Taxi)"
                            className="h-9 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  {editFormFields.length === 0 && (
                    <p className="py-2 text-center text-xs text-[var(--muted-foreground)]">No custom fields. Operators will only see the default payer name field.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex gap-3 border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4">
              <button
                onClick={() => setShowEdit(false)}
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--border)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex-1 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
              >
                {isSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

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
