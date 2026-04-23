import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "./lib/auth";

const protectedRoutes = ["/dashboard", "/pay", "/logs", "/profile", "/operators"];
const adminOnlyRoutes = ["/dashboard", "/logs", "/operators"];

function isProtectedPath(pathname: string) {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isAdminOnlyPath(pathname: string) {
  return adminOnlyRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function parseSession(value: string | undefined): { role: "admin" | "operator"; instanceId?: string } | null {
  if (!value) return null;
  const [role, instanceId] = value.split("|");
  if (role === "admin") return { role: "admin" };
  if (role === "operator") return { role: "operator", instanceId: instanceId || undefined };
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = parseSession(request.cookies.get(AUTH_COOKIE_NAME)?.value);
  const hasSession = session !== null;
  const role = session?.role ?? null;

  // Forward pathname as a request header so server components can read it via headers()
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (isProtectedPath(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && role === "operator" && isAdminOnlyPath(pathname)) {
    const payUrl = new URL("/pay", request.url);
    return NextResponse.redirect(payUrl);
  }

  // Operator can only access their own instance's payment page
  if (hasSession && role === "operator" && session?.instanceId) {
    const instanceMatch = pathname.match(/^\/pay\/([^/]+)/);
    if (instanceMatch && instanceMatch[1] !== session.instanceId) {
      return NextResponse.redirect(new URL(`/pay/${session.instanceId}`, request.url));
    }
  }

  if (pathname === "/login" && hasSession) {
    const redirectUrl = new URL(role === "admin" ? "/dashboard" : `/pay/${session?.instanceId ?? ""}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/pay/:path*", "/logs/:path*", "/login"],
};
