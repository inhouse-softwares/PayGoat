import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "../actions/auth";
import { ThemeToggle } from "./theme-toggle";
import type { UserRole } from "@/lib/auth-types";
import Image from "next/image";

type PortalHeaderProps = {
  currentPath: "/dashboard" | "/pay" | "/pay/configure" | "/logs" | "/operators" | "/profile";
  role: UserRole;
};

const adminLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pay/configure", label: "Configure" },
  { href: "/operators", label: "Operators" },
  { href: "/logs", label: "Logs" },
] as const;

const operatorLinks = [
  { href: "/pay", label: "Pay" },
  { href: "/profile", label: "Profile" },
] as const;

export function PortalHeader({ currentPath, role }: PortalHeaderProps) {
  const links = role === "admin" ? adminLinks : operatorLinks;

  return (
    <header className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[0_10px_30px_-22px_rgba(20,30,60,0.35)] sm:px-6">
      {/* Top row: logo + actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Image src="/logo.svg" alt="PayGoat" width={36} height={36} className="w-9" />
          <p className="text-sm font-semibold text-[var(--foreground)] sm:text-base">PayGoat</p>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <details className="group relative">
            <summary className="list-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-soft)] cursor-pointer">
              <span className="inline-flex items-center gap-1.5">
                {role === "admin" ? "Admin" : "Operator"}
                <ChevronDown className="h-3.5 w-3.5 text-[var(--muted-foreground)] transition group-open:rotate-180" />
              </span>
            </summary>
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[0_14px_30px_-16px_rgba(20,30,60,0.45)]">
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

      {/* Nav row */}
      <nav className="mt-3 flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-1 text-sm overflow-x-auto">
        {links.map((link) => {
          const isActive = currentPath === link.href || currentPath.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-center font-medium transition ${
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
    </header>
  );
}
