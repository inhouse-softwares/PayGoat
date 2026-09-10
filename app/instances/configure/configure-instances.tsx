"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { FormField, FormFieldType, PaymentGateway, PaymentGatewayConfiguration } from "@/lib/payment-store";
import { useCreateInstanceMutation, useGetInstancesQuery } from "@/lib/store/api/instancesApi";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Modal } from "../../components/ui/modal";
import { PageHeader } from "../../components/ui/page-header";
import { Check, Copy, CreditCard, Plus, Trash2 } from "lucide-react";

type PaymentTypeInput = { name: string; description: string; amount: string };
type FormFieldInput = { key: string; label: string; type: FormFieldType; required: boolean; options: string };
const fieldTypes: Array<{ value: FormFieldType; label: string }> = [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "date", label: "Date" }, { value: "select", label: "Select" }];
const reservedKeys = new Set(["name", "email"]);

export function ConfigureInstances() {
  const { data: instances = [] } = useGetInstancesQuery();
  const [createInstance, { isLoading }] = useCreateInstanceMutation();
  const [name, setName] = useState("");
  const [gateway, setGateway] = useState<PaymentGateway>("myimopay");
  const [settlementId, setSettlementId] = useState("");
  const [paymentTypes, setPaymentTypes] = useState<PaymentTypeInput[]>([]);
  const [formFields, setFormFields] = useState<FormFieldInput[]>([]);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function addPaymentType() { setPaymentTypes((types) => [...types, { name: "", description: "", amount: "" }]); }
  function updatePaymentType(index: number, patch: Partial<PaymentTypeInput>) { setPaymentTypes((types) => types.map((type, i) => i === index ? { ...type, ...patch } : type)); }
  function addFormField() { setFormFields((fields) => [...fields, { key: "", label: "", type: "text", required: true, options: "" }]); }
  function updateFormField(index: number, patch: Partial<FormFieldInput>) { setFormFields((fields) => fields.map((field, i) => i === index ? { ...field, ...patch, ...(patch.label !== undefined ? { key: patch.label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") } : {}) } : field)); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (paymentTypes.length === 0 || paymentTypes.some((type) => !type.name.trim() || Number(type.amount) <= 0)) return alert("Add at least one payment type with a valid name and amount.");
    if (gateway === "myimopay" && !settlementId.trim()) return alert("A MyIMO Pay settlement ID is required.");
    if (formFields.some((field) => !field.label.trim() || reservedKeys.has(field.key))) return alert("Custom fields need a label and cannot use name or email.");
    try {
      const gatewayConfiguration: PaymentGatewayConfiguration = gateway === "myimopay"
        ? { gateway, config: { settlementId: settlementId.trim() } }
        : { gateway, config: {} };
      const result = await createInstance({
        name: name.trim(), summary: `${name.trim()} payment collection.`, idclPercent: 0, gatewayConfiguration,
        formFields: formFields.map((field): FormField => ({ key: field.key, label: field.label.trim(), type: field.type, required: field.required, options: field.type === "select" ? field.options.split(",").map((option) => option.trim()).filter(Boolean) : undefined })),
        paymentTypes: paymentTypes.map((type) => ({ name: type.name.trim(), description: type.description.trim() || undefined, amount: Number(type.amount) })),
      }).unwrap();
      setCredentials(result.operatorEmail && result.operatorPassword ? { email: result.operatorEmail, password: result.operatorPassword } : null);
      setName(""); setSettlementId(""); setPaymentTypes([]); setFormFields([]);
    } catch (error: unknown) { const value = error as { data?: { error?: string } }; alert(value.data?.error ?? "Failed to create payment instance"); }
  }

  function copy(value: string, field: string) { navigator.clipboard.writeText(value); setCopied(field); setTimeout(() => setCopied(null), 1500); }
  return <div className="animate-fade-in"><PageHeader title="Configure Instances" description="Create a payment instance and choose the gateway that processes its payments." backLink={{ href: "/instances", label: "Instances" }} />
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]"><form onSubmit={submit} className="space-y-6">
      <Card padding="lg"><h2 className="text-base font-semibold">Instance details</h2><div className="mt-4"><Input label="Instance name" value={name} onChange={(event) => setName(event.target.value)} required /></div></Card>
      <Card padding="lg"><div className="flex items-center gap-2"><CreditCard size={20} /><div><h2 className="text-base font-semibold">Payment gateway</h2><p className="text-xs text-[var(--muted-foreground)]">Gateway settings are stored per instance.</p></div></div>
        <label className="mt-4 block text-sm font-medium">Gateway<select value={gateway} onChange={(event) => setGateway(event.target.value as PaymentGateway)} className="mt-1 h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3"><option value="myimopay">MyIMO Pay</option><option value="paystack">Paystack — coming soon</option></select></label>
        {gateway === "myimopay" ? <div className="mt-4"><Input label="Settlement ID" placeholder="MyIMO Pay settlement order UUID" value={settlementId} onChange={(event) => setSettlementId(event.target.value)} required /><p className="mt-2 text-xs text-[var(--muted-foreground)]">Create and manage beneficiaries in MyIMO Pay, then paste the settlement order ID here.</p></div> : <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--warning-soft)] p-3 text-sm">Paystack is not available yet. You cannot create a Paystack instance until its integration is released.</div>}
      </Card>
      <Card padding="lg"><h2 className="text-base font-semibold">Payment types</h2><p className="text-xs text-[var(--muted-foreground)]">Define reasons and amounts. Settlement is configured once at the instance gateway.</p><div className="mt-4 space-y-3">{paymentTypes.map((type, index) => <div key={index} className="grid gap-2 sm:grid-cols-[1fr_150px_auto]"><input value={type.name} onChange={(event) => updatePaymentType(index, { name: event.target.value })} placeholder="Payment reason" className="h-10 rounded border px-3" required /><input type="number" min="0" step="0.01" value={type.amount} onChange={(event) => updatePaymentType(index, { amount: event.target.value })} placeholder="Amount" className="h-10 rounded border px-3" required /><button type="button" onClick={() => setPaymentTypes((types) => types.filter((_, i) => i !== index))}><Trash2 size={16} /></button><input value={type.description} onChange={(event) => updatePaymentType(index, { description: event.target.value })} placeholder="Description (optional)" className="h-10 rounded border px-3 sm:col-span-2" /></div>)}</div><Button type="button" variant="secondary" size="sm" icon={<Plus size={14} />} onClick={addPaymentType} className="mt-4">Add payment type</Button></Card>
      <Card padding="lg"><h2 className="text-base font-semibold">Operator form fields</h2><div className="mt-4 space-y-3">{formFields.map((field, index) => <div key={index} className="grid gap-2 sm:grid-cols-[1fr_130px_auto]"><input value={field.label} onChange={(event) => updateFormField(index, { label: event.target.value })} placeholder="Field label" className="h-10 rounded border px-3" required /><select value={field.type} onChange={(event) => updateFormField(index, { type: event.target.value as FormFieldType })} className="h-10 rounded border px-3">{fieldTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select><button type="button" onClick={() => setFormFields((fields) => fields.filter((_, i) => i !== index))}><Trash2 size={16} /></button>{field.type === "select" && <input value={field.options} onChange={(event) => updateFormField(index, { options: event.target.value })} placeholder="Options, separated by commas" className="h-10 rounded border px-3 sm:col-span-2" />}<label className="text-xs"><input type="checkbox" checked={field.required} onChange={(event) => updateFormField(index, { required: event.target.checked })} /> Required</label></div>)}</div><Button type="button" variant="secondary" size="sm" icon={<Plus size={14} />} onClick={addFormField} className="mt-4">Add custom field</Button></Card>
      <Button type="submit" loading={isLoading} disabled={gateway === "paystack"} className="w-full" size="lg">Create instance</Button>
    </form><Card padding="lg" className="h-fit"><h3 className="font-semibold">Existing instances</h3><div className="mt-3 space-y-2">{instances.map((instance) => <Link key={instance.id} href={`/instances/${instance.id}`} className="block rounded border p-3"><p className="font-medium">{instance.name}</p><p className="text-xs text-[var(--muted-foreground)]">{instance.paymentGateway}</p></Link>)}</div></Card></div>
    <Modal open={Boolean(credentials)} onClose={() => setCredentials(null)} title="Instance created"><p className="mb-4 text-sm">Save these operator credentials; the password will not be shown again.</p>{credentials && <div className="space-y-3"><p><strong>Email:</strong> {credentials.email} <button onClick={() => copy(credentials.email, "email")}>{copied === "email" ? <Check size={14} /> : <Copy size={14} />}</button></p><p><strong>Password:</strong> {credentials.password} <button onClick={() => copy(credentials.password, "password")}>{copied === "password" ? <Check size={14} /> : <Copy size={14} />}</button></p></div>}</Modal>
  </div>;
}
