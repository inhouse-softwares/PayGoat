"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import type { FormField, FormFieldType, PaymentEntity, PaymentType } from "@/lib/payment-store";
import { useGetInstancesQuery, useCreateInstanceMutation } from "@/lib/store/api/instancesApi";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Modal } from "../../components/ui/modal";
import { PageHeader } from "../../components/ui/page-header";
import { Skeleton } from "../../components/ui/skeleton";
import {
    Plus,
    Trash2,
    CreditCard,
    Building2,
    ArrowRight,
    Copy,
    Check,
    AlertCircle,
} from "lucide-react";

type EntityInput = {
    name: string;
    flatAmount: string;
    businessName: string;
    accountNumber: string;
    bankCode: string;
};

type PaymentTypeInput = {
    name: string;
    description: string;
    amount: string;
    splitEntities: EntityInput[];
};

function calcEntityPct(flatAmount: string, ptAmount: string, isMain: boolean): number {
    const flat = parseFloat(flatAmount) || 0;
    const total = parseFloat(ptAmount) || 0;
    if (total <= 0 || flat <= 0) return 0;
    const raw = (flat / total) * 100;
    return isMain ? Math.floor(raw * 100) / 100 : Math.round(raw * 100) / 100;
}

function calcRemainingPct(entities: EntityInput[], ptAmount: string): number {
    if (entities.length <= 1) return 100;
    let sumOthers = 0;
    for (let i = 0; i < entities.length - 1; i++) {
        sumOthers += calcEntityPct(entities[i].flatAmount, ptAmount, i === 0);
    }
    return Math.round((100 - sumOthers) * 100) / 100;
}

type FormFieldInput = {
    key: string;
    label: string;
    type: FormFieldType;
    required: boolean;
    options: string;
};

type Bank = { name: string; code: string };

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "select", label: "Select" },
];

const RESERVED_KEYS = ["name", "email"];

