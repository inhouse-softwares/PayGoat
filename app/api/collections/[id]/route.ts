import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireInstanceAccess, withAuth } from "@/lib/auth-utils";

export const GET = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  
  const collection = await prisma.paymentCollection.findUnique({
    where: { id },
    include: {
      instance: true,
    },
  });

  if (!collection) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 }
    );
  }
  
  // Verify user has access to this instance
  await requireInstanceAccess(collection.instanceId);

  return NextResponse.json(collection);
});

export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  
  // First, get the collection to check instance access
  const collection = await prisma.paymentCollection.findUnique({
    where: { id },
    select: { instanceId: true },
  });

  if (!collection) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 }
    );
  }
  
  // Verify user has access to this instance
  await requireInstanceAccess(collection.instanceId);

  await prisma.paymentCollection.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
});
