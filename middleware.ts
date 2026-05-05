import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionFromRequest } from "./lib/auth-utils";

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  
  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // Enable XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");
  
  // Control referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Content Security Policy (adjust as needed)
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.paystack.co;"
  );
  
  return response;
}

// Route definitions
const protectedRoutes = ["/dashboard", "/pay", "/logs", "/profile", "/operators"];
const adminOnlyRoutes = ["/dashboard", "/logs", "/operators"];
const operatorOnlyRoutes = ["/pay"];

// API routes that require authentication (handled by individual route handlers)
const protectedApiRoutes = [
  "/api/instances",
  "/api/collections", 
  "/api/profile",
  "/api/admin",
];

function isProtectedPath(pathname: string) {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isAdminOnlyPath(pathname: string) {
  return adminOnlyRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isProtectedApiPath(pathname: string) {
  return protectedApiRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Middleware for authentication and route-based access control
 * Implements separation of concerns: admin routes won't affect operator routes
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSessionFromRequest(request);
  const hasSession = session !== null;
  const role = session?.role ?? null;

  // Forward session info to request headers for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  if (session) {
    requestHeaders.set("x-user-role", session.role);
    if (session.instanceId) {
      requestHeaders.set("x-user-instance-id", session.instanceId);
    }
  }

  // ====================================================================
  // AUTHENTICATION: Redirect unauthenticated users to login
  // ====================================================================
  if (isProtectedPath(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return addSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // API routes: Let the route handlers handle auth (they use withAuth wrapper)
  // This prevents middleware from blocking API calls unnecessarily
  if (isProtectedApiPath(pathname)) {
    return addSecurityHeaders(
      NextResponse.next({
        request: { headers: requestHeaders },
      })
    );
  }

  // ====================================================================
  // ADMIN ROUTE PROTECTION
  // Operators trying to access admin-only routes → redirect to their workspace
  // This ensures operator failures don't affect admin functionality
  // ====================================================================
  if (hasSession && role === "operator" && isAdminOnlyPath(pathname)) {
    const operatorHomeUrl = new URL("/pay", request.url);
    if (session.instanceId) {
      operatorHomeUrl.pathname = `/pay/${session.instanceId}`;
    }
    return addSecurityHeaders(NextResponse.redirect(operatorHomeUrl));
  }

  // ====================================================================
  // OPERATOR INSTANCE ISOLATION
  // Operators can only access their assigned instance's payment page
  // Admins have unrestricted access to all instances
  // ====================================================================
  if (hasSession && role === "operator" && session?.instanceId) {
    const instanceMatch = pathname.match(/^\/pay\/([^/]+)/);
    if (instanceMatch && instanceMatch[1] !== session.instanceId) {
      // Operator trying to access different instance → redirect to their instance
      return addSecurityHeaders(NextResponse.redirect(new URL(`/pay/${session.instanceId}`, request.url)));
    }
  }

  // ====================================================================
  // LOGIN PAGE: Redirect authenticated users to their respective home
  // ====================================================================
  if (pathname === "/login" && hasSession) {
    const redirectUrl = role === "admin" 
      ? new URL("/dashboard", request.url)
      : new URL(`/pay/${session?.instanceId ?? ""}`, request.url);
    return addSecurityHeaders(NextResponse.redirect(redirectUrl));
  }

  // ====================================================================
  // ROOT REDIRECT: Send authenticated users to their home page
  // ====================================================================
  if (pathname === "/" && hasSession) {
    const homeUrl = role === "admin"
      ? new URL("/dashboard", request.url)
      : new URL(`/pay/${session?.instanceId ?? ""}`, request.url);
    return addSecurityHeaders(NextResponse.redirect(homeUrl));
  }

  return addSecurityHeaders(
    NextResponse.next({
      request: { headers: requestHeaders },
    })
  );
}

export const config = {
  matcher: [
    // Page routes
    "/",
    "/dashboard/:path*",
    "/pay/:path*",
    "/logs/:path*",
    "/login",
    "/profile/:path*",
    "/operators/:path*",
    // API routes (authentication handled by route handlers)
    "/api/instances/:path*",
    "/api/collections/:path*",
    "/api/profile/:path*",
    "/api/admin/:path*",
  ],
};
