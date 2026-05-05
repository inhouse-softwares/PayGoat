import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { setSession } from "@/lib/auth-utils";
import type { UserRole } from "@/lib/auth-types";
import { withRateLimit, RateLimitPresets } from "@/lib/rate-limit";
import { LoginSchema } from "@/lib/validation";
import { z } from "zod";

async function loginHandler(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = LoginSchema.parse(body);
    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Set session with consistent duration
    await setSession(user.role as UserRole, user.instanceId || undefined);

    // Record last login time — non-fatal: don't let this block the login response
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    } catch (updateErr) {
      console.error("Failed to update lastLoginAt:", updateErr);
    }

    return NextResponse.json({
      success: true,
      role: user.role,
      instanceId: user.instanceId ?? null,
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
        },
        { status: 400 }
      );
    }
    
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

// Apply rate limiting: 5 login attempts per 15 minutes
export const POST = withRateLimit(loginHandler, RateLimitPresets.auth);
