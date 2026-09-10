import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWithGateway, isTransactionSuccessful, updatePaymentStatus } from "@/lib/payment-verify";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ txRef: string }> },
) {
  const { txRef } = await params;

  try {
    const existing = await prisma.paymentCollection.findUnique({
      where: { paymentReference: txRef },
    });

    if (existing?.paymentStatus === "success") {
      return NextResponse.json(existing);
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Payment record not found. Please initialize payment first." },
        { status: 404 },
      );
    }

    const txData = await verifyWithGateway(txRef);
    const isSuccess = isTransactionSuccessful(txData);

    if (!isSuccess) {
      await updatePaymentStatus(txRef, "failed", txData.identifier);
      return NextResponse.json(
        {
          error: "Payment was not successful",
          status: txData.status,
          tx_reference: txData.tx_reference,
        },
        { status: 400 },
      );
    }

    await updatePaymentStatus(txRef, "success", txData.identifier);
    
    const updated = await prisma.paymentCollection.findUnique({
      where: { paymentReference: txRef },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("Error verifying MyIMO Pay transaction:", error);
    if (error instanceof Error && error.message.includes("verification failed")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
