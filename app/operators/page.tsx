"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, EyeOff, Copy, Check, RefreshCw } from "lucide-react";

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

  if (!password) return <span className="text-[var(--muted-foreground)] italic">—</span>;

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
        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        title={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={handleCopy}
        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        title="Copy password"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
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

  useEffect(() => { loadOperators(); }, [loadOperators]);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Operators</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            All operator accounts, their assigned instances, and login activity.
          </p>
        </div>
        <button
          onClick={loadOperators}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-[var(--surface-alt)] text-left text-xs uppercase tracking-widest text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Password</th>
              <th className="px-4 py-3">Assigned Instance</th>
              <th className="px-4 py-3">Split Code</th>
              <th className="px-4 py-3">Last Login</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                  Loading…
                </td>
              </tr>
            ) : operators.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                  No operators yet. They are created automatically when an instance is created.
                </td>
              </tr>
            ) : (
              operators.map((op) => (
                <tr key={op.id} className="border-t border-[var(--border)] text-[var(--foreground)]">
                  <td className="px-4 py-3 font-mono text-xs">{op.email}</td>
                  <td className="px-4 py-3">
                    <PasswordCell password={op.plainPassword} />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {op.instance?.name ?? (
                      <span className="text-[var(--muted-foreground)]">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
                    {op.instance?.splitCode ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {op.lastLoginAt
                      ? new Date(op.lastLoginAt).toLocaleString()
                      : <span className="italic">Never</span>}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {new Date(op.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
