"use client";

import { LogOut, Moon, Sun } from "lucide-react";
import { logoutAction } from "../actions/auth";
import type { UserRole } from "@/lib/auth-types";
import { useEffect, useState } from "react";

interface MobileHeaderProps {
  currentPath: string;
  role: UserRole;
}

export function MobileHeader({ currentPath, role }: MobileHeaderProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("paygoat-theme");
    setDark(stored === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("paygoat-theme", next ? "dark" : "light");
  };

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-[var(--surface)]/90 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="flex items-center justify-between px-4 h-14 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--accent)] flex items-center justify-center">
            <span className="text-white font-bold text-xs">PG</span>
          </div>
          <span className="text-sm font-bold text-[var(--foreground)]">
            PayGoat
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-[var(--radius-md)] text-[var(--muted-foreground)] hover:bg-[var(--surface-soft)] active:scale-95 transition-all duration-150 cursor-pointer"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <form action={logoutAction}>
            <button
              type="submit"
              className="p-2 rounded-[var(--radius-md)] text-[var(--muted-foreground)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] active:scale-95 transition-all duration-150 cursor-pointer"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
