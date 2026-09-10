"use client";

import { useMemo } from "react";
import { useGetInstancesQuery } from "@/lib/store/api/instancesApi";
import { useGetCollectionsQuery } from "@/lib/store/api/collectionsApi";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { StatusBadge } from "../components/ui/status-badge";
import { Avatar } from "../components/ui/avatar";
import { EmptyState } from "../components/ui/empty-state";
import { Skeleton, CardSkeleton } from "../components/ui/skeleton";
import { PageHeader } from "../components/ui/page-header";
import { Button } from "../components/ui/button";
import {
  TrendingUp,
  CreditCard,
  Clock,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

type PaymentStatus = "successful" | "success" | "pending" | "failed" | "error";

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

export function OperatorDashboardClient() {
  const { data: instances = [], isLoading: instancesLoading } =
    useGetInstancesQuery();

  const instance = instances[0];

  const { data: collections = [], isLoading: collectionsLoading } =
    useGetCollectionsQuery(instance?.id);

  const isLoading = instancesLoading || collectionsLoading;

  const totalCollected = useMemo(() => {
    if (!collections) return 0;
    return collections.reduce((sum, c) => sum + c.amount, 0);
  }, [collections]);

  const successfulPayments = useMemo(() => {
    return collections.filter(
      (c) =>
        c.paymentStatus === "successful" || c.paymentStatus === "success"
    );
  }, [collections]);

  const pendingPayments = useMemo(() => {
    return collections.filter((c) => c.paymentStatus === "pending");
  }, [collections]);

  const recentCollections = useMemo(() => {
    if (!collections) return [];
    return [...collections]
      .sort(
        (a, b) =>
          new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()
      )
      .slice(0, 5);
  }, [collections]);

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
      </div>
    );
  }

  if (!instance) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={<Building2 size={32} />}
          title="No instance assigned"
          description="Contact your administrator to assign you to a payment instance."
        />
      </div>
    );
  }

  const paymentTypes = instance.paymentTypes ?? [];

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
          <p className="text-sm text-white/70 font-medium">Total Collected</p>
          <p className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight">
            {formatNaira(totalCollected)}
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
            <Building2 size={14} />
            <span>{instance.name}</span>
            <span className="opacity-50">·</span>
            <span className="font-mono text-xs">{instance.splitCode}</span>
          </div>
          <div className="flex gap-3 mt-5">
            <Link
              href={`/pay/${instance.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-[var(--radius-md)] text-sm font-medium text-white transition-colors"
            >
              <Plus size={16} />
              New Collection
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
                Successful Payments
              </p>
              <p className="text-xl font-bold text-[var(--foreground)]">
                {successfulPayments.length}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--warning-soft)]">
              <Clock size={20} className="text-[var(--warning)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)] font-medium">
                Pending Payments
              </p>
              <p className="text-xl font-bold text-[var(--foreground)]">
                {pendingPayments.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Types section */}
      <div>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Payment Types
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Click a payment type to start collecting
          </p>
        </div>

        {paymentTypes.length === 0 ? (
          <EmptyState
            icon={<CreditCard size={32} />}
            title="No payment types"
            description="No payment types have been configured for this instance yet."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {paymentTypes.map((pt) => (
              <Link key={pt.id} href={`/pay?paymentType=${pt.id}`}>
                <Card padding="md" hover className="h-full group cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--foreground)]">
                        {pt.name}
                      </p>
                      {pt.description && (
                        <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">
                          {pt.description}
                        </p>
                      )}
                      <p className="text-sm font-bold text-[var(--accent)] mt-2">
                        {formatNaira(pt.amount)}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-[var(--muted-foreground)] shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Recent Transactions
          </h2>
          {recentCollections.length > 0 && (
            <Link
              href="/pay/transactions"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {recentCollections.length === 0 ? (
          <EmptyState
            icon={<CreditCard size={32} />}
            title="No transactions yet"
            description="Your transactions will appear here once you start collecting payments."
          />
        ) : (
          <Card padding="none">
            <div className="divide-y divide-[var(--border)]">
              {recentCollections.map((c) => {
                const isSuccess =
                  c.paymentStatus === "successful" ||
                  c.paymentStatus === "success";
                const isPending = c.paymentStatus === "pending";
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--surface-soft)] transition-all duration-150"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        isSuccess
                          ? "bg-[var(--success-soft)]"
                          : "bg-[var(--warning-soft)]"
                      }`}
                    >
                      {isSuccess ? (
                        <ArrowDownRight
                          size={16}
                          className="text-[var(--success)]"
                        />
                      ) : (
                        <ArrowUpRight
                          size={16}
                          className={
                            isPending
                              ? "text-[var(--warning)]"
                              : "text-[var(--danger)]"
                          }
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">
                        {c.payer}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] truncate">
                        {c.paymentType || "General"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`text-sm font-semibold ${
                          isSuccess
                            ? "text-[var(--success)]"
                            : "text-[var(--foreground)]"
                        }`}
                      >
                        {formatNaira(c.amount)}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {c.collectedAt}
                      </p>
                    </div>
                    <StatusBadge
                      status={(c.paymentStatus as PaymentStatus) ?? "pending"}
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
