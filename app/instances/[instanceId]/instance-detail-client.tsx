"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetInstanceByIdQuery, useDeleteInstanceMutation, useUpdateInstanceMutation } from "@/lib/store/api/instancesApi";
import type { FormField, FormFieldType } from "@/lib/payment-store";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal";
import { StatusBadge } from "../../components/ui/status-badge";
import { Avatar } from "../../components/ui/avatar";
import { EmptyState } from "../../components/ui/empty-state";
import { Skeleton } from "../../components/ui/skeleton";
import { PageHeader } from "../../components/ui/page-header";
import { Pencil, Trash2, TrendingUp, CreditCard } from "lucide-react";

type EditPaymentType = { id?: string; name: string; description: string; amount: string };
type EditFormField = { key: string; label: string; type: FormFieldType; required: boolean; options: string };

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

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
      (instanceData.formFields ?? []).map((f: FormField) => ({
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
          formFields: editFormFields.map((f): FormField => ({
            key: f.key.trim() || f.label.trim().toLowerCase().replace(/\s+/g, "_"),
            label: f.label.trim(),
            type: f.type,
            required: f.required,
            options: f.type === "select" && f.options
              ? f.options.split(",").map((o) => o.trim()).filter(Boolean)
              : undefined,
          })),
        },
      }).unwrap();
      setShowEdit(false);
    } catch (err: unknown) {
      const error = err as { data?: { error?: string }; message?: string };
      alert(error?.data?.error || error?.message || "Failed to save changes");
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
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
        </div>
        <Skeleton className="h-64 rounded-[var(--radius-xl)]" />
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
    <div className="animate-fade-in">
      <PageHeader
        title={instance.name}
        description={instance.summary}
        backLink={{ href: "/pay", label: "Back to Instances" }}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={openEdit} icon={<Pencil size={14} />}>
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)} icon={<Trash2 size={14} />}>
              Delete
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 mb-6">
        <Card padding="md" hover>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--accent-soft)]">
              <TrendingUp size={20} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)] font-medium">Total Collected</p>
              <p className="text-xl font-bold text-[var(--foreground)]">{formatNaira(totalCollected)}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{collections.length} transaction{collections.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </Card>

        {entityTotals.map((entity) => (
          <Card key={entity.name} padding="md" hover>
            <div className="flex items-center gap-3">
              <Avatar name={entity.name} size="md" />
              <div>
                <p className="text-xs text-[var(--muted-foreground)] font-medium">{entity.name} ({entity.percentage}%)</p>
                <p className="text-xl font-bold text-[var(--foreground)]">{formatNaira(entity.amount)}</p>
                <p className="text-xs text-[var(--muted-foreground)]">Split allocation</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Transaction History */}
      <Card padding="none" className="mb-6">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Transaction History</h2>
          <p className="text-xs text-[var(--muted-foreground)]">All payments collected through this instance</p>
        </div>

        {collections.length === 0 ? (
          <EmptyState
            icon={<CreditCard size={24} />}
            title="No transactions yet"
            description="Payments will appear here once collected."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Payer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Amount</th>
                  {entities.map((entity) => (
                    <th key={entity.name} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{entity.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {collections.map((collection) => (
                  <tr key={collection.id} className="hover:bg-[var(--surface-soft)] transition-colors">
                    <td className="px-5 py-3 text-[var(--muted-foreground)]">
                      {new Date(collection.collectedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 font-medium text-[var(--foreground)]">{collection.payer}</td>
                    <td className="px-5 py-3 font-semibold text-[var(--foreground)]">{formatNaira(collection.amount)}</td>
                    {entities.map((entity) => {
                      const entityAmount = (collection.amount * entity.percentage) / 100;
                      return (
                        <td key={entity.name} className="px-5 py-3 text-[var(--muted-foreground)]">{formatNaira(entityAmount)}</td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Revenue Split */}
      <Card padding="md">
        <h2 className="text-base font-semibold text-[var(--foreground)] mb-1">Revenue Split Configuration</h2>
        <p className="text-xs text-[var(--muted-foreground)] mb-4">Percentage allocation for each entity</p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {entities.map((entity) => (
            <div key={entity.name} className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--surface-soft)] border border-[var(--border)]">
              <Avatar name={entity.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{entity.name}</p>
                <p className="text-lg font-bold text-[var(--accent)]">{entity.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

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
    </div>
  );
}
