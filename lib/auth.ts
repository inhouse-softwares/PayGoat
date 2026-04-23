import { cookies } from "next/headers";
import type { UserRole } from "./auth-types";

export const AUTH_COOKIE_NAME = "paygoat_session";

/** Cookie format: "admin" | "operator|<instanceId>" */
function parseCookieValue(value: string | undefined): { role: UserRole; instanceId?: string } | null {
  if (!value) return null;
  const [role, instanceId] = value.split("|");
  if (role === "admin") return { role: "admin" };
  if (role === "operator") return { role: "operator", instanceId: instanceId || undefined };
  return null;
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return parseCookieValue(cookieStore.get(AUTH_COOKIE_NAME)?.value) !== null;
}

export async function getSessionRole(): Promise<UserRole | null> {
  const cookieStore = await cookies();
  return parseCookieValue(cookieStore.get(AUTH_COOKIE_NAME)?.value)?.role ?? null;
}

export async function getSession(): Promise<{ role: UserRole; instanceId?: string } | null> {
  const cookieStore = await cookies();
  return parseCookieValue(cookieStore.get(AUTH_COOKIE_NAME)?.value);
}

export async function setAuthenticatedSession(role: UserRole, instanceId?: string) {
  const cookieStore = await cookies();
  const value = role === "operator" && instanceId ? `operator|${instanceId}` : role;
  cookieStore.set(AUTH_COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAuthenticatedSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
