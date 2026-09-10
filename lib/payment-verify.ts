import { prisma } from "@/lib/prisma";
import { MyIMOPayTransactionData } from "@/lib/payment-store";

const MYIMOPAY_API_URL = process.env.MYIMOPAY_API_URL || "https://apipg.demo.myimopay.com";
const MYIMOPAY_API_KEY = process.env.MYIMOPAY_API_KEY;

export async function verifyWithGateway(txRef: string): Promise<MyIMOPayTransactionData> {
  if (!MYIMOPAY_API_KEY) {
    throw new Error("MyIMO Pay API key is not configured");
  }

  const res = await fetch(`${MYIMOPAY_API_URL}/vi/pay/verify/${encodeURIComponent(txRef)}`, {
    headers: { "xp-key": MYIMOPAY_API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Gateway responded with status ${res.status}`);
  }

  const data = await res.json();

  if (!data.header?.is_success) {
    throw new Error(data.header?.remark || "Gateway verification failed");
  }

  return data.data;
}

export function isTransactionSuccessful(data: MyIMOPayTransactionData): boolean {
  return data.status === 1 || data.status === "1";
}

export function isTransactionFailed(data: MyIMOPayTransactionData): boolean {
  const status = data.status;
  return status === 2 || status === "2" || status === 3 || status === "3";
}

export async function updatePaymentStatus(txRef: string, status: "success" | "failed", transactionId?: string) {
  return await prisma.paymentCollection.updateMany({
    where: {
      paymentReference: txRef,
      paymentStatus: "pending", // Only update if it's still pending
    },
    data: {
      paymentStatus: status,
      transactionId: transactionId || undefined,
    },
  });
}
