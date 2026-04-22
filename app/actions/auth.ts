"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  try {
    if (!email || !password) {
      redirect("/login?error=invalid_credentials");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      redirect("/login?error=invalid_credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      redirect("/login?error=invalid_credentials");
    }

    const cookieStore = await cookies();
    cookieStore.set("paygoat_session", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    redirect(user.role === "admin" ? "/dashboard" : "/pay");
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Login error:", error);
    redirect("/login?error=invalid_credentials");
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("paygoat_session");
  } catch (error) {
    console.error("Logout error:", error);
  }
  
  redirect("/login");
}
