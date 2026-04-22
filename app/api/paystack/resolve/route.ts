import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
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
        headers: { Authorization: `Bearer ${secretKey}` },
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok || !data.status) {
      return NextResponse.json(
        { error: data.message || "Could not resolve account. Check account number and bank." },
        { status: 422 },
      );
    }

    return NextResponse.json({ accountName: data.data.account_name as string });
  } catch (error) {
    console.error("Error resolving account:", error);
    return NextResponse.json({ error: "Failed to resolve account" }, { status: 500 });
  }
}
