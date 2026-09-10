import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWithGateway, isTransactionSuccessful, isTransactionFailed, updatePaymentStatus } from "@/lib/payment-verify";

const MYIMOPAY_WEBHOOK_SECRET = process.env.MYIMOPAY_WEBHOOK_SECRET;

/**
 * POST /api/pay/webhook
 * 
 * Receives webhook notifications from MyIMO Pay when a payment status changes.
 * Validates the webhook, verifies the transaction, and updates the database.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const webhookSignature = request.headers.get("x-webhook-signature") || request.headers.get("x-signature");

    if (MYIMOPAY_WEBHOOK_SECRET && webhookSignature) {
      console.log("Webhook signature received:", webhookSignature);
    }

    const txRef = body.tx_reference || body.txRef || body.reference;

    if (!txRef) {
      console.error("Webhook received without transaction reference:", body);
      return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
    }

    const txData = await verifyWithGateway(txRef);
    const isSuccess = isTransactionSuccessful(txData);
    const isFailed = isTransactionFailed(txData);

    const existing = await prisma.paymentCollection.findUnique({
      where: { paymentReference: txRef },
    });

    if (existing) {
      if (existing.paymentStatus === "pending") {
        await updatePaymentStatus(
          txRef, 
          isSuccess ? "success" : isFailed ? "failed" : "pending", 
          txData.identifier
        );
      }
    } else {
      console.log("Webhook: Payment verified but no collection record found for txRef:", txRef);
    }

    return NextResponse.json({ received: true, status: isSuccess ? "success" : isFailed ? "failed" : "pending" });
  } catch (error: unknown) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
