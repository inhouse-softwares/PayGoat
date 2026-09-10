import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PaymentCollectionForm } from "./payment-collection-form";

export default async function PayPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  if (session.role !== "operator" || !session.instanceId) {
    redirect("/dashboard");
  }

  return <PaymentCollectionForm instanceId={session.instanceId} />;
}
