import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MyIMOPayTransactionData, isNetworkError } from "@/lib/payment-store";

const MYIMOPAY_API_URL = process.env.MYIMOPAY_API_URL || "https://apipg.demo.myimopay.com";
const MYIMOPAY_API_KEY = process.env.MYIMOPAY_API_KEY;
const NEXT_PUBLIC_MYIMOPAY_UI_KEY = process.env.NEXT_PUBLIC_MYIMOPAY_UI_KEY;

async function verifyTransaction(txRef: string, useUIKey: boolean = false): Promise<MyIMOPayTransactionData> {
  const key = useUIKey ? NEXT_PUBLIC_MYIMOPAY_UI_KEY : MYIMOPAY_API_KEY;
  const headerName = useUIKey ? "uix-pky" : "xp-key";

  if (!key) {
    throw new Error("MyIMO Pay not configured");
  }

  const res = await fetch(`${MYIMOPAY_API_URL}/vi/pay/verify/${encodeURIComponent(txRef)}`, {
    headers: { [headerName]: key },
  });

  const data = await res.json();

  if (!data.header?.is_success) {
    throw new Error(data.header?.remark || "Verification failed");
  }

  return data.data;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ txRef: string }> },
) {
  if (!MYIMOPAY_API_KEY) {
    return NextResponse.json({ error: "MyIMO Pay not configured" }, { status: 500 });
  }

  const { txRef } = await params;

  try {
    // Idempotency: return existing record if already saved for this reference
    const existing = await prisma.paymentCollection.findUnique({
      where: { paymentReference: txRef },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    // Verify with MyIMO Pay (use UI key if provided in request, else merchant key)
    const useUIKey = request.headers.get("x-use-ui-key") === "true";
    let transactionData;
    try {
      transactionData = await verifyTransaction(txRef, useUIKey);
    } catch (verifyError: unknown) {
      const message = verifyError instanceof Error ? verifyError.message : "Unknown error";
      return NextResponse.json(
        { error: "Payment verification failed: " + message },
        { status: 400 },
      );
    }

    // Check if payment was successful (status 1 = Success based on common patterns)
    // MyIMO Pay uses integer status codes; we treat non-success as failure
    const isSuccess = transactionData.status === 1 || transactionData.status === "1";

    if (!isSuccess) {
      return NextResponse.json(
        {
          error: "Payment was not successful",
          status: transactionData.status,
          tx_reference: transactionData.tx_reference,
        },
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

    // Atomic create — the @unique on paymentReference prevents duplicates
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
        paymentReference: txRef,
        transactionId: transactionData.identifier || null,
        paymentStatus: "success",
        collectedAt,
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error: unknown) {
    // P2002 = Prisma unique constraint violation — already recorded by a concurrent request
    const prismaCode = typeof error === "object" && error !== null && "code" in error
      ? (error as { code: string }).code
      : undefined;
    if (prismaCode === "P2002") {
      const existing = await prisma.paymentCollection.findUnique({
        where: { paymentReference: txRef },
      });
      return NextResponse.json(existing);
    }

    console.error("Error verifying MyIMO Pay transaction:", error);

    if (isNetworkError(error)) {
      return NextResponse.json(
        {
          error: "No internet connection",
          details: "Unable to verify payment with MyIMO Pay. Please check your internet connection.",
          type: "NETWORK_ERROR",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
