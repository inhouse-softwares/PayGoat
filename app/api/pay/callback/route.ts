import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MYIMOPAY_API_URL = process.env.MYIMOPAY_API_URL || "https://apipg.demo.myimopay.com";
const MYIMOPAY_API_KEY = process.env.MYIMOPAY_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * GET /api/pay/callback
 * 
 * Handles the redirect back from MyIMO Pay after a customer completes payment.
 * Verifies the transaction and redirects to the payment page with status.
 * 
 * Query params from MyIMO Pay:
 *   txRef - The transaction reference
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const txRef = searchParams.get("txRef");

  if (!txRef) {
    // No reference — redirect to home
    return NextResponse.redirect(new URL("/pay", APP_URL));
  }

  // Try to verify the transaction server-side
  if (MYIMOPAY_API_KEY) {
    try {
      const res = await fetch(`${MYIMOPAY_API_URL}/vi/pay/verify/${encodeURIComponent(txRef)}`, {
        headers: { "xp-key": MYIMOPAY_API_KEY },
      });

      const data = await res.json();

      if (data.header?.is_success && data.data) {
        const txData = data.data;
        const isSuccess = txData.status === 1 || txData.status === "1";

        // Update existing collection if found
        const existing = await prisma.paymentCollection.findUnique({
          where: { paymentReference: txRef },
        });

        if (existing && existing.paymentStatus === "pending") {
          await prisma.paymentCollection.update({
            where: { id: existing.id },
            data: {
              paymentStatus: isSuccess ? "success" : "failed",
              transactionId: txData.identifier || existing.transactionId,
            },
          });
        }
      }
    } catch (err) {
      console.error("Callback verification error:", err);
      // Continue to redirect — polling will catch it later
    }
  }

  // Redirect to the payment page with the reference for client-side handling
  const redirectUrl = new URL("/pay", APP_URL);
  redirectUrl.searchParams.set("paymentCallback", txRef);

  return NextResponse.redirect(redirectUrl);
}
