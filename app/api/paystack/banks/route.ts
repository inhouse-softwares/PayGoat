import { NextResponse } from "next/server";

export async function GET() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      "https://api.paystack.co/bank?country=nigeria&perPage=100&use_cursor=false",
      {
        headers: { Authorization: `Bearer ${secretKey}` },
        next: { revalidate: 3600 },
      },
    );

    const data = await res.json();

    if (!data.status) {
      return NextResponse.json({ error: "Failed to fetch banks" }, { status: 500 });
    }

    return NextResponse.json(data.data as { name: string; code: string }[]);
  } catch (error) {
    console.error("Error fetching banks:", error);
    return NextResponse.json({ error: "Failed to fetch banks" }, { status: 500 });
  }
}
