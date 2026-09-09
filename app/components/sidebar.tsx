"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  UserCircle,
  LogOut,
  Sun,
  Moon,
  User,
} from "lucide-react";
import type { UserRole } from "@/lib/auth-types";
import { logoutAction } from "../actions/auth";
import { useEffect, useState } from "react";
import Image from "next/image";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const adminNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/instances", label: "Instances", icon: <Settings size={20} /> },
  { href: "/transactions", label: "Transactions", icon: <FileText size={20} /> },
  { href: "/operators", label: "Operators", icon: <Users size={20} /> },
  { href: "/logs", label: "Logs", icon: <FileText size={20} /> },
];

const operatorNav: NavItem[] = [
  { href: "/pay", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/transactions", label: "Transactions", icon: <FileText size={20} /> },
  { href: "/profile", label: "Profile", icon: <User size={20} /> },
];

interface SidebarProps {
  currentPath: string;
  role: UserRole;
}

export function Sidebar({ currentPath, role }: SidebarProps) {
  const links = role === "admin" ? adminNav : operatorNav;

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-[var(--surface)] border-r border-[var(--border)] z-40">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[var(--border)]">
        <div className="rounded-[var(--radius-md)] flex items-center justify-center">
          <Image src="/logo.svg" alt="PayGoat" width={36} height={36} className="w-12 object-cover" />
        </div>
        <span className="text-base font-bold text-[var(--foreground)] tracking-tight">
          PayGoat
        </span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map((link) => {
          const isActive =
            currentPath === link.href ||
            currentPath.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                group flex items-center gap-3 px-3 py-2.5
                rounded-[var(--radius-md)]
                text-sm font-medium
                transition-all duration-150 ease-out
                ${
                  isActive
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
                }
              `}
            >
              <span
                className={`
                  shrink-0 transition-transform duration-150
                  ${!isActive ? "group-hover:scale-110" : ""}
                `}
              >
                {link.icon}
              </span>
              {link.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border)]">
        <ThemeToggleCompact />
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] transition-all duration-150 cursor-pointer"
          >
            <LogOut size={20} />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}

function ThemeToggleCompact() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("paygoat-theme");
    setDark(stored === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("paygoat-theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] transition-all duration-150 cursor-pointer mb-1"
    >
      <span className="transition-transform duration-200">
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </span>
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
