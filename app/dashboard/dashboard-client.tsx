"use client";

import { useMemo } from "react";
import { useGetInstancesQuery } from "@/lib/store/api/instancesApi";
import { useGetCollectionsQuery } from "@/lib/store/api/collectionsApi";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { StatusBadge } from "../components/ui/status-badge";
import { Avatar } from "../components/ui/avatar";
import { EmptyState } from "../components/ui/empty-state";
import { Skeleton, CardSkeleton, TableSkeleton } from "../components/ui/skeleton";
import {
  TrendingUp,
  CreditCard,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function DashboardClient() {
  const { data: instances = [], isLoading: instancesLoading } =
    useGetInstancesQuery();
  const { data: collections = [], isLoading: collectionsLoading } =
    useGetCollectionsQuery();

  const isLoading = instancesLoading || collectionsLoading;

  const totalCollected = useMemo(() => {
    if (!collections) return 0;
    return collections.reduce((sum, c) => sum + c.amount, 0);
  }, [collections]);

  const totalPayments = collections?.length ?? 0;
  const totalInstances = instances?.length ?? 0;

  const recentCollections = useMemo(() => {
    if (!collections) return [];
    return [...collections]
      .sort(
        (a, b) =>
          new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()
      )
      .slice(0, 8);
  }, [collections]);

  const instanceTotals = useMemo(() => {
    if (!instances || !collections) return [];
    return instances.map((instance) => {
      const instanceCollections = collections.filter(
        (c) => c.instanceId === instance.id
      );
      const total = instanceCollections.reduce((sum, c) => sum + c.amount, 0);
      return { instance, total, count: instanceCollections.length };
    });
  }, [instances, collections]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-44 w-full rounded-[var(--radius-2xl)]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
          {getGreeting()} 👋
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {formatDate()}
        </p>
      </div>

      {/* Hero balance card */}
      <div
        className="rounded-[var(--radius-2xl)] p-6 sm:p-8 text-white relative overflow-hidden"
        style={{ background: "var(--hero-gradient)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="relative">
          <p className="text-sm text-white/70 font-medium">Total Revenue</p>
          <p className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight">
            {formatNaira(totalCollected)}
          </p>
          {/* <p className="mt-3 text-sm text-white/70">
            {totalPayments} payment{totalPayments !== 1 ? "s" : ""} across{" "}
            {totalInstances} instance{totalInstances !== 1 ? "s" : ""}
          </p> */}
          <div className="flex gap-3 mt-5">
            <Link
              href="/instances/configure"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-[var(--radius-md)] text-sm font-medium text-white transition-colors"
            >
              <Plus size={16} />
              New Instance
            </Link>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md" hover className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--accent-soft)]">
              <TrendingUp size={20} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)] font-medium">
                Total Revenue
              </p>
              <p className="text-xl font-bold text-[var(--foreground)]">
                {formatNaira(totalCollected)}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--success-soft)]">
              <CreditCard size={20} className="text-[var(--success)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)] font-medium">
                Payments
              </p>
              <p className="text-xl font-bold text-[var(--foreground)]">
                {totalPayments}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--warning-soft)]">
              <Building2 size={20} className="text-[var(--warning)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)] font-medium">
                Instances
              </p>
              <p className="text-xl font-bold text-[var(--foreground)]">
                {totalInstances}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Instance breakdown */}
      {instanceTotals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">
            Collections by Instance
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {instanceTotals.map(({ instance, total, count }) => (
              <Link key={instance.id} href={`/instances/${instance.id}`}>
                <Card padding="md" hover className="h-full group">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={instance.name} size="sm" />
                      <div>
                        <p className="font-semibold text-[var(--foreground)] text-sm">
                          {instance.name}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {instance.paymentGateway === "myimopay" ? "MyIMO Pay" : "Paystack"}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    />
                  </div>
                  <div className="pt-3 border-t border-[var(--border)]">
                    <p className="text-xl font-bold text-[var(--foreground)]">
                      {formatNaira(total)}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      {count} collection{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Recent Transactions
          </h2>
          {recentCollections.length > 0 && (
            <span className="text-xs text-[var(--muted-foreground)]">
              Showing {recentCollections.length} of {totalPayments}
            </span>
          )}
        </div>

        {recentCollections.length === 0 ? (
          <EmptyState
            icon={<CreditCard size={32} />}
            title="No transactions yet"
            description="Your transactions will appear here once you start collecting payments."
            action={{
              label: "Create an instance",
              onClick: () => (window.location.href = "/instances/configure"),
            }}
          />
        ) : (
          <Card padding="none">
            <div className="divide-y divide-[var(--border)]">
              {recentCollections.map((c) => {
                const isCredit = c.amount > 0;
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--surface-soft)] transition-all duration-150"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        isCredit
                          ? "bg-[var(--success-soft)]"
                          : "bg-[var(--danger-soft)]"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownRight
                          size={16}
                          className="text-[var(--success)]"
                        />
                      ) : (
                        <ArrowUpRight
                          size={16}
                          className="text-[var(--danger)]"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">
                        {c.payer}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] truncate">
                        {c.paymentType || c.instanceName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`text-sm font-semibold ${
                          isCredit
                            ? "text-[var(--success)]"
                            : "text-[var(--danger)]"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                        {formatNaira(c.amount)}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {c.collectedAt}
                      </p>
                    </div>
                    <StatusBadge
                      status={c.paymentStatus as "successful" | "success" | "pending" | "failed" | "error"}
                      className="hidden sm:inline-flex"
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
