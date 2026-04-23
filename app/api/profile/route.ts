import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { cookies } from "next/headers";

function parseSession(value: string | undefined) {
  if (!value) return null;
  const [role, instanceId] = value.split("|");
  if (role === "admin") return { role: "admin" as const };
  if (role === "operator") return { role: "operator" as const, instanceId: instanceId || undefined };
  return null;
}

export async function GET() {
  const cookieStore = await cookies();
  const session = parseSession(cookieStore.get("paygoat_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findFirst({
    where: session.role === "operator" && session.instanceId
      ? { instanceId: session.instanceId }
      : { role: "admin" },
    select: { id: true, email: true, role: true, lastLoginAt: true, instanceId: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const session = parseSession(cookieStore.get("paygoat_session")?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findFirst({
    where: session.role === "operator" && session.instanceId
      ? { instanceId: session.instanceId }
      : { role: "admin" },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await request.json();
  const { email, currentPassword, newPassword } = body;

  const updates: { email?: string; password?: string } = {};

  if (email && email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    updates.email = email.trim().toLowerCase();
  }

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Current password is required to set a new password" }, { status: 400 });
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    if (newPassword.length < 6) return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    updates.password = await bcrypt.hash(newPassword, 10);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  }

  // If email changed, update the session cookie to keep it valid
  const updated = await prisma.user.update({ where: { id: user.id }, data: updates });

  if (updates.email) {
    const cookieValue = updated.role === "operator" && updated.instanceId
      ? `operator|${updated.instanceId}`
      : updated.role;
    cookieStore.set("paygoat_session", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  return NextResponse.json({ success: true });
}
