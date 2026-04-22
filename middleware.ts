import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "./lib/auth";

const protectedRoutes = ["/dashboard", "/pay", "/logs"];
const adminOnlyRoutes = ["/dashboard", "/logs"];

function isProtectedPath(pathname: string) {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isAdminOnlyPath(pathname: string) {
  return adminOnlyRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function getRole(value: string | undefined) {
  if (value === "admin" || value === "operator") {
    return value;
  }

  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = getRole(request.cookies.get(AUTH_COOKIE_NAME)?.value);
  const hasSession = role !== null;

  if (isProtectedPath(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && role === "operator" && isAdminOnlyPath(pathname)) {
    const payUrl = new URL("/pay", request.url);
    return NextResponse.redirect(payUrl);
  }

  if (pathname === "/login" && hasSession) {
    const redirectUrl = new URL(role === "admin" ? "/dashboard" : "/pay", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/pay/:path*", "/logs/:path*", "/login"],
};
