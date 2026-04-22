import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "../actions/auth";
import { ThemeToggle } from "./theme-toggle";
import type { UserRole } from "@/lib/auth-types";
import Image from "next/image";

type PortalHeaderProps = {
  currentPath: "/dashboard" | "/pay" | "/pay/configure" | "/logs";
  role: UserRole;
};

const adminLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pay/configure", label: "Configure Instances" },
  { href: "/logs", label: "Logs" },
] as const;

const operatorLinks = [{ href: "/pay", label: "Pay" }] as const;

export function PortalHeader({ currentPath, role }: PortalHeaderProps) {
  const links = role === "admin" ? adminLinks : operatorLinks;

  return (
    <header className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-[0_10px_30px_-22px_rgba(20,30,60,0.35)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-0">
          <Image src="/logo.svg" alt="PayGoat" width={40} height={40} className="w-10"/>
          <p className="text-base font-semibold text-[var(--foreground)]">PayGoat</p>
        </div>
        
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <details className="group relative">
            <summary className="list-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-soft)]">
              <span className="inline-flex cursor-pointer items-center gap-2">
                {role === "admin" ? "Admin" : "Operator"}
                <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)] transition group-open:rotate-180" />
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
      </div>

      <nav className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-1 text-sm">
        {links.map((link) => {
          const isActive = currentPath === link.href || currentPath.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 rounded-lg px-3 py-1.5 text-center font-medium transition sm:flex-none ${
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

      <div className="hidden items-center gap-2 sm:flex">
        <ThemeToggle />

        <details className="group relative">
          <summary className="list-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-soft)]">
            <span className="inline-flex cursor-pointer items-center gap-2">
              {role === "admin" ? "Admin" : "Operator"}
              <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)] transition group-open:rotate-180" />
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
