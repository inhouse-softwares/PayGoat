import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
  } catch (error) {
    console.error("Error initializing Paystack transaction:", error);
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}
