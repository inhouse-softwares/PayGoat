import { NextRequest, NextResponse } from "next/server";
import { isNetworkError } from "@/lib/payment-store";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET(request: NextRequest) {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 500 });
  }

  const { searchParams } = request.nextUrl;
  const accountNumber = searchParams.get("account_number");
  const bankCode = searchParams.get("bank_code");

  if (!accountNumber || !bankCode) {
    return NextResponse.json({ error: "account_number and bank_code are required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(bankCode)}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!data.status || !data.data) {
      return NextResponse.json(
        { error: data.message || "Could not resolve account. Check account number and bank." },
        { status: 422 },
      );
    }

    return NextResponse.json({ accountName: data.data.account_name });
  } catch (error: unknown) {
    console.error("Error resolving account with Paystack:", error);

    if (isNetworkError(error)) {
      return NextResponse.json(
        {
          error: "No internet connection",
          details: "Unable to verify account details. Please check your internet connection.",
          type: "NETWORK_ERROR",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Failed to resolve account" }, { status: 500 });
  }
}