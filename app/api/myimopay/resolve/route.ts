import { NextRequest, NextResponse } from "next/server";
import { isNetworkError } from "@/lib/payment-store";

const MYIMOPAY_API_URL = process.env.MYIMOPAY_API_URL || "https://apipg.demo.myimopay.com";
const MYIMOPAY_API_KEY = process.env.MYIMOPAY_API_KEY;

export async function GET(request: NextRequest) {
  if (!MYIMOPAY_API_KEY) {
    return NextResponse.json({ error: "MyIMO Pay not configured" }, { status: 500 });
  }

  const { searchParams } = request.nextUrl;
  const accountNumber = searchParams.get("account_number");
  const bankCode = searchParams.get("bank_code");

  if (!accountNumber || !bankCode) {
    return NextResponse.json({ error: "account_number and bank_code are required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${MYIMOPAY_API_URL}/vi/entities/banks/account/${encodeURIComponent(bankCode)}/${encodeURIComponent(accountNumber)}/resolve`,
      {
        headers: {
          "xp-key": MYIMOPAY_API_KEY,
        },
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!data.header?.is_success || !data.data) {
      return NextResponse.json(
        { error: data.header?.remark || "Could not resolve account. Check account number and bank." },
        { status: 422 },
      );
    }

    return NextResponse.json({ accountName: data.data.account_name as string });
  } catch (error: unknown) {
    console.error("Error resolving account with MyIMO Pay:", error);

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
