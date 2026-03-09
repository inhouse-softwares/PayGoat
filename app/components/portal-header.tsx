import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "../actions/auth";
import { ThemeToggle } from "./theme-toggle";
import type { UserRole } from "@/lib/auth-types";

type PortalHeaderProps = {
  currentPath: "/dashboard" | "/pay" | "/logs";
  role: UserRole;
};

const adminLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pay", label: "Pay" },
  { href: "/logs", label: "Logs" },
] as const;

const operatorLinks = [{ href: "/pay", label: "Pay" }] as const;

export function PortalHeader({ currentPath, role }: PortalHeaderProps) {
  const links = role === "admin" ? adminLinks : operatorLinks;

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-[0_10px_30px_-22px_rgba(20,30,60,0.35)] sm:px-6">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-[var(--accent)]" />
        <p className="text-base font-semibold text-[var(--foreground)]">PayGoat</p>
      </div>

      <nav className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-1 text-sm">
        {links.map((link) => {
          const isActive = currentPath === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-1.5 font-medium transition ${
                isActive
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <details className="group relative">
          <summary className="list-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-soft)]">
            <span className="inline-flex items-center gap-2">
              {role === "admin" ? "Admin" : "Operator"}
              <ChevronDown className="cursor-pointer text-xs text-[var(--muted-foreground)] transition group-open:rotate-180" />
            </span>
          </summary>

          <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[0_14px_30px_-16px_rgba(20,30,60,0.45)]">
            <button
              type="button"
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface-soft)]"
            >
              Settings
            </button>
            <button
              type="button"
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface-soft)]"
            >
              Change Password
            </button>
            <form action={logoutAction}>
              <button
                type="submit"
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--danger)] hover:bg-[var(--surface-soft)]"
              >
                Logout
              </button>
            </form>
          </div>
        </details>
      </div>
    </header>
  );
}
