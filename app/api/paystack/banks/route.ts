import { NextResponse } from "next/server";
import { isNetworkError } from "@/lib/payment-store";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

type PaystackBankData = {
  name: string;
  code: string;
  type: string;
  currency: string;
};

export async function GET() {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.paystack.co/bank", {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
      next: { revalidate: 3600 },
    });

    const data = await res.json();

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch banks" },
        { status: 500 },
      );
    }

    const banks = (data.data || []).map((b: PaystackBankData) => ({
      name: b.name,
      code: b.code,
      type: b.type,
      currency: b.currency,
    }));

    return NextResponse.json(banks);
  } catch (error: unknown) {
    console.error("Error fetching banks from Paystack:", error);

    if (isNetworkError(error)) {
      return NextResponse.json(
        {
          error: "No internet connection",
          details: "Unable to fetch bank list from Paystack. Please check your internet connection.",
          type: "NETWORK_ERROR",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Failed to fetch banks" }, { status: 500 });
  }
}