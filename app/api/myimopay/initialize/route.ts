import { NextRequest, NextResponse } from "next/server";
import { withRateLimit, RateLimitPresets } from "@/lib/rate-limit";
import { isNetworkError } from "@/lib/payment-store";

const MYIMOPAY_API_URL = process.env.MYIMOPAY_API_URL || "https://apipg.demo.myimopay.com";
const MYIMOPAY_API_KEY = process.env.MYIMOPAY_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function initializeHandler(request: NextRequest) {
  if (!MYIMOPAY_API_KEY) {
    return NextResponse.json({ error: "MyIMO Pay not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      tx_ref,
      amount,
      currency = "NGN",
      customer_full_name,
      customer_email,
      customer_mobile,
      callback_url,
      settlement_order_id,
    } = body;

    if (!tx_ref || !amount || !customer_full_name) {
      return NextResponse.json({ error: "Missing required fields: tx_ref, amount, customer_full_name" }, { status: 400 });
    }

    const finalCallbackUrl = callback_url || `${APP_URL}/api/pay/callback?txRef=${encodeURIComponent(tx_ref)}`;

    const payload: Record<string, string | number> = {
      tx_ref,
      amount: Number(amount),
      currency,
      customer_full_name,
      callback_url: finalCallbackUrl,
    };

    if (customer_email) payload.customer_email = customer_email;
    if (customer_mobile) payload.customer_mobile = customer_mobile;

    // Use split payment endpoint if settlement_order_id is provided
    const endpoint = settlement_order_id
      ? `${MYIMOPAY_API_URL}/vi/pay/initiate/split`
      : `${MYIMOPAY_API_URL}/vi/pay/initiate`;

    if (settlement_order_id) {
      payload.settlement_order_id = settlement_order_id;
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "xp-key": MYIMOPAY_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.header?.is_success) {
      return NextResponse.json(
        { error: data.header?.remark || "Failed to initialize payment" },
        { status: 500 },
      );
    }

    return NextResponse.json(data.data);
  } catch (error: unknown) {
    console.error("Error initializing MyIMO Pay transaction:", error);

    if (isNetworkError(error)) {
      return NextResponse.json(
        {
          error: "No internet connection",
          details: "Unable to connect to MyIMO Pay. Please check your internet connection.",
          type: "NETWORK_ERROR",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}

export const POST = withRateLimit(initializeHandler, RateLimitPresets.payment);
