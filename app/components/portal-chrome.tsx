"use client";

import { usePathname } from "next/navigation";
import { PortalHeader } from "./portal-header";
import type { UserRole } from "@/lib/auth-types";

type PortalRoute = "/dashboard" | "/pay" | "/pay/configure" | "/logs";

function getPortalRoute(pathname: string): PortalRoute | null {
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return "/dashboard";
  }

  if (pathname === "/pay/configure" || pathname.startsWith("/pay/configure/")) {
    return "/pay/configure";
  }

  if (pathname === "/pay" || pathname.startsWith("/pay/")) {
    return "/pay";
  }

  if (pathname === "/logs" || pathname.startsWith("/logs/")) {
    return "/logs";
  }

  return null;
}

export function PortalChrome({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole | null;
}) {
  const pathname = usePathname();
  const currentRoute = getPortalRoute(pathname);

  if (!currentRoute || !role) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen p-3 sm:p-6" style={{ background: "var(--page-bg)" }}>
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <PortalHeader currentPath={currentRoute} role={role} />
        <main className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_24px_60px_-30px_rgba(20,30,60,0.35)] sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
