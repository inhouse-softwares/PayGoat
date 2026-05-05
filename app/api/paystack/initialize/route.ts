import { NextRequest, NextResponse } from "next/server";
import { withRateLimit, RateLimitPresets } from "@/lib/rate-limit";

async function initializeHandler(request: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { email, amount, reference, split_code, metadata } = body;

    if (!email || !amount || !reference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, amount, reference, split_code, metadata }),
    });

    const data = await res.json();

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || "Failed to initialize payment" },
        { status: 500 },
      );
    }

    return NextResponse.json(data.data);
  } catch (error: any) {
    console.error("Error initializing Paystack transaction:", error);

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
          details: "Unable to connect to Paystack. Please check your internet connection.",
          type: "NETWORK_ERROR"
        }, 
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}

// Apply rate limiting: 10 payment attempts per minute
export const POST = withRateLimit(initializeHandler, RateLimitPresets.payment);
