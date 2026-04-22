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
    const { name, splitCode, idclPercent, summary, entities } = body;

    const instance = await prisma.paymentInstance.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(splitCode && { splitCode }),
        ...(idclPercent && { idclPercent: parseFloat(idclPercent) }),
        ...(summary && { summary }),
        ...(entities && { entities }),
      },
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
