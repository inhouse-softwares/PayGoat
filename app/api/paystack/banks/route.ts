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
  } catch (error: any) {
    console.error("Error fetching banks:", error);

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
          details: "Unable to fetch bank list. Please check your internet connection.",
          type: "NETWORK_ERROR"
        }, 
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Failed to fetch banks" }, { status: 500 });
  }
}