function formatNaira(amount: number) {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function ConfigureInstances() {
    const { data: instances = [], isLoading } = useGetInstancesQuery();
    const [createInstance, { isLoading: isCreating }] = useCreateInstanceMutation();

    const [instanceName, setInstanceName] = useState("");
    const [paymentTypes, setPaymentTypes] = useState<PaymentTypeInput[]>([]);
    const [formFields, setFormFields] = useState<FormFieldInput[]>([]);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [banksLoading, setBanksLoading] = useState(false);
    const [ptResolveState, setPtResolveState] = useState<Record<string, { loading: boolean; error: string }>>({});
    const [newCredentials, setNewCredentials] = useState<{ email: string; password: string; instanceName: string } | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        setBanksLoading(true);
        fetch("/api/myimopay/banks")
            .then((r) => r.json())
            .then((data) => Array.isArray(data) && setBanks(data))
            .catch(console.error)
            .finally(() => setBanksLoading(false));
    }, []);

    async function resolvePtAccount(ptKey: string, accountNumber: string, bankCode: string) {
        if (accountNumber.length !== 10 || !bankCode) return;
        setPtResolveState((prev) => ({ ...prev, [ptKey]: { loading: true, error: "" } }));
        try {
            const res = await fetch(
                `/api/myimopay/resolve?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(bankCode)}`,
            );
            const data = await res.json();
            if (!res.ok) {
                setPtResolveState((prev) => ({ ...prev, [ptKey]: { loading: false, error: data.error || "Account not found" } }));
                return;
            }
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
            setPtResolveState((prev) => ({ ...prev, [ptKey]: { loading: false, error: "Network error" } }));
        }
    }

    function copyToClipboard(text: string, field: string) {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    }

    function addPaymentType() {
        setPaymentTypes([
            ...paymentTypes,
            {
                name: "",
                description: "",
                amount: "",
                splitEntities: [{ name: "", flatAmount: "", businessName: "", accountNumber: "", bankCode: "" }],
            },
        ]);
    }

    function removePaymentType(index: number) {
        setPaymentTypes(paymentTypes.filter((_, i) => i !== index));
    }

    function updatePaymentType(index: number, patch: Partial<PaymentTypeInput>) {
        const updated = [...paymentTypes];
        updated[index] = { ...updated[index], ...patch };
        setPaymentTypes(updated);
    }

    function addEntity(ptIndex: number) {
        const updated = [...paymentTypes];
        updated[ptIndex].splitEntities = [
            ...updated[ptIndex].splitEntities,
            { name: "", flatAmount: "", businessName: "", accountNumber: "", bankCode: "" },
        ];
        setPaymentTypes(updated);
    }

    function removeEntity(ptIndex: number, eIdx: number) {
        const updated = [...paymentTypes];
        updated[ptIndex].splitEntities = updated[ptIndex].splitEntities.filter((_, i) => i !== eIdx);
        setPaymentTypes(updated);
    }

    function updateEntity(ptIndex: number, eIdx: number, patch: Partial<EntityInput>) {
        const updated = [...paymentTypes];
        updated[ptIndex].splitEntities[eIdx] = { ...updated[ptIndex].splitEntities[eIdx], ...patch };
        setPaymentTypes(updated);
    }

    function addFormField() {
        setFormFields([...formFields, { key: "", label: "", type: "text", required: true, options: "" }]);
    }

    function removeFormField(index: number) {
        setFormFields(formFields.filter((_, i) => i !== index));
    }

    function updateFormField(index: number, patch: Partial<FormFieldInput>) {
        const updated = [...formFields];
        updated[index] = { ...updated[index], ...patch };
        if (patch.label !== undefined) {
            updated[index].key = patch.label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "_")
                .replace(/^_|_$/g, "");
        }
        setFormFields(updated);
    }

    async function handleCreateInstance(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedName = instanceName.trim();
        if (!trimmedName) return;

        if (paymentTypes.length === 0) {
            alert("Please add at least one payment type");
            return;
        }

        for (const pt of paymentTypes) {
            if (!pt.name.trim() || !pt.amount || Number(pt.amount) <= 0) {
                alert("All payment types must have a name and a valid amount");
                return;
            }
        }

        for (const pt of paymentTypes) {
            if (pt.splitEntities.length === 0) {
                alert(`"${pt.name || "(unnamed)"}" must have at least one receiving entity.`);
                return;
            }
            if (pt.splitEntities.length > 1) {
                for (let i = 0; i < pt.splitEntities.length - 1; i++) {
                    const flat = parseFloat(pt.splitEntities[i].flatAmount) || 0;
                    if (flat <= 0) {
                        alert(`"${pt.name}": ${i === 0 ? "Main Account" : `Entity ${i + 1}`} needs a flat amount > 0.`);
                        return;
                    }
                }
                const sumPct = pt.splitEntities
                    .slice(0, -1)
                    .reduce((s, e, i) => s + calcEntityPct(e.flatAmount, pt.amount, i === 0), 0);
                if (sumPct >= 100) {
                    alert(`"${pt.name}": flat amounts exceed 100%.`);
                    return;
                }
            }
            const missingBank = pt.splitEntities.some((e) => !e.businessName.trim() || !e.accountNumber.trim() || !e.bankCode.trim());
            if (missingBank) {
                alert(`"${pt.name}": all entities need resolved bank account details.`);
                return;
            }
        }

        try {
            const result = await createInstance({
                name: trimmedName,
                splitCode: "",
                idclPercent: 0,
                summary: `${trimmedName} payment collection with automatic revenue split.`,
                formFields: formFields.map((f): FormField => ({
                    key: f.key.trim() || f.label.trim().toLowerCase().replace(/\s+/g, "_"),
                    label: f.label.trim(),
                    type: f.type,
                    required: f.required,
                    options: f.type === "select" && f.options ? f.options.split(",").map((o) => o.trim()).filter(Boolean) : undefined,
                })),
                entities: [] as PaymentEntity[],
                paymentTypes: paymentTypes.map((pt) => ({
                    name: pt.name.trim(),
                    description: pt.description.trim() || undefined,
                    amount: Number(pt.amount),
                    splitEntities: pt.splitEntities.map((e, i, arr): PaymentEntity => {
                        let pct: number;
                        if (arr.length === 1) pct = 100;
                        else if (i === arr.length - 1) pct = calcRemainingPct(arr, pt.amount);
                        else pct = calcEntityPct(e.flatAmount, pt.amount, i === 0);
                        return { name: e.name, percentage: pct, businessName: e.businessName, accountNumber: e.accountNumber, bankCode: e.bankCode };
                    }),
                })) as PaymentType[],
            }).unwrap();

            if (result.operatorEmail && result.operatorPassword) {
                setNewCredentials({
                    email: result.operatorEmail,
                    password: result.operatorPassword,
                    instanceName: trimmedName,
                });
            }

            setInstanceName("");
            setPaymentTypes([]);
            setFormFields([]);
            setPtResolveState({});
        } catch (err: unknown) {
            const error = err as { data?: { error?: string }; message?: string };
            alert(error?.data?.error || error?.message || "Failed to create instance");
        }
    }

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Configure Instances"
                description="Create and manage payment instances that operators will use during collection."
                backLink={{ href: "/instances", label: "Instances" }}
            />

            <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
                {/* Main: Create Instance Form */}
                <div className="space-y-6">
                    <form onSubmit={handleCreateInstance} className="space-y-6">
                        {/* Instance Name */}
                        <Card padding="lg">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 rounded-[var(--radius-md)] bg-[var(--accent-soft)]">
                                    <Building2 size={20} className="text-[var(--accent)]" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-[var(--foreground)]">Instance Details</h2>
                                    <p className="text-xs text-[var(--muted-foreground)]">Name this payment instance for internal tracking.</p>
                                </div>
                            </div>
                            <Input
                                label="Instance Name"
                                placeholder="e.g. Transport Levy, Registration Fee"
                                value={instanceName}
                                onChange={(e) => setInstanceName(e.target.value)}
                                required
                            />
                        </Card>

                        {/* Payment Types */}
                        <Card padding="lg">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 rounded-[var(--radius-md)] bg-[var(--success-soft)]">
                                    <CreditCard size={20} className="text-[var(--success)]" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-[var(--foreground)]">Payment Types</h2>
                                    <p className="text-xs text-[var(--muted-foreground)]">Define reasons, amounts, and revenue splits.</p>
                                </div>
                            </div>

                            {paymentTypes.length === 0 ? (
                                <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border)] p-8 text-center">
                                    <CreditCard size={32} className="mx-auto text-[var(--muted-foreground)] mb-3" />
                                    <p className="text-sm text-[var(--muted-foreground)]">No payment types yet</p>
                                    <p className="text-xs text-[var(--muted-foreground)] mt-1">Click &quot;Add Type&quot; to define a payment reason.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {paymentTypes.map((pt, ptIndex) => {
                                        const ptAmount = parseFloat(pt.amount) || 0;
                                        return (
                                            <div key={ptIndex} className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                                                {/* Payment type header */}
                                                <div className="flex items-start gap-3 mb-4">
                                                    <div className="flex-1 grid gap-3 sm:grid-cols-[1fr_auto]">
                                                        <Input
                                                            placeholder="Payment reason (e.g. Registration)"
                                                            value={pt.name}
                                                            onChange={(e) => updatePaymentType(ptIndex, { name: e.target.value })}
                                                            required
                                                        />
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]">₦</span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={pt.amount}
                                                                onChange={(e) => updatePaymentType(ptIndex, { amount: e.target.value })}
                                                                placeholder="Amount"
                                                                className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] pl-7 pr-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePaymentType(ptIndex)}
                                                        className="p-2 rounded-[var(--radius-md)] text-[var(--muted-foreground)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <input
                                                    value={pt.description}
                                                    onChange={(e) => updatePaymentType(ptIndex, { description: e.target.value })}
                                                    placeholder="Description (optional)"
                                                    className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all mb-4"
                                                />

                                                {/* Receiving Entities */}
                                                <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <p className="text-xs font-semibold text-[var(--foreground)]">Receiving Entities</p>
                                                        <Button type="button" variant="ghost" size="sm" icon={<Plus size={12} />} onClick={() => addEntity(ptIndex)}>
                                                            Add
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {pt.splitEntities.map((entity, eIdx) => {
                                                            const isMain = eIdx === 0;
                                                            const isLast = eIdx === pt.splitEntities.length - 1;
                                                            const isOnly = pt.splitEntities.length === 1;
                                                            const ptKey = `${ptIndex}-${eIdx}`;
                                                            const pct = isOnly ? 100 : isLast ? calcRemainingPct(pt.splitEntities, pt.amount) : calcEntityPct(entity.flatAmount, pt.amount, isMain);

                                                            return (
                                                                <div key={eIdx} className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className={`text-xs font-semibold ${isMain ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                                                                            {isMain ? "Main Account" : `Entity ${eIdx + 1}`}
                                                                            {isLast && !isOnly && <span className="ml-1 font-normal text-[var(--muted-foreground)]">(remainder)</span>}
                                                                        </span>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge variant={pct < 0 ? "danger" : "success"}>
                                                                                {pct.toFixed(1)}%
                                                                            </Badge>
                                                                            {!isMain && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeEntity(ptIndex, eIdx)}
                                                                                    className="p-1 rounded text-[var(--muted-foreground)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] transition-colors"
                                                                                >
                                                                                    <Trash2 size={12} />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <input
                                                                            value={entity.name}
                                                                            onChange={(e) => updateEntity(ptIndex, eIdx, { name: e.target.value })}
                                                                            placeholder={isMain ? "Main account name" : "Entity name"}
                                                                            className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all"
                                                                            required
                                                                        />

                                                                        {!(isLast && !isOnly) && (
                                                                            <div className="relative">
                                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">₦</span>
                                                                                <input
                                                                                    type="number"
                                                                                    min="0"
                                                                                    step="0.01"
                                                                                    value={entity.flatAmount}
                                                                                    onChange={(e) => updateEntity(ptIndex, eIdx, { flatAmount: e.target.value })}
                                                                                    placeholder={isOnly ? "Gets 100%" : "Flat amount"}
                                                                                    disabled={isOnly}
                                                                                    className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] pl-7 pr-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        {isLast && !isOnly && (
                                                                            <div className={`rounded-[var(--radius-md)] border px-3 py-2 text-xs ${pct < 0 ? "border-[var(--danger)] bg-[var(--danger)]/5 text-[var(--danger)]" : "border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]"}`}>
                                                                                {pct < 0 ? "Reduce other amounts" : `Receives ${pct.toFixed(1)}% = ${formatNaira(ptAmount * pct / 100)}`}
                                                                            </div>
                                                                        )}

                                                                        <div className="grid gap-2 sm:grid-cols-2">
                                                                            <input
                                                                                value={entity.accountNumber ?? ""}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                                                    updateEntity(ptIndex, eIdx, { accountNumber: val });
                                                                                    resolvePtAccount(ptKey, val, entity.bankCode ?? "");
                                                                                }}
                                                                                placeholder="Account number"
                                                                                maxLength={10}
                                                                                inputMode="numeric"
                                                                                className="h-9 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-mono text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all"
                                                                                required
                                                                            />
                                                                            <select
                                                                                value={entity.bankCode ?? ""}
                                                                                onChange={(e) => {
                                                                                    updateEntity(ptIndex, eIdx, { bankCode: e.target.value });
                                                                                    resolvePtAccount(ptKey, entity.accountNumber ?? "", e.target.value);
                                                                                }}
                                                                                className="h-9 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all"
                                                                                required
                                                                            >
                                                                                <option value="">{banksLoading ? "Loading..." : "Select bank"}</option>
                                                                                {banks.map((b, bi) => (
                                                                                    <option key={bi} value={b.code}>{b.name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>

                                                                        <div className="relative">
                                                                            <input
                                                                                value={ptResolveState[ptKey]?.loading ? "" : (entity.businessName ?? "")}
                                                                                readOnly
                                                                                placeholder={ptResolveState[ptKey]?.loading ? "Resolving..." : "Account name (auto-filled)"}
                                                                                className={`h-9 w-full rounded-[var(--radius-md)] border px-3 text-sm outline-none cursor-not-allowed ${ptResolveState[ptKey]?.error ? "border-[var(--danger)] bg-[var(--danger)]/5" : entity.businessName ? "border-[var(--success)] bg-[var(--success-soft)]" : "border-[var(--border)] bg-[var(--surface)]"}`}
                                                                                required
                                                                            />
                                                                            {ptResolveState[ptKey]?.loading && (
                                                                                <span className="absolute right-3 top-2 text-xs text-[var(--muted-foreground)] animate-pulse">...</span>
                                                                            )}
                                                                        </div>
                                                                        {ptResolveState[ptKey]?.error && (
                                                                            <p className="flex items-center gap-1 text-xs text-[var(--danger)]">
                                                                                <AlertCircle size={12} /> {ptResolveState[ptKey].error}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <div className="w-full flex justify-end">
                                <Button type="button" variant="secondary" size="sm" icon={<Plus size={14} />} onClick={addPaymentType} className="mt-4 border border-[#60a5fa]">
                                    Add Payment Type
                                </Button>
                            </div>
                        </Card>
                        <Card padding="lg">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 rounded-[var(--radius-md)] bg-[var(--warning-soft)]">
                                    <AlertCircle size={20} className="text-[var(--warning)]" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-[var(--foreground)]">Operator Form Fields</h2>
                                    <p className="text-xs text-[var(--muted-foreground)]">Additional fields operators must fill per payment.</p>
                                </div>
                            </div>

                            {/* Built-in fields */}
                            <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface-alt)] px-4 py-3">
                                    <span className="text-sm text-[var(--foreground)]">Full name</span>
                                    <span className="text-xs font-medium text-[var(--muted-foreground)] w-14">Text</span>
                                    <Badge variant="default" className="ml-auto">Built-in</Badge>
                                </div>
                                <div className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface-alt)] px-4 py-3">
                                    <span className="text-sm text-[var(--foreground)]">Email address</span>
                                    <span className="text-xs font-medium text-[var(--muted-foreground)] w-14">Email</span>
                                    <Badge variant="default" className="ml-auto">Built-in</Badge>
                                </div>
                            </div>

                            {/* Custom fields */}
                            {formFields.length === 0 ? (
                                <p className="py-4 text-center text-xs text-[var(--muted-foreground)]">
                                    No custom fields. Only built-in name and email will be shown.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {formFields.map((field, index) => {
                                        const isReserved = RESERVED_KEYS.includes(field.key.toLowerCase());
                                        return (
                                            <div
                                                key={index}
                                                className={`rounded-[var(--radius-md)] border p-3 ${isReserved ? "border-[var(--danger)] bg-[var(--danger)]/5" : "border-[var(--border)] bg-[var(--surface-soft)]"}`}
                                            >
                                                {isReserved && (
                                                    <p className="flex items-center gap-1 text-xs text-[var(--danger)] font-medium mb-2">
                                                        <AlertCircle size={12} /> &quot;{field.key}&quot; is a built-in field
                                                    </p>
                                                )}
                                                <div className="flex gap-2">
                                                    <input
                                                        value={field.label}
                                                        onChange={(e) => updateFormField(index, { label: e.target.value })}
                                                        placeholder="Field label"
                                                        className="h-9 flex-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all"
                                                        required
                                                    />
                                                    <select
                                                        value={field.type}
                                                        onChange={(e) => updateFormField(index, { type: e.target.value as FormFieldType })}
                                                        className="h-9 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all"
                                                    >
                                                        {FIELD_TYPES.map((t) => (
                                                            <option key={t.value} value={t.value}>{t.label}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFormField(index)}
                                                        className="p-2 rounded-[var(--radius-md)] text-[var(--muted-foreground)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--foreground)]">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required}
                                                            onChange={(e) => updateFormField(index, { required: e.target.checked })}
                                                            className="h-4 w-4 accent-[var(--accent)]"
                                                        />
                                                        Required
                                                    </label>
                                                    {field.type === "select" && (
                                                        <input
                                                            value={field.options}
                                                            onChange={(e) => updateFormField(index, { options: e.target.value })}
                                                            placeholder="Options (comma-separated)"
                                                            className="h-9 flex-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="w-full flex justify-end">
                                <Button type="button" variant="secondary" size="sm" icon={<Plus size={14} />} onClick={addFormField} className="mt-4">
                                    Add Custom Field
                                </Button>
                            </div>
                        </Card>
                        <Button type="submit" loading={isCreating} className="w-full" size="lg">
                            {isCreating ? "Creating Instance..." : "Create Instance"}
                        </Button>
                    </form>
                </div>

                {/* Sidebar: Existing Instances */}
                <div className="space-y-4 max-lg:hidden">
                    <Card padding="lg">
                        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Existing Instances</h3>
                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-16 rounded-[var(--radius-md)]" />
                                ))}
                            </div>
                        ) : instances.length === 0 ? (
                            <p className="py-4 text-center text-xs text-[var(--muted-foreground)]">
                                No instances created yet.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {instances.map((instance) => (
                                    <Link
                                        key={instance.id}
                                        href={`/instances/${instance.id}`}
                                        className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-soft)] p-3 hover:border-[var(--accent)]/30 hover:shadow-sm transition-all group"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-[var(--foreground)] truncate">{instance.name}</p>
                                            <p className="text-xs text-[var(--muted-foreground)] font-mono">{instance.splitCode}</p>
                                        </div>
                                        <ArrowRight size={14} className="text-[var(--muted-foreground)] group-hover:text-[var(--accent)] transition-colors shrink-0 ml-2" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Loading overlay */}
            {isCreating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl animate-scale-in">
                        <div className="flex flex-col items-center space-y-5">
                            <div className="relative h-16 w-16">
                                <div className="absolute inset-0 rounded-full border-4 border-[var(--accent)]/20" />
                                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[var(--accent)]" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-[var(--foreground)]">Creating Instance</h2>
                                <p className="text-sm text-[var(--muted-foreground)]">Setting up with MyIMO Pay...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Credentials modal */}
            <Modal open={!!newCredentials} onClose={() => setNewCredentials(null)} title="Instance Created">
                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    A dedicated operator account has been created for <strong className="text-[var(--foreground)]">{newCredentials?.instanceName}</strong>.
                    Save these credentials — the password won&apos;t be shown again.
                </p>
                <div className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Login Email</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="font-mono text-sm text-[var(--foreground)] select-all flex-1">{newCredentials?.email}</p>
                            <button
                                type="button"
                                onClick={() => copyToClipboard(newCredentials?.email ?? "", "email")}
                                className="p-1.5 rounded-[var(--radius-sm)] text-[var(--muted-foreground)] hover:bg-[var(--surface-alt)] transition-colors"
                            >
                                {copiedField === "email" ? <Check size={14} className="text-[var(--success)]" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Password</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="font-mono text-sm text-[var(--foreground)] select-all flex-1">{newCredentials?.password}</p>
                            <button
                                type="button"
                                onClick={() => copyToClipboard(newCredentials?.password ?? "", "password")}
                                className="p-1.5 rounded-[var(--radius-sm)] text-[var(--muted-foreground)] hover:bg-[var(--surface-alt)] transition-colors"
                            >
                                {copiedField === "password" ? <Check size={14} className="text-[var(--success)]" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>
                </div>
                <Button className="w-full mt-5" onClick={() => setNewCredentials(null)}>
                    I&apos;ve saved the credentials
                </Button>
            </Modal>
        </div>
    );
}
