import { NextResponse } from "next/server";

/**
 * Kept temporarily so legacy clients receive an explicit migration response.
 * Payment initialization is now routed through /api/payments/initialize,
 * which derives the settlement ID from the configured instance on the server.
 */
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint has been replaced by the gateway-aware payment initializer." },
    { status: 410 },
  );
}
