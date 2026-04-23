"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import type { PaymentEntity, FormField, FormFieldType } from "@/lib/payment-store";
import { useGetInstancesQuery, useCreateInstanceMutation } from "@/lib/store/api/instancesApi";

type PaymentTypeInput = {
    name: string;
    description: string;
    amount: string;
    splitEntities: PaymentEntity[];
    showSplit: boolean;
};

type FormFieldInput = {
    key: string;
    label: string;
    type: FormFieldType;
    required: boolean;
    options: string; // comma-separated for select
};

type Bank = { name: string; code: string };

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "select", label: "Select (dropdown)" },
];

export function ConfigureInstances() {
    const { data: instances = [], isLoading } = useGetInstancesQuery();
    const [createInstance, { isLoading: isCreating }] = useCreateInstanceMutation();

    const [instanceName, setInstanceName] = useState("");
    const [entities, setEntities] = useState<PaymentEntity[]>([]);
    const [paymentTypes, setPaymentTypes] = useState<PaymentTypeInput[]>([]);
    const [formFields, setFormFields] = useState<FormFieldInput[]>([]);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [banksLoading, setBanksLoading] = useState(false);
    const [resolveState, setResolveState] = useState<Record<number, { loading: boolean; error: string }>>({})
    const [ptResolveState, setPtResolveState] = useState<Record<string, { loading: boolean; error: string }>>({})
    const [newCredentials, setNewCredentials] = useState<{ email: string; password: string; instanceName: string } | null>(null);;

    useEffect(() => {
        setBanksLoading(true);
        fetch("/api/paystack/banks")
            .then((r) => r.json())
            .then((data) => Array.isArray(data) && setBanks(data))
            .catch(console.error)
            .finally(() => setBanksLoading(false));
    }, []);

    async function resolveAccount(index: number, accountNumber: string, bankCode: string) {
        if (accountNumber.length !== 10 || !bankCode) return;

        setResolveState((prev) => ({ ...prev, [index]: { loading: true, error: "" } }));
        // Clear previous name while resolving
        setEntities((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], businessName: "" };
            return updated;
        });

        try {
            const res = await fetch(
                `/api/paystack/resolve?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(bankCode)}`,
            );
            const data = await res.json();

            if (!res.ok) {
                setResolveState((prev) => ({
                    ...prev,
                    [index]: { loading: false, error: data.error || "Account not found" },
                }));
                return;
            }

            setEntities((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index], businessName: data.accountName };
                return updated;
            });
            setResolveState((prev) => ({ ...prev, [index]: { loading: false, error: "" } }));
        } catch {
            setResolveState((prev) => ({
                ...prev,
                [index]: { loading: false, error: "Network error. Please try again." },
            }));
        }
    }

    async function resolvePtAccount(ptKey: string, accountNumber: string, bankCode: string) {
        if (accountNumber.length !== 10 || !bankCode) return;
        setPtResolveState((prev) => ({ ...prev, [ptKey]: { loading: true, error: "" } }));
        try {
            const res = await fetch(
                `/api/paystack/resolve?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(bankCode)}`,
            );
            const data = await res.json();
            if (!res.ok) {
                setPtResolveState((prev) => ({ ...prev, [ptKey]: { loading: false, error: data.error || "Account not found" } }));
                return;
            }
            // Parse ptKey "ptIndex-entityIndex"
            const [ptIdx, eIdx] = ptKey.split("-").map(Number);
            setPaymentTypes((prev) => {
                const updated = prev.map((pt, pi) => {
                    if (pi !== ptIdx) return pt;
                    const newEntities = pt.splitEntities.map((e, ei) =>
                        ei === eIdx ? { ...e, businessName: data.accountName } : e
                    );
                    return { ...pt, splitEntities: newEntities };
                });
                return updated;
            });
            setPtResolveState((prev) => ({ ...prev, [ptKey]: { loading: false, error: "" } }));
        } catch {
            setPtResolveState((prev) => ({ ...prev, [ptKey]: { loading: false, error: "Network error. Please try again." } }));
        }
    }

    async function handleCreateInstance(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedName = instanceName.trim();

        if (!trimmedName) return;

        const totalPercentage = entities.reduce((sum, e) => sum + e.percentage, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            alert("Entity percentages must add up to 100%");
            return;
        }

        if (entities.length === 0) {
            alert("Please add at least one revenue split entity");
            return;
        }

        if (paymentTypes.length === 0) {
            alert("Please add at least one payment type (reason for payment)");
            return;
        }

        const hasInvalidPaymentType = paymentTypes.some(
            (pt) => !pt.name.trim() || !pt.amount || Number(pt.amount) <= 0,
        );
        if (hasInvalidPaymentType) {
            alert("All payment types must have a name and a valid amount");
            return;
        }

        try {
            const result = await createInstance({
                name: trimmedName,
                splitCode: "", // generated by Paystack — placeholder satisfies the TS type
                idclPercent: 0,
                summary: `${trimmedName} payment collection with automatic revenue split.`,
                formFields: formFields.map((f) => ({
                    key: f.key.trim() || f.label.trim().toLowerCase().replace(/\s+/g, "_"),
                    label: f.label.trim(),
                    type: f.type,
                    required: f.required,
                    options:
                        f.type === "select" && f.options
                            ? f.options.split(",").map((o) => o.trim()).filter(Boolean)
                            : undefined,
                })) as any,
                entities: entities.map((e) => ({ ...e })),
                paymentTypes: paymentTypes.map((pt) => ({
                    name: pt.name.trim(),
                    description: pt.description.trim() || undefined,
                    amount: Number(pt.amount),
                    splitEntities: pt.splitEntities,
                })) as any,
            }).unwrap();

            // Show the auto-generated operator credentials — only visible once
            if (result.operatorEmail && result.operatorPassword) {
                setNewCredentials({
                    email: result.operatorEmail,
                    password: result.operatorPassword,
                    instanceName: trimmedName,
                });
            }

            setInstanceName("");
            setEntities([]);
            setPaymentTypes([]);
            setFormFields([]);
            setResolveState({});
        } catch (error: any) {
            console.error("Error creating instance:", error);
            alert(error?.data?.error || error?.message || "Failed to create instance");
        }
    }

    return (
        <>
            {/* Operator credentials modal — shown once after instance creation */}
            {newCredentials && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
                        <h2 className="text-lg font-semibold text-[var(--foreground)]">Instance Created</h2>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            A dedicated operator account has been created for <strong>{newCredentials.instanceName}</strong>.
                            Save these credentials — the password will not be shown again.
                        </p>
                        <div className="mt-4 space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Login Email</p>
                                <p className="mt-1 font-mono text-sm text-[var(--foreground)] select-all">{newCredentials.email}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Password</p>
                                <p className="mt-1 font-mono text-sm text-[var(--foreground)] select-all">{newCredentials.password}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setNewCredentials(null)}
                            className="mt-5 h-10 w-full rounded-xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95"
                        >
                            I've saved the credentials
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <Link href="/pay" className="text-sm font-medium text-[var(--accent)]">
                        ← Back to Payment Instances
                    </Link>
                    <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">Configure Instances</h1>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        Create and manage payment instances that operators will use during collection.
                    </p>
                </div>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                    Admin Only
                </span>
            </div>

            <section className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">                {/* Existing Instances Table */}
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
                                    <th className="px-3 py-2">Payment Types</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-3 py-4 text-center text-[var(--muted-foreground)]">
                                            Loading instances...
                                        </td>
                                    </tr>
                                ) : instances.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-3 py-4 text-center text-[var(--muted-foreground)]">
                                            No instances yet. Create one using the form.
                                        </td>
                                    </tr>
                                ) : (
                                    instances.map((instance) => (
                                        <tr
                                            key={instance.id}
                                            className="border-t border-[var(--border)] text-[var(--foreground)]"
                                        >
                                            <td className="px-3 py-2">
                                                <Link
                                                    href={`/instances/${instance.id}`}
                                                    className="font-medium text-[var(--accent)] transition hover:underline"
                                                >
                                                    {instance.name}
                                                </Link>
                                            </td>
                                            <td className="px-3 py-2 font-mono text-xs">{instance.splitCode}</td>
                                            <td className="px-3 py-2 text-xs text-[var(--muted-foreground)]">
                                                {instance.paymentTypes?.length ?? 0} type(s)
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </article>

                {/* Create Instance Form */}
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

                        {/* Revenue Split Entities — each entity becomes a Paystack subaccount */}
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-[var(--foreground)]">
                                Revenue Split Entities
                            </label>
                            <button
                                type="button"
                                onClick={() => setEntities([...entities, { name: "", percentage: 0, businessName: "", accountNumber: "", bankCode: "" }])}
                                className="text-xs font-semibold text-[var(--accent)] transition hover:underline"
                            >
                                + Add Entity
                            </button>
                        </div>

                        <div className="space-y-3">
                            {entities.map((entity, index) => (
                                <div key={index} className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                                    <div className="flex gap-2">
                                        <input
                                            value={entity.name}
                                            onChange={(e) => {
                                                const updated = [...entities];
                                                updated[index].name = e.target.value;
                                                setEntities(updated);
                                            }}
                                            placeholder="Entity name (e.g. MOT)"
                                            className="h-9 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                            required
                                        />
                                        <input
                                            value={entity.percentage || ""}
                                            onChange={(e) => {
                                                const updated = [...entities];
                                                updated[index].percentage = Number(e.target.value);
                                                setEntities(updated);
                                            }}
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            placeholder="%"
                                            className="h-9 w-20 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                            required
                                        />
                                        {entities.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setEntities(entities.filter((_, i) => i !== index))}
                                                className="h-9 w-9 rounded-xl border border-[var(--danger)] text-[var(--danger)] transition hover:bg-[var(--danger)]/10"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            value={entity.accountNumber ?? ""}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                const updated = [...entities];
                                                updated[index].accountNumber = val;
                                                setEntities(updated);
                                                resolveAccount(index, val, entity.bankCode ?? "");
                                            }}
                                            placeholder="Account number"
                                            maxLength={10}
                                            inputMode="numeric"
                                            className="h-9 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm font-mono text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                            required
                                        />
                                        <select
                                            value={entity.bankCode ?? ""}
                                            onChange={(e) => {
                                                const updated = [...entities];
                                                updated[index].bankCode = e.target.value;
                                                setEntities(updated);
                                                resolveAccount(index, entity.accountNumber ?? "", e.target.value);
                                            }}
                                            required
                                            className="h-9 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                        >
                                            <option value="">
                                                {banksLoading ? "Loading banks..." : "Select bank"}
                                            </option>
                                            {banks.map((bank, index) => (
                                                <option key={index} value={bank.code}>
                                                    {bank.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Account name — auto-filled via Paystack resolve */}
                                    <div className="relative">
                                        <input
                                            value={
                                                resolveState[index]?.loading
                                                    ? ""
                                                    : (entity.businessName ?? "")
                                            }
                                            readOnly
                                            placeholder={
                                                resolveState[index]?.loading
                                                    ? "Resolving account name…"
                                                    : "Account name (auto-filled)"
                                            }
                                            className={`h-9 w-full rounded-xl border px-3 text-sm text-[var(--foreground)] outline-none cursor-not-allowed opacity-90 ${
                                                resolveState[index]?.error
                                                    ? "border-[var(--danger)] bg-[var(--danger)]/5"
                                                    : entity.businessName
                                                    ? "border-green-500 bg-green-50/30"
                                                    : "border-[var(--border)] bg-[var(--surface-soft)]"
                                            }`}
                                            required
                                        />
                                        {resolveState[index]?.loading && (
                                            <span className="absolute right-3 top-2 text-xs text-[var(--muted-foreground)] animate-pulse">
                                                Resolving…
                                            </span>
                                        )}
                                    </div>
                                    {resolveState[index]?.error && (
                                        <p className="text-xs text-[var(--danger)]">
                                            ⚠ {resolveState[index].error}
                                        </p>
                                    )}
                                </div>
                            ))}
                            <p className="text-xs text-[var(--muted-foreground)]">
                                Total:{" "}
                                {entities.reduce((sum, e) => sum + (e.percentage || 0), 0).toFixed(2)}% (must equal 100%)
                            </p>
                        </div>

                        {/* Payment Types */}
                        <div className="rounded-xl border-2 border-dashed border-[var(--accent)] bg-[var(--accent-soft)]/20 p-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-[var(--foreground)]">
                                    Payment Types
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPaymentTypes([...paymentTypes, { name: "", description: "", amount: "", splitEntities: [], showSplit: false }])
                                    }
                                    className="text-xs font-semibold text-[var(--accent)] transition hover:underline"
                                >
                                    + Add Type
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                                Define specific reasons, amounts, and optional per-type revenue splits for each payment reason.
                            </p>

                            <div className="mt-3 space-y-3">
                                {paymentTypes.map((pt, index) => (
                                    <div key={index} className="space-y-2 rounded-lg bg-[var(--surface)] p-3 border border-[var(--border)]">
                                        {/* Name + Amount + Delete */}
                                        <div className="flex gap-2">
                                            <input
                                                value={pt.name}
                                                onChange={(e) => {
                                                    const updated = [...paymentTypes];
                                                    updated[index].name = e.target.value;
                                                    setPaymentTypes(updated);
                                                }}
                                                placeholder="Reason (e.g. Registration)"
                                                className="h-10 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                                required
                                            />
                                            <input
                                                value={pt.amount}
                                                onChange={(e) => {
                                                    const updated = [...paymentTypes];
                                                    updated[index].amount = e.target.value;
                                                    setPaymentTypes(updated);
                                                }}
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="Amount"
                                                className="h-10 w-28 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPaymentTypes(paymentTypes.filter((_, i) => i !== index))
                                                }
                                                className="h-10 w-10 rounded-xl border border-[var(--danger)] text-[var(--danger)] transition hover:bg-[var(--danger)]/10"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        {/* Description */}
                                        <input
                                            value={pt.description}
                                            onChange={(e) => {
                                                const updated = [...paymentTypes];
                                                updated[index].description = e.target.value;
                                                setPaymentTypes(updated);
                                            }}
                                            placeholder="Description (optional)"
                                            className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                        />
                                        {/* Per-type split entities toggle */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = [...paymentTypes];
                                                updated[index].showSplit = !updated[index].showSplit;
                                                setPaymentTypes(updated);
                                            }}
                                            className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)] transition hover:underline"
                                        >
                                            {pt.showSplit ? "▾" : "▸"} {pt.splitEntities.length > 0 ? `Split Entities (${pt.splitEntities.length})` : "Add Split Entities for this type (optional)"}
                                        </button>
                                        {pt.showSplit && (
                                            <div className="mt-1 space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-2">
                                                <p className="text-xs text-[var(--muted-foreground)]">
                                                    If defined, Paystack will use this split instead of the instance-level split for this payment reason.
                                                </p>
                                                {pt.splitEntities.map((entity, eIdx) => {
                                                    const ptKey = `${index}-${eIdx}`;
                                                    return (
                                                        <div key={eIdx} className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
                                                            <div className="flex gap-2">
                                                                <input
                                                                    value={entity.name}
                                                                    onChange={(e) => {
                                                                        const updated = [...paymentTypes];
                                                                        updated[index].splitEntities[eIdx].name = e.target.value;
                                                                        setPaymentTypes(updated);
                                                                    }}
                                                                    placeholder="Entity name"
                                                                    className="h-9 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                                                    required
                                                                />
                                                                <input
                                                                    value={entity.percentage || ""}
                                                                    onChange={(e) => {
                                                                        const updated = [...paymentTypes];
                                                                        updated[index].splitEntities[eIdx].percentage = Number(e.target.value);
                                                                        setPaymentTypes(updated);
                                                                    }}
                                                                    type="number" min="0" max="100" step="0.01" placeholder="%"
                                                                    className="h-9 w-20 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                                                    required
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = [...paymentTypes];
                                                                        updated[index].splitEntities = updated[index].splitEntities.filter((_, i) => i !== eIdx);
                                                                        setPaymentTypes(updated);
                                                                    }}
                                                                    className="h-9 w-9 rounded-xl border border-[var(--danger)] text-[var(--danger)] transition hover:bg-[var(--danger)]/10"
                                                                >×</button>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    value={entity.accountNumber ?? ""}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                                        const updated = [...paymentTypes];
                                                                        updated[index].splitEntities[eIdx].accountNumber = val;
                                                                        setPaymentTypes(updated);
                                                                        resolvePtAccount(ptKey, val, entity.bankCode ?? "");
                                                                    }}
                                                                    placeholder="Account number"
                                                                    maxLength={10} inputMode="numeric"
                                                                    className="h-9 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm font-mono text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                                                    required
                                                                />
                                                                <select
                                                                    value={entity.bankCode ?? ""}
                                                                    onChange={(e) => {
                                                                        const updated = [...paymentTypes];
                                                                        updated[index].splitEntities[eIdx].bankCode = e.target.value;
                                                                        setPaymentTypes(updated);
                                                                        resolvePtAccount(ptKey, entity.accountNumber ?? "", e.target.value);
                                                                    }}
                                                                    className="h-9 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                                                    required
                                                                >
                                                                    <option value="">{banksLoading ? "Loading…" : "Select bank"}</option>
                                                                    {banks.map((b, bi) => <option key={bi} value={b.code}>{b.name}</option>)}
                                                                </select>
                                                            </div>
                                                            <div className="relative">
                                                                <input
                                                                    value={ptResolveState[ptKey]?.loading ? "" : (entity.businessName ?? "")}
                                                                    readOnly
                                                                    placeholder={ptResolveState[ptKey]?.loading ? "Resolving…" : "Account name (auto-filled)"}
                                                                    className={`h-9 w-full rounded-xl border px-3 text-sm outline-none cursor-not-allowed opacity-90 ${ptResolveState[ptKey]?.error ? "border-[var(--danger)] bg-[var(--danger)]/5" : entity.businessName ? "border-green-500 bg-green-50/30" : "border-[var(--border)] bg-[var(--surface-soft)]"}`}
                                                                    required
                                                                />
                                                                {ptResolveState[ptKey]?.loading && (
                                                                    <span className="absolute right-3 top-2 text-xs text-[var(--muted-foreground)] animate-pulse">Resolving…</span>
                                                                )}
                                                            </div>
                                                            {ptResolveState[ptKey]?.error && (
                                                                <p className="text-xs text-[var(--danger)]">⚠ {ptResolveState[ptKey].error}</p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                                <div className="flex items-center justify-between">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = [...paymentTypes];
                                                            updated[index].splitEntities = [...updated[index].splitEntities, { name: "", percentage: 0, businessName: "", accountNumber: "", bankCode: "" }];
                                                            setPaymentTypes(updated);
                                                        }}
                                                        className="text-xs font-semibold text-[var(--accent)] hover:underline"
                                                    >
                                                        + Add Entity
                                                    </button>
                                                    {pt.splitEntities.length > 0 && (
                                                        <p className="text-xs text-[var(--muted-foreground)]">
                                                            Total: {pt.splitEntities.reduce((s, e) => s + (e.percentage || 0), 0).toFixed(2)}% (must equal 100%)
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {paymentTypes.length === 0 && (
                                    <p className="py-2 text-center text-xs text-[var(--muted-foreground)]">
                                        No payment types added yet. Click &quot;+ Add Type&quot; to get started.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="rounded-xl border-2 border-dashed border-[var(--border)] p-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-[var(--foreground)]">
                                    Operator Form Fields
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormFields([...formFields, { key: "", label: "", type: "text", required: true, options: "" }])
                                    }
                                    className="text-xs font-semibold text-[var(--accent)] transition hover:underline"
                                >
                                    + Add Field
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                                Define what information operators must capture per payment (e.g. vehicle plate, name, address).
                            </p>

                            <div className="mt-3 space-y-2">
                                {formFields.map((field, index) => (
                                    <div key={index} className="space-y-2 rounded-lg bg-[var(--surface)] p-2">
                                        <div className="flex gap-2">
                                            <input
                                                value={field.label}
                                                onChange={(e) => {
                                                    const updated = [...formFields];
                                                    updated[index].label = e.target.value;
                                                    setFormFields(updated);
                                                }}
                                                placeholder="Field label (e.g. Vehicle Plate)"
                                                className="h-9 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                                required
                                            />
                                            <select
                                                value={field.type}
                                                onChange={(e) => {
                                                    const updated = [...formFields];
                                                    updated[index].type = e.target.value as FormFieldType;
                                                    setFormFields(updated);
                                                }}
                                                className="h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                            >
                                                {FIELD_TYPES.map((t) => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => setFormFields(formFields.filter((_, i) => i !== index))}
                                                className="h-9 w-9 rounded-xl border border-[var(--danger)] text-[var(--danger)] transition hover:bg-[var(--danger)]/10"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--foreground)]">
                                                <input
                                                    type="checkbox"
                                                    checked={field.required}
                                                    onChange={(e) => {
                                                        const updated = [...formFields];
                                                        updated[index].required = e.target.checked;
                                                        setFormFields(updated);
                                                    }}
                                                    className="h-4 w-4 accent-[var(--accent)]"
                                                />
                                                Required
                                            </label>
                                            {field.type === "select" && (
                                                <input
                                                    value={field.options}
                                                    onChange={(e) => {
                                                        const updated = [...formFields];
                                                        updated[index].options = e.target.value;
                                                        setFormFields(updated);
                                                    }}
                                                    placeholder="Options (comma-separated, e.g. Bus,Taxi,Truck)"
                                                    className="h-9 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {formFields.length === 0 && (
                                    <p className="py-2 text-center text-xs text-[var(--muted-foreground)]">
                                        No custom fields added. Operators will only see the default payer name field.
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isCreating}
                            className="h-10 rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isCreating ? "Creating..." : "Create Instance"}
                        </button>
                    </form>
                </article>
            </section>
        </>
    );
}
