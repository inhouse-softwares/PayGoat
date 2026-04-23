import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
  } catch (error) {
    console.error("Error fetching instance:", error);
    return NextResponse.json(
      { error: "Failed to fetch instance" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete the linked operator account first (SetNull on schema, but explicit is safer)
    await prisma.user.deleteMany({ where: { instanceId: id } });
    await prisma.paymentInstance.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting instance:", error);
    return NextResponse.json(
      { error: "Failed to delete instance" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    });

    return NextResponse.json(instance);
  } catch (error) {
    console.error("Error updating instance:", error);
    return NextResponse.json(
      { error: "Failed to update instance" },
      { status: 500 }
    );
  }
}
