"use client";

import { useMemo, useState } from "react";
import { useGetInstancesQuery } from "@/lib/store/api/instancesApi";
import { useGetCollectionsQuery } from "@/lib/store/api/collectionsApi";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { StatusBadge } from "@/app/components/ui/status-badge";
import { EmptyState } from "@/app/components/ui/empty-state";
import { PageHeader } from "@/app/components/ui/page-header";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { PaymentCollection } from "@/lib/payment-store";
import type { UserRole } from "@/lib/auth-types";

type PaymentStatus = "successful" | "success" | "pending" | "failed" | "error";

const PAGE_SIZE = 20;

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface TransactionHistoryClientProps {
  role: UserRole;
  instanceId: string | null;
}

export function TransactionHistoryClient({ role, instanceId }: TransactionHistoryClientProps) {
  const isAdmin = role === "admin";

  const { data: instances = [], isLoading: instancesLoading } =
    useGetInstancesQuery();

  // For operators, use their instanceId; for admins, fetch all (no filter)
  const fetchInstanceId = isAdmin ? undefined : instanceId ?? undefined;
  const { data: collections = [], isLoading: collectionsLoading } =
    useGetCollectionsQuery(fetchInstanceId);

  const isLoading = instancesLoading || collectionsLoading;

  // Build payment types list: admin sees all across instances, operator sees their instance's
  const paymentTypes = useMemo(() => {
    if (isAdmin) {
      return instances.flatMap((inst) =>
        (inst.paymentTypes ?? []).map((pt) => ({
          ...pt,
          instanceName: inst.name,
        }))
      );
    }
    const inst = instances[0];
    return (inst?.paymentTypes ?? []).map((pt) => ({
      ...pt,
      instanceName: inst?.name ?? "",
    }));
  }, [instances, isAdmin]);

  // Instance name lookup for admin view
  const instanceNameMap = useMemo(() => {
    const map = new Map<string, string>();
    instances.forEach((inst) => map.set(inst.id, inst.name));
    return map;
  }, [instances]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentTypeId, setPaymentTypeId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!collections) return [];

    let result = Array.isArray(collections) ? collections : [];

    if (fromDate) {
      const from = new Date(fromDate).getTime();
      result = result.filter((c) => new Date(c.collectedAt).getTime() >= from);
    }

    if (toDate) {
      const to = new Date(toDate).getTime() + 86_400_000;
      result = result.filter((c) => new Date(c.collectedAt).getTime() < to);
    }

    if (paymentTypeId) {
      result = result.filter((c) => c.paymentTypeId === paymentTypeId);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          (c.payer && c.payer.toLowerCase().includes(q)) ||
          (c.paymentReference && c.paymentReference.toLowerCase().includes(q)) ||
          (c.instanceName && c.instanceName.toLowerCase().includes(q))
      );
    }

    return [...result].sort(
      (a, b) =>
        new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()
    );
  }, [collections, fromDate, toDate, paymentTypeId, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleReset() {
    setFromDate("");
    setToDate("");
    setPaymentTypeId("");
    setSearch("");
    setPage(1);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full rounded-[var(--radius-xl)]" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-[var(--radius-lg)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Transaction History"
        description={isAdmin ? "All transactions across every instance." : "Search and filter your payment transactions."}
        backLink={{ href: "/dashboard", label: "Dashboard" }}
      />

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <Input
              type="date"
              label="From"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Input
              type="date"
              label="To"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-auto sm:min-w-[200px]">
            <label className="text-sm font-medium text-[var(--foreground)] mb-1.5 block">Payment Type</label>
            <select
              value={paymentTypeId}
              onChange={(e) => {
                setPaymentTypeId(e.target.value);
                setPage(1);
              }}
              className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
            >
              <option value="">All types</option>
              {paymentTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.name} — {formatNaira(pt.amount)}
                  {isAdmin ? ` (${pt.instanceName})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Search"
              placeholder="Reference, payer, or instance..."
              icon={<Search size={16} />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-end">
            <Button variant="secondary" size="md" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""} found
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft size={14} />}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              Prev
            </Button>
            <span className="text-xs text-[var(--muted-foreground)]">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={32} />}
          title="No transactions found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <>
          {/* Desktop table */}
          <Card padding="none" className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Payer</th>
                    {isAdmin && (
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Instance</th>
                    )}
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Type</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Reference</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {paginated.map((c) => (
                    <tr key={c.id} className="hover:bg-[var(--surface-soft)] transition-colors">
                      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)] whitespace-nowrap">
                        {formatDateTime(c.collectedAt)}
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                        {c.payer}
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3">
                          <Badge variant="info">{instanceNameMap.get(c.instanceId) ?? c.instanceName}</Badge>
                        </td>
                      )}
                      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                        {c.paymentType ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
                        {formatNaira(c.amount)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)] max-w-[140px] truncate">
                        {c.paymentReference ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={c.paymentStatus as PaymentStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paginated.map((c) => (
              <Card key={c.id} padding="md">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--foreground)] truncate">{c.payer}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{c.paymentType ?? "Payment"}</p>
                  </div>
                  <StatusBadge status={c.paymentStatus as PaymentStatus} />
                </div>
                {isAdmin && (
                  <Badge variant="info" className="mb-2">{instanceNameMap.get(c.instanceId) ?? c.instanceName}</Badge>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--foreground)]">{formatNaira(c.amount)}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">{formatDateTime(c.collectedAt)}</span>
                </div>
                {c.paymentReference && (
                  <p className="mt-1 font-mono text-xs text-[var(--muted-foreground)] truncate">{c.paymentReference}</p>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
