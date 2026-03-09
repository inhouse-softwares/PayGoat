import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";

export default async function LogsPage() {
  const role = await getSessionRole();

  if (!role) {
    redirect("/login");
  }

  if (role !== "admin") {
    redirect("/pay");
  }

  const logs = [
    { id: "LOG-2291", action: "Payment Created", actor: "Admin", time: "Mar 06, 2026 09:24" },
    { id: "LOG-2290", action: "Split Updated", actor: "Admin", time: "Mar 06, 2026 09:02" },
    { id: "LOG-2289", action: "Payment Failed", actor: "System", time: "Mar 05, 2026 17:41" },
  ];

  return (
    <>
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Logs</h1>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
        Review payment actions and operational events.
      </p>

      <section className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-[var(--surface-alt)] text-left text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Log ID</th>
              <th className="px-4 py-3 font-semibold">Action</th>
              <th className="px-4 py-3 font-semibold">Actor</th>
              <th className="px-4 py-3 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t border-[var(--border)] text-[var(--foreground)] even:bg-[var(--surface-soft)]"
              >
                <td className="px-4 py-3 font-mono text-xs font-medium text-[var(--foreground)]">{log.id}</td>
                <td className="px-4 py-3">{log.action}</td>
                <td className="px-4 py-3">{log.actor}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
