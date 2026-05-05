/**
 * Centralized Authentication & Authorization Utilities
 * Implements industry-standard RBAC with proper isolation
 */

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { UserRole } from "./auth-types";

export const AUTH_COOKIE_NAME = "paygoat_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days - consistent across app

/** Session data structure */
export interface SessionData {
  role: UserRole;
  instanceId?: string;
}

/**
 * Parse session cookie value
 * Format: "admin" | "operator|<instanceId>"
 */
export function parseSessionValue(value: string | undefined): SessionData | null {
  if (!value) return null;
  const [role, instanceId] = value.split("|");
  if (role === "admin") return { role: "admin" };
  if (role === "operator") return { role: "operator", instanceId: instanceId || undefined };
  return null;
}

/**
 * Get session from cookies (server components)
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  return parseSessionValue(cookieStore.get(AUTH_COOKIE_NAME)?.value);
}

/**
 * Get session role only
 */
export async function getSessionRole(): Promise<UserRole | null> {
  const session = await getSession();
  return session?.role ?? null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}

/**
 * Set session cookie
 */
export async function setSession(role: UserRole, instanceId?: string): Promise<void> {
  const cookieStore = await cookies();
  const value = role === "operator" && instanceId ? `operator|${instanceId}` : role;
  cookieStore.set(AUTH_COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "strict", // Strict for CSRF protection
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Clear session cookie
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Get session from NextRequest (middleware/API routes)
 */
export function getSessionFromRequest(request: NextRequest): SessionData | null {
  return parseSessionValue(request.cookies.get(AUTH_COOKIE_NAME)?.value);
}

// ============================================================================
// AUTHORIZATION HELPERS
// ============================================================================

/**
 * Require authentication - return 401 if not authenticated
 */
export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    throw new AuthError("Unauthorized", 401);
  }
  return session;
}

/**
 * Require admin role - return 403 if not admin
 */
export async function requireAdmin(): Promise<SessionData> {
  const session = await requireAuth();
  if (session.role !== "admin") {
    throw new AuthError("Forbidden: Admin access required", 403);
  }
  return session;
}

/**
 * Require operator role - return 403 if not operator
 */
export async function requireOperator(): Promise<SessionData & { instanceId: string }> {
  const session = await requireAuth();
  if (session.role !== "operator" || !session.instanceId) {
    throw new AuthError("Forbidden: Operator access required", 403);
  }
  return { role: session.role, instanceId: session.instanceId };
}

/**
 * Check if user has access to a specific instance
 * - Admins have access to all instances
 * - Operators only have access to their assigned instance
 */
export async function requireInstanceAccess(instanceId: string): Promise<SessionData> {
  const session = await requireAuth();
  
  if (session.role === "admin") {
    return session; // Admins have access to all instances
  }
  
  if (session.role === "operator" && session.instanceId === instanceId) {
    return session; // Operator has access to their instance
  }
  
  throw new AuthError("Forbidden: No access to this instance", 403);
}

/**
 * Get instance filter for database queries based on session
 * - Admins: no filter (access all)
 * - Operators: filter by their instanceId
 */
export async function getInstanceFilter(): Promise<{ instanceId?: string }> {
  const session = await getSession();
  
  if (!session) {
    return {}; // No filter if no session (will be caught by other auth)
  }
  
  if (session.role === "admin") {
    return {}; // No filter for admins
  }
  
  if (session.role === "operator" && session.instanceId) {
    return { instanceId: session.instanceId }; // Filter by operator's instance
  }
  
  return {};
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Custom authentication/authorization error
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Handle auth errors in API routes
 */
export function handleAuthError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  
  console.error("Unexpected auth error:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}

/**
 * Wrap API route handler with auth error handling
 */
export function withAuth<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof AuthError) {
        return handleAuthError(error);
      }
      throw error; // Re-throw non-auth errors
    }
  };
}
