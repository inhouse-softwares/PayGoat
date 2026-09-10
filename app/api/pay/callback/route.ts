import { NextRequest, NextResponse } from "next/server";
import { verifyWithGateway, isTransactionSuccessful, updatePaymentStatus } from "@/lib/payment-verify";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const txRef = searchParams.get("txRef");

  if (!txRef) {
    return NextResponse.redirect(new URL("/pay", APP_URL));
  }

  try {
    const txData = await verifyWithGateway(txRef);
    const isSuccess = isTransactionSuccessful(txData);
    
    await updatePaymentStatus(
      txRef, 
      isSuccess ? "success" : "failed", 
      txData.identifier
    );
  } catch (err) {
    console.error("Callback verification error:", err);
    // Continue to redirect — client-side polling or manual verify will handle it
  }

  const redirectUrl = new URL("/pay", APP_URL);
  redirectUrl.searchParams.set("paymentCallback", txRef);

  return NextResponse.redirect(redirectUrl);
}
