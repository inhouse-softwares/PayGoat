import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWithGateway, isTransactionSuccessful, isTransactionFailed, updatePaymentStatus } from "@/lib/payment-verify";
import { isNetworkError } from "@/lib/payment-store";

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
      const collection = await prisma.paymentCollection.findUnique({
        where: { paymentReference: txRef },
      });
      pendingCollections = collection ? [collection] : [];
    } else {
      pendingCollections = await prisma.paymentCollection.findMany({
        where: { paymentStatus: "pending" },
        orderBy: { createdAt: "asc" },
        take: 100,
      });
    }

    const results = [];
    let updatedCount = 0;
    let failedCount = 0;

    for (const collection of pendingCollections) {
      const reference = collection.paymentReference;
      if (!reference) continue;

      try {
        const txData = await verifyWithGateway(reference);
        const isSuccess = isTransactionSuccessful(txData);
        const isFailed = isTransactionFailed(txData);

        if (isSuccess) {
          await updatePaymentStatus(reference, "success", txData.identifier);
          updatedCount++;
          results.push({ reference, status: "updated_to_success" });
        } else if (isFailed) {
          await updatePaymentStatus(reference, "failed");
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
