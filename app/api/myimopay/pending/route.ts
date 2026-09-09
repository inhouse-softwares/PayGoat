import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MyIMOPayTransactionData, isNetworkError } from "@/lib/payment-store";

const MYIMOPAY_API_URL = process.env.MYIMOPAY_API_URL || "https://apipg.demo.myimopay.com";
const MYIMOPAY_API_KEY = process.env.MYIMOPAY_API_KEY;

async function checkTransactionStatus(txRef: string): Promise<MyIMOPayTransactionData> {
  if (!MYIMOPAY_API_KEY) throw new Error("MyIMO Pay not configured");

  const res = await fetch(`${MYIMOPAY_API_URL}/vi/pay/verify/${encodeURIComponent(txRef)}`, {
    headers: { "xp-key": MYIMOPAY_API_KEY },
  });

  const data = await res.json();
  if (!data.header?.is_success) throw new Error(data.header?.remark || "Verification failed");
  return data.data;
}

/**
 * GET /api/myimopay/pending
 * 
 * Reconciliation endpoint: checks all pending payment collections against
 * MyIMO Pay and updates their status. Can be called by a cron job or manually.
 * 
 * Query params:
 *   ?txRef=xxx  - Check a specific transaction only
 *   ?all=true   - Check all pending transactions (batch mode)
 */
export async function GET(request: NextRequest) {
  if (!MYIMOPAY_API_KEY) {
    return NextResponse.json({ error: "MyIMO Pay not configured" }, { status: 500 });
  }

  const { searchParams } = request.nextUrl;
  const txRef = searchParams.get("txRef");
  const checkAll = searchParams.get("all") === "true";

  if (!txRef && !checkAll) {
    return NextResponse.json(
      { error: "Provide txRef to check a specific transaction, or all=true for batch reconciliation" },
      { status: 400 },
    );
  }

  try {
    let pendingCollections;

    if (txRef) {
      // Check specific transaction
      const collection = await prisma.paymentCollection.findUnique({
        where: { paymentReference: txRef },
      });
      pendingCollections = collection ? [collection] : [];
    } else {
      // Check all pending transactions
      pendingCollections = await prisma.paymentCollection.findMany({
        where: { paymentStatus: "pending" },
        orderBy: { createdAt: "asc" },
        take: 100, // Batch limit
      });
    }

    const results = [];
    let updatedCount = 0;
    let failedCount = 0;

    for (const collection of pendingCollections) {
      const reference = collection.paymentReference;
      if (!reference) continue;

      try {
        const txData = await checkTransactionStatus(reference);
        const isSuccess = txData.status === 1 || txData.status === "1";
        const isFailed = txData.status === 2 || txData.status === "2" || txData.status === 3 || txData.status === "3";

        if (isSuccess) {
          await prisma.paymentCollection.update({
            where: { id: collection.id },
            data: {
              paymentStatus: "success",
              transactionId: txData.identifier || collection.transactionId,
            },
          });
          updatedCount++;
          results.push({ reference, status: "updated_to_success" });
        } else if (isFailed) {
          await prisma.paymentCollection.update({
            where: { id: collection.id },
            data: { paymentStatus: "failed" },
          });
          failedCount++;
          results.push({ reference, status: "updated_to_failed" });
        } else {
          results.push({ reference, status: "still_pending" });
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        results.push({ reference, status: "error", error: message });
      }
    }

    return NextResponse.json({
      checked: pendingCollections.length,
      updated: updatedCount,
      failed: failedCount,
      results,
    });
  } catch (error: unknown) {
    console.error("Error in pending reconciliation:", error);

    if (isNetworkError(error)) {
      return NextResponse.json(
        {
          error: "No internet connection",
          details: "Unable to connect to MyIMO Pay for reconciliation.",
          type: "NETWORK_ERROR",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Reconciliation failed" }, { status: 500 });
  }
}
