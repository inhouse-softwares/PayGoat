"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { MobileHeader } from "./mobile-header";
import { useAuth } from "@/lib/auth-context";

type PortalRoute =
  | "/dashboard"
  | "/pay"
  | "/transactions"
  | "/instances"
  | "/instances/configure"
  | "/logs"
  | "/profile"
  | "/operators";

function getPortalRoute(pathname: string): PortalRoute | null {
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return "/dashboard";
  }
  if (pathname === "/instances/configure" || pathname.startsWith("/instances/configure/")) {
    return "/instances/configure";
  }
  if (pathname === "/instances" || pathname.startsWith("/instances/")) {
    return "/instances";
  }
  if (pathname === "/transactions" || pathname.startsWith("/transactions/")) {
    return "/transactions";
  }
  if (pathname === "/pay" || pathname.startsWith("/pay/")) {
    return "/pay";
  }
  if (pathname === "/logs" || pathname.startsWith("/logs/")) {
    return "/logs";
  }
  if (pathname === "/profile" || pathname.startsWith("/profile/")) {
    return "/profile";
  }
  if (pathname === "/operators" || pathname.startsWith("/operators/")) {
    return "/operators";
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
  const clientPathname = usePathname();
  const currentRoute = getPortalRoute(clientPathname ?? serverPathname);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!role || !currentRoute) {
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen transition-opacity duration-200 ease-out"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      <Sidebar currentPath={currentRoute} role={role} />
      <MobileHeader currentPath={currentRoute} role={role} />

      <main className="lg:ml-60 min-h-screen pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <MobileNav currentPath={currentRoute} role={role} />
    </div>
  );
}
