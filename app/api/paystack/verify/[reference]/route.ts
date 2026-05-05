import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> },
) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 500 });
  }

  const { reference } = await params;

  try {
    // Idempotency: return existing record if already saved for this reference
    const existing = await prisma.paymentCollection.findUnique({
      where: { paystackReference: reference },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    // Verify with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } },
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data?.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed or payment was not successful" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const {
      instanceId,
      instanceName,
      splitCode,
      paymentTypeId,
      paymentType,
      payer,
      amount,
      quantity = 1,
      idclAmount,
      motAmount,
      metadata = {},
      collectedAt,
    } = body;

    // Atomic create — the @unique on paystackReference prevents duplicates from a race
    const collection = await prisma.paymentCollection.create({
      data: {
        instanceId,
        instanceName,
        splitCode,
        paymentTypeId: paymentTypeId || null,
        paymentType: paymentType || null,
        payer,
        amount: Number(amount),
        quantity: Number(quantity) || 1,
        idclAmount: Number(idclAmount),
        motAmount: Number(motAmount),
        metadata,
        paystackReference: reference,
        collectedAt,
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error: any) {
    // P2002 = Prisma unique constraint violation — already recorded by a concurrent request
    if (error?.code === "P2002") {
      const existing = await prisma.paymentCollection.findUnique({
        where: { paystackReference: reference },
      });
      return NextResponse.json(existing);
    }

    console.error("Error verifying Paystack transaction:", error);

    // Check for network errors
    const isNetworkError = 
      error.cause?.code === 'ENOTFOUND' ||
      error.cause?.code === 'ECONNREFUSED' ||
      error.cause?.code === 'ETIMEDOUT' ||
      error.cause?.code === 'EAI_AGAIN' ||
      (error.name === 'TypeError' && error.message?.includes('fetch failed'));

    if (isNetworkError) {
      return NextResponse.json(
        { 
          error: "No internet connection", 
          details: "Unable to verify payment with Paystack. Please check your internet connection.",
          type: "NETWORK_ERROR"
        }, 
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
