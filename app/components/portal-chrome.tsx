"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PortalHeader } from "./portal-header";
import { useAuth } from "@/lib/auth-context";

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
  serverPathname,
}: {
  children: React.ReactNode;
  serverPathname: string;
}) {
  const { role } = useAuth();

  // usePathname() updates instantly on router.push() — use it for both the
  // route guard and the active-nav highlight. Fall back to serverPathname
  // during SSR / before hydration.
  const clientPathname = usePathname();
  const currentRoute = getPortalRoute(clientPathname ?? serverPathname);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!role || !currentRoute) {
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen p-3 sm:p-6 transition-opacity duration-300"
      style={{
        background: "var(--page-bg)",
        opacity: mounted ? 1 : 0,
      }}
    >
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <PortalHeader currentPath={currentRoute} role={role} />
        <main className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_24px_60px_-30px_rgba(20,30,60,0.35)] sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
