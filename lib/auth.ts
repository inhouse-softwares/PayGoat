import { cookies } from "next/headers";
import type { UserRole } from "./auth-types";

export const AUTH_COOKIE_NAME = "paygoat_session";

const DEFAULT_ADMIN_EMAIL = "admin@paygoat.local";
const DEFAULT_ADMIN_PASSWORD = "password123";
const DEFAULT_OPERATOR_EMAIL = "operator@paygoat.local";
const DEFAULT_OPERATOR_PASSWORD = "operator123";

export function getExpectedCredentials() {
  return {
    admin: {
      email: process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD,
    },
    operator: {
      email: process.env.OPERATOR_EMAIL ?? DEFAULT_OPERATOR_EMAIL,
      password: process.env.OPERATOR_PASSWORD ?? DEFAULT_OPERATOR_PASSWORD,
    },
  };
}

function toRole(value: string | undefined): UserRole | null {
  if (value === "admin" || value === "operator") {
    return value;
  }

  return null;
}

export function verifyCredentials(email: string, password: string): UserRole | null {
  const expected = getExpectedCredentials();
  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail === expected.admin.email.toLowerCase() &&
    password === expected.admin.password
  ) {
    return "admin";
  }

  if (
    normalizedEmail === expected.operator.email.toLowerCase() &&
    password === expected.operator.password
  ) {
    return "operator";
  }

  return null;
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return toRole(cookieStore.get(AUTH_COOKIE_NAME)?.value) !== null;
}

export async function getSessionRole() {
  const cookieStore = await cookies();
  return toRole(cookieStore.get(AUTH_COOKIE_NAME)?.value);
}

export async function setAuthenticatedSession(role: UserRole) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, role, {
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
