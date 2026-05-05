import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, withAuth } from "@/lib/auth-utils";

export const GET = withAuth(async () => {
  // Only admins can view operator list
  await requireAdmin();

  const operators = await prisma.user.findMany({
    where: { role: "operator" },
    select: {
      id: true,
      email: true,
      plainPassword: true,
      instanceId: true,
      lastLoginAt: true,
      createdAt: true,
      instance: {
        select: { id: true, name: true, splitCode: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(operators);
});
