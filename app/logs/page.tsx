import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { PageHeader } from "../components/ui/page-header";
import { EmptyState } from "../components/ui/empty-state";
import { FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default async function LogsPage() {
  const role = await getSessionRole();

  if (!role) {
    redirect("/login");
  }

  if (role !== "admin") {
    redirect("/pay");
  }

  const logs = [
    {
      id: "LOG-2291",
      action: "Payment Created",
      actor: "Admin",
      time: "Mar 06, 2026 09:24",
      type: "success" as const,
    },
    {
      id: "LOG-2290",
      action: "Split Updated",
      actor: "Admin",
      time: "Mar 06, 2026 09:02",
      type: "info" as const,
    },
    {
      id: "LOG-2289",
      action: "Payment Failed",
      actor: "System",
      time: "Mar 05, 2026 17:41",
      type: "danger" as const,
    },
  ];

  const typeIcons = {
    success: <CheckCircle size={16} className="text-[var(--success)]" />,
    info: <Clock size={16} className="text-[var(--accent)]" />,
    danger: <AlertCircle size={16} className="text-[var(--danger)]" />,
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Logs"
        description="Review payment actions and operational events."
      />

      {logs.length === 0 ? (
        <EmptyState
          icon={<FileText size={32} />}
          title="No logs yet"
          description="Audit events will appear here as actions are performed."
        />
      ) : (
        <Card padding="none">
          <div className="divide-y divide-[var(--border)]">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--surface-soft)] transition-colors"
              >
                <div className="p-2 rounded-full bg-[var(--surface-alt)]">
                  {typeIcons[log.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {log.action}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {log.actor}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono text-[var(--muted-foreground)]">
                    {log.id}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {log.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
