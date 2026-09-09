import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MYIMOPAY_API_URL = process.env.MYIMOPAY_API_URL || "https://apipg.demo.myimopay.com";
const MYIMOPAY_API_KEY = process.env.MYIMOPAY_API_KEY;
const MYIMOPAY_WEBHOOK_SECRET = process.env.MYIMOPAY_WEBHOOK_SECRET;

/**
 * POST /api/pay/webhook
 * 
 * Receives webhook notifications from MyIMO Pay when a payment status changes.
 * Validates the webhook, verifies the transaction, and updates the database.
 * 
 * This endpoint should be registered in the MyIMO Pay dashboard as the webhook URL.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic webhook validation
    // MyIMO Pay may send a signature or token in headers
    const webhookSignature = request.headers.get("x-webhook-signature") || request.headers.get("x-signature");

    if (MYIMOPAY_WEBHOOK_SECRET && webhookSignature) {
      // Validate webhook signature if configured
      // Implementation depends on MyIMO Pay's webhook signing mechanism
      // For now, we log the signature for debugging
      console.log("Webhook signature received:", webhookSignature);
    }

    // Extract transaction reference from webhook payload
    // The exact payload structure depends on MyIMO Pay's webhook format
    const txRef = body.tx_reference || body.txRef || body.reference;

    if (!txRef) {
      console.error("Webhook received without transaction reference:", body);
      return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
    }

    // Verify the transaction status with MyIMO Pay to prevent spoofing
    if (!MYIMOPAY_API_KEY) {
      console.error("MYIMOPAY_API_KEY not configured for webhook verification");
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const verifyRes = await fetch(`${MYIMOPAY_API_URL}/vi/pay/verify/${encodeURIComponent(txRef)}`, {
      headers: { "xp-key": MYIMOPAY_API_KEY },
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.header?.is_success) {
      console.error("Webhook verification failed for txRef:", txRef, verifyData);
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    const txData = verifyData.data;
    const isSuccess = txData.status === 1 || txData.status === "1";
    const isFailed = txData.status === 2 || txData.status === "2" || txData.status === 3 || txData.status === "3";

    // Find and update the collection
    const existing = await prisma.paymentCollection.findUnique({
      where: { paymentReference: txRef },
    });

    if (existing) {
      // Update status if it's still pending
      if (existing.paymentStatus === "pending") {
        await prisma.paymentCollection.update({
          where: { id: existing.id },
          data: {
            paymentStatus: isSuccess ? "success" : isFailed ? "failed" : existing.paymentStatus,
            transactionId: txData.identifier || existing.transactionId,
          },
        });
      }
    } else {
      // Transaction not yet recorded (user may have closed browser before verify)
      // We record it with the webhook data if successful
      if (isSuccess) {
        // Store minimal data — the full collection details will be associated
        // when the operator manually verifies or the next reconciliation runs
        console.log("Webhook: Payment successful but no collection record found for txRef:", txRef);
        // We can't create a full collection without instance details, so we log it
        // The reconciliation endpoint or manual verification will pick it up
      }
    }

    return NextResponse.json({ received: true, status: isSuccess ? "success" : isFailed ? "failed" : "pending" });
  } catch (error: unknown) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
