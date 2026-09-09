"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, EyeOff, Copy, Check, RefreshCw, Users } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { EmptyState } from "../components/ui/empty-state";
import { PageHeader } from "../components/ui/page-header";
import { Skeleton, TableSkeleton } from "../components/ui/skeleton";

type Operator = {
  id: string;
  email: string;
  plainPassword: string | null;
  instanceId: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  instance: { id: string; name: string; splitCode: string } | null;
};

function PasswordCell({ password }: { password: string | null }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!password)
    return (
      <span className="text-[var(--muted-foreground)] italic text-xs">—</span>
    );

  function handleCopy() {
    navigator.clipboard.writeText(password!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs">
        {visible ? password : "••••••••"}
      </span>
      <button
        onClick={() => setVisible((v) => !v)}
        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
        title={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
      <button
        onClick={handleCopy}
        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
        title="Copy password"
      >
        {copied ? (
          <Check size={14} className="text-[var(--success)]" />
        ) : (
          <Copy size={14} />
        )}
      </button>
    </div>
  );
}

export default function OperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOperators = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/operators")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setOperators(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadOperators();
  }, [loadOperators]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Operators"
        description="All operator accounts, their assigned instances, and login activity."
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={loadOperators}
            loading={loading}
            icon={<RefreshCw size={14} />}
          >
            Refresh
          </Button>
        }
      />

      {loading ? (
        <TableSkeleton rows={4} />
      ) : operators.length === 0 ? (
        <EmptyState
          icon={<Users size={32} />}
          title="No operators yet"
          description="Operators are created automatically when you configure a new payment instance."
        />
      ) : (
        <>
          {/* Desktop table */}
          <Card padding="none" className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Operator
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Password
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Instance
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Last Login
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {operators.map((op) => (
                    <tr
                      key={op.id}
                      className="hover:bg-[var(--surface-soft)] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={op.email} size="sm" />
                          <span className="font-medium text-[var(--foreground)]">
                            {op.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <PasswordCell password={op.plainPassword} />
                      </td>
                      <td className="px-5 py-3.5">
                        {op.instance ? (
                          <Badge variant="info">{op.instance.name}</Badge>
                        ) : (
                          <span className="text-[var(--muted-foreground)] text-xs">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[var(--muted-foreground)] text-xs">
                        {op.lastLoginAt
                          ? new Date(op.lastLoginAt).toLocaleString()
                          : "Never"}
                      </td>
                      <td className="px-5 py-3.5 text-[var(--muted-foreground)] text-xs">
                        {new Date(op.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {operators.map((op) => (
              <Card key={op.id} padding="md">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={op.email} size="md" />
                    <div>
                      <p className="font-medium text-[var(--foreground)] text-sm">
                        {op.email}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {op.instance?.name || "Unassigned"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-[var(--border)] space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--muted-foreground)]">
                      Password
                    </span>
                    <PasswordCell password={op.plainPassword} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--muted-foreground)]">
                      Last Login
                    </span>
                    <span className="text-[var(--foreground)]">
                      {op.lastLoginAt
                        ? new Date(op.lastLoginAt).toLocaleString()
                        : "Never"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
