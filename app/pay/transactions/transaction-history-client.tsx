"use client";

import { useMemo, useState } from "react";
import { useGetInstancesQuery } from "@/lib/store/api/instancesApi";
import { useGetCollectionsQuery } from "@/lib/store/api/collectionsApi";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "../../components/ui/status-badge";
import { EmptyState } from "../../components/ui/empty-state";
import { PageHeader } from "../../components/ui/page-header";
import { Skeleton } from "../../components/ui/skeleton";
import { Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { PaymentCollection, PaymentCollectionMetadata } from "@/lib/payment-store";

type PaymentStatus = "successful" | "success" | "pending" | "failed" | "error";

const PAGE_SIZE = 20;

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

export function TransactionHistoryClient() {
  const { data: instances = [], isLoading: instancesLoading } =
    useGetInstancesQuery();

  const instance = instances[0];

  const { data: collections = [], isLoading: collectionsLoading } =
    useGetCollectionsQuery(instance?.id);

  const isLoading = instancesLoading || collectionsLoading;

  const paymentTypes = instance?.paymentTypes ?? [];

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentTypeId, setPaymentTypeId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!collections) return [];

    let result = collections;

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
          (c.paymentReference && c.paymentReference.toLowerCase().includes(q))
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
        description="Search and filter your payment transactions."
        backLink={{ href: "/pay", label: "Back to Dashboard" }}
      />

      {/* Filters */}
      <Card padding="md" className="mb-6">
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
          <div className="w-full sm:w-auto">
            <label className="text-sm font-medium text-[var(--foreground)] block mb-1.5">
              Payment Type
            </label>
            <select
              value={paymentTypeId}
              onChange={(e) => {
                setPaymentTypeId(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 px-3.5 text-sm bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 focus:outline-none transition-all duration-150"
            >
              <option value="">All payment types</option>
              {paymentTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.name} — {formatNaira(pt.amount)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              label="Search"
              placeholder="Reference or payer name"
              icon={<Search size={16} />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" size="sm" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Results */}
      {paginated.length === 0 ? (
        <EmptyState
          icon={<Search size={32} />}
          title="No transactions found"
          description="Try adjusting your filters or search terms."
        />
      ) : (
        <>
          {/* Desktop table */}
          <Card padding="none" className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">
                      Payer
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">
                      Payment Type
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--muted-foreground)]">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">
                      Reference
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {paginated.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-[var(--surface-soft)] transition-colors"
                    >
                      <td className="px-4 py-3 text-[var(--muted-foreground)] whitespace-nowrap">
                        {formatDateTime(c.collectedAt)}
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                        {c.payer}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {c.paymentType || "General"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
                        {formatNaira(c.amount)}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)] font-mono text-xs">
                        {c.paymentReference || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={(c.paymentStatus as PaymentStatus) ?? "pending"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {paginated.map((c) => (
              <Card key={c.id} padding="md">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--foreground)] truncate">
                      {c.payer}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {c.paymentType || "General"}
                    </p>
                  </div>
                  <StatusBadge
                    status={(c.paymentStatus as PaymentStatus) ?? "pending"}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg font-bold text-[var(--foreground)]">
                    {formatNaira(c.amount)}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {formatDateTime(c.collectedAt)}
                  </p>
                </div>
                {c.paymentReference && (
                  <p className="text-xs text-[var(--muted-foreground)] font-mono mt-2">
                    Ref: {c.paymentReference}
                  </p>
                )}
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-[var(--muted-foreground)]">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length} transactions
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<ChevronLeft size={16} />}
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<ChevronRight size={16} />}
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
