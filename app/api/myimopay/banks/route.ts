import { NextResponse } from "next/server";
import { MyIMOPayBankData, isNetworkError } from "@/lib/payment-store";

const MYIMOPAY_API_URL = process.env.MYIMOPAY_API_URL || "https://apipg.demo.myimopay.com";
const MYIMOPAY_API_KEY = process.env.MYIMOPAY_API_KEY;

export async function GET() {
  if (!MYIMOPAY_API_KEY) {
    return NextResponse.json({ error: "MyIMO Pay not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`${MYIMOPAY_API_URL}/vi/entities/banks/NG`, {
      headers: {
        "xp-key": MYIMOPAY_API_KEY,
      },
      next: { revalidate: 3600 },
    });

    const data = await res.json();

    if (!data.header?.is_success) {
      return NextResponse.json(
        { error: data.header?.remark || "Failed to fetch banks" },
        { status: 500 },
      );
    }

    const banks = (data.data || []).map((b: MyIMOPayBankData) => ({
      name: b.bank_name,
      code: b.bank_code,
    }));

    return NextResponse.json(banks);
  } catch (error: unknown) {
    console.error("Error fetching banks from MyIMO Pay:", error);

    if (isNetworkError(error)) {
      return NextResponse.json(
        {
          error: "No internet connection",
          details: "Unable to fetch bank list from MyIMO Pay. Please check your internet connection.",
          type: "NETWORK_ERROR",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Failed to fetch banks" }, { status: 500 });
  }
}
