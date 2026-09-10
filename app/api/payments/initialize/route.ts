import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma";
import { RateLimitPresets, withRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const MYIMOPAY_API_URL = process.env.MYIMOPAY_API_URL || "https://api.myimopay.com";
const MYIMOPAY_API_KEY = process.env.MYIMOPAY_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const RequestSchema = z.object({
  instanceId: z.string().min(1),
  paymentTypeId: z.string().min(1),
  quantity: z.number().int().positive(),
  payer: z.string().min(1).max(200),
  customer_email: z.string().email().optional(),
  customer_full_name: z.string().min(1).max(200),
  metadata: z.record(z.string(), z.unknown()).default({}),
  collectedAt: z.string().min(1),
  idempotencyKey: z.string().uuid(),
  paymentReference: z.string().regex(/^[A-Z0-9]{1,20}$/),
});
const MyImoPayConfigSchema = z.object({ settlementId: z.string().uuid() });

async function initializePayment(request: NextRequest) {
  try {
    if (!MYIMOPAY_API_KEY) return NextResponse.json({ error: "MyIMO Pay is not configured" }, { status: 503 });
    const data = RequestSchema.parse(await request.json());
    const instance = await prisma.paymentInstance.findUnique({
      where: { id: data.instanceId },
      select: { name: true, splitCode: true, idclPercent: true, paymentGateway: true, gatewayConfig: true, paymentTypes: { where: { id: data.paymentTypeId }, select: { id: true, name: true, amount: true } } },
    });
    if (!instance) return NextResponse.json({ error: "Payment instance not found" }, { status: 404 });
    if (instance.paymentGateway === "paystack") return NextResponse.json({ error: "Paystack payments are coming soon" }, { status: 501 });
    if (instance.paymentGateway !== "myimopay") return NextResponse.json({ error: "Unsupported payment gateway" }, { status: 422 });
    const paymentType = instance.paymentTypes[0];
    if (!paymentType) return NextResponse.json({ error: "Payment type does not belong to this instance" }, { status: 400 });
    const config = MyImoPayConfigSchema.safeParse(instance.gatewayConfig);
    if (!config.success) return NextResponse.json({ error: "This instance needs a valid MyIMO Pay settlement ID" }, { status: 422 });

    const amount = Number((paymentType.amount * data.quantity).toFixed(2));
    const idclAmount = Number((amount * instance.idclPercent / 100).toFixed(2));
    const motAmount = Number((amount - idclAmount).toFixed(2));
    const existing = await prisma.paymentCollection.findUnique({ where: { idempotencyKey: data.idempotencyKey } });
    if (existing && (existing.instanceId !== data.instanceId || existing.paymentTypeId !== data.paymentTypeId || existing.amount !== amount)) {
      return NextResponse.json({ error: "Idempotency key was already used for a different payment" }, { status: 409 });
    }
    const intent = existing ?? await prisma.paymentCollection.create({ data: {
      instanceId: data.instanceId, instanceName: instance.name, splitCode: instance.splitCode,
      paymentTypeId: paymentType.id, paymentType: paymentType.name, payer: data.payer, amount, quantity: data.quantity,
      idclAmount, motAmount, metadata: data.metadata as Prisma.InputJsonValue, idempotencyKey: data.idempotencyKey,
      paymentReference: data.paymentReference, paymentStatus: "pending", collectedAt: data.collectedAt,
    } });
    if (intent.paymentStatus === "success") return NextResponse.json({ paymentStatus: "success", payment_reference: intent.paymentReference });
    if (intent.paymentLink) return NextResponse.json({ gateway: "myimopay", payment_link: intent.paymentLink, payment_reference: intent.paymentReference, reused: true });

    const response = await fetch(`${MYIMOPAY_API_URL}/vi/pay/initiate/split`, {
      method: "POST", headers: { "xp-key": MYIMOPAY_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ tx_ref: intent.paymentReference, amount, currency: "NGN", customer_full_name: data.customer_full_name, ...(data.customer_email ? { customer_email: data.customer_email } : {}), callback_url: `${APP_URL}/api/pay/callback?txRef=${encodeURIComponent(intent.paymentReference ?? "")}`, settlement_order_id: config.data.settlementId }),
    });
    const result = await response.json().catch(() => null) as { header?: { is_success?: boolean; remark?: string }; data?: { payment_link?: string; link?: string } } | null;
    if (!response.ok || !result?.header?.is_success) {
      const providerMessage = result?.header?.remark || "MyIMO Pay could not initialize this payment";
      console.error("MyIMO Pay initiation rejected", { status: response.status, providerMessage, instanceId: data.instanceId, paymentReference: intent.paymentReference });
      const settlementFailure = /verifying payment|settlement|order/i.test(providerMessage);
      return NextResponse.json({
        error: settlementFailure
          ? "MyIMO Pay rejected this settlement configuration. Confirm that the settlement ID belongs to this merchant account and the same MyIMO Pay environment as MYIMOPAY_API_KEY."
          : providerMessage,
      }, { status: 422 });
    }
    const paymentLink = result.data?.payment_link ?? result.data?.link;
    if (!paymentLink) return NextResponse.json({ error: "MyIMO Pay did not return a payment link" }, { status: 502 });
    await prisma.paymentCollection.update({ where: { id: intent.id }, data: { paymentLink } });
    return NextResponse.json({ gateway: "myimopay", payment_link: paymentLink, payment_reference: intent.paymentReference });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid payment request", details: error.issues }, { status: 400 });
    console.error("Payment initialization error:", error);
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}

export const POST = withRateLimit(initializePayment, RateLimitPresets.payment);
