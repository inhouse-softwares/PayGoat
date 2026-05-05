import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireInstanceAccess, requireAdmin, withAuth } from "@/lib/auth-utils";

export const GET = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  
  // Verify user has access to this instance
  await requireInstanceAccess(id);
  
  const instance = await prisma.paymentInstance.findUnique({
    where: { id },
    include: {
      paymentTypes: {
        orderBy: { createdAt: "asc" },
      },
      collections: {
        orderBy: { createdAt: "desc" },
      },
      operator: {
        select: { email: true },
      },
    },
  });

  if (!instance) {
    return NextResponse.json(
      { error: "Instance not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(instance);
});

export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  
  // Only admins can delete instances
  await requireAdmin();

  // Delete the linked operator account first (SetNull on schema, but explicit is safer)
  await prisma.user.deleteMany({ where: { instanceId: id } });
  await prisma.paymentInstance.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
});

export const PATCH = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  
  // Only admins can update instances
  await requireAdmin();
  
  const body = await request.json();
  const { name, summary, formFields, paymentTypes } = body;

  const instance = await prisma.$transaction(async (tx) => {
    // 1. Update scalar fields on the instance
    const updated = await tx.paymentInstance.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(summary !== undefined && { summary }),
        ...(formFields !== undefined && { formFields }),
      },
    });

    // 2. Sync payment types if provided
    if (Array.isArray(paymentTypes)) {
      const incomingIds = paymentTypes.filter((pt) => pt.id).map((pt) => pt.id as string);

      // Delete types no longer in the list
      await tx.paymentType.deleteMany({
        where: { instanceId: id, id: { notIn: incomingIds } },
      });

      // Upsert each type
      for (const pt of paymentTypes) {
        if (pt.id) {
          await tx.paymentType.update({
            where: { id: pt.id },
            data: {
              name: pt.name,
              description: pt.description || null,
              amount: Number(pt.amount),
            },
          });
        } else {
          await tx.paymentType.create({
            data: {
              instanceId: id,
              name: pt.name,
              description: pt.description || null,
              amount: Number(pt.amount),
            },
          });
        }
      }
    }

    return tx.paymentInstance.findUnique({
      where: { id },
      include: { paymentTypes: { orderBy: { createdAt: "asc" } } },
    });
  }, {
    maxWait: 10000, // Wait up to 10s to start a transaction
    timeout: 30000, // Transaction must complete within 30s
  });

  return NextResponse.json(instance);
});
