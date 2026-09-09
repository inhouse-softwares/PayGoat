"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  UserCircle,
} from "lucide-react";
import type { UserRole } from "@/lib/auth-types";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const adminNav: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: <LayoutDashboard size={22} /> },
  { href: "/instances", label: "Instances", icon: <Settings size={22} /> },
  { href: "/operators", label: "Operators", icon: <Users size={22} /> },
  { href: "/logs", label: "Logs", icon: <FileText size={22} /> },
];

const operatorNav: NavItem[] = [
  { href: "/pay", label: "Home", icon: <LayoutDashboard size={22} /> },
  { href: "/pay/transactions", label: "History", icon: <FileText size={22} /> },
  { href: "/profile", label: "Profile", icon: <UserCircle size={22} /> },
];

interface MobileNavProps {
  currentPath: string;
  role: UserRole;
}

export function MobileNav({ currentPath, role }: MobileNavProps) {
  const links = role === "admin" ? adminNav : operatorNav;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-xl border-t border-[var(--border)] px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {links.map((link) => {
          const isActive =
            currentPath === link.href ||
            currentPath.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex flex-col items-center gap-1 px-3 py-1.5
                rounded-[var(--radius-md)]
                text-[10px] font-medium
                transition-all duration-150 ease-out
                ${
                  isActive
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted-foreground)] active:scale-95"
                }
              `}
            >
              <span
                className={`
                  p-1.5 rounded-[var(--radius-md)] transition-all duration-150
                  ${isActive ? "bg-[var(--accent-soft)] scale-110" : ""}
                `}
              >
                {link.icon}
              </span>
              <span className={isActive ? "font-semibold" : ""}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
