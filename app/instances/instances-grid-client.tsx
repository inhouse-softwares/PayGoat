"use client";

import { useGetInstancesQuery } from "@/lib/store/api/instancesApi";
import { Card } from "../components/ui/card";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/ui/empty-state";
import { PageHeader } from "../components/ui/page-header";
import { Skeleton } from "../components/ui/skeleton";
import { Building2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function InstancesGridClient() {
  const { data: instances = [], isLoading } = useGetInstancesQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 rounded-[var(--radius-xl)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Instances"
        description="All configured payment instances and their collection stats."
        actions={
          <Link href="/instances/configure">
            <Button icon={<Plus size={16} />}>Configure New Instance</Button>
          </Link>
        }
      />

      {instances.length === 0 ? (
        <EmptyState
          icon={<Building2 size={32} />}
          title="No instances yet"
          description="Create your first instance to start collecting payments."
          action={{
            label: "Create your first instance",
            onClick: () => (window.location.href = "/instances/configure"),
          }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {instances.map((instance) => (
            <Link key={instance.id} href={`/instances/${instance.id}`}>
              <Card padding="none" hover className="h-full group cursor-pointer">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={instance.name} size="md" />
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)]">
                          {instance.name}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)] font-mono">
                          {instance.splitCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-2xl font-bold text-[var(--foreground)]">
                      {formatNaira(instance._sum?.collections?.amount ?? 0)}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {instance._count?.collections ?? 0} collections
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-soft)] rounded-b-[var(--radius-xl)] flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--accent)]">
                    View details
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-[var(--accent)] transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
