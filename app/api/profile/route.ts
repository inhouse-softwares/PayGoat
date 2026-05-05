import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { requireAuth, withAuth } from "@/lib/auth-utils";
import { PasswordChangeSchema } from "@/lib/validation";
import { z } from "zod";

export const GET = withAuth(async () => {
  const session = await requireAuth();

  const user = await prisma.user.findFirst({
    where: session.role === "operator" && session.instanceId
      ? { instanceId: session.instanceId }
      : { role: "admin" },
    select: { id: true, email: true, role: true, lastLoginAt: true, instanceId: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  return NextResponse.json(user);
});

export const PATCH = withAuth(async (request: NextRequest) => {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findFirst({
      where: session.role === "operator" && session.instanceId
        ? { instanceId: session.instanceId }
        : { role: "admin" },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    
    // Validate password change input
    const validatedData = PasswordChangeSchema.parse(body);
    const { currentPassword, newPassword } = validatedData;

    const updates: { password?: string } = {};

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }
    
    // Check if new password is different
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return NextResponse.json(
        { error: "New password must be different from the current password" },
        { status: 400 }
      );
    }
    
    updates.password = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({ where: { id: user.id }, data: updates });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({ field: e.path.join("."), message: e.message })),
        },
        { status: 400 }
      );
    }
    
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
});
