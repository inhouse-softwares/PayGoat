import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("paygoat_session")?.value;
  if (!session || session !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
}
