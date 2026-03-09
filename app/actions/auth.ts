"use server";

import { redirect } from "next/navigation";
import {
  clearAuthenticatedSession,
  setAuthenticatedSession,
  verifyCredentials,
} from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = verifyCredentials(email, password);

  if (!role) {
    redirect("/login?error=invalid_credentials");
  }

  await setAuthenticatedSession(role);
  redirect(role === "admin" ? "/dashboard" : "/pay");
}

export async function logoutAction() {
  await clearAuthenticatedSession();
  redirect("/login");
}
