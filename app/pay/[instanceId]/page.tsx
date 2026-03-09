import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";
import { PaymentCollectionForm } from "../payment-collection-form";

type PaymentInstancePageProps = {
  params: Promise<{ instanceId: string }>;
};

export default async function PaymentInstancePage({ params }: PaymentInstancePageProps) {
  const role = await getSessionRole();

  if (!role) {
    redirect("/login");
  }

  if (role !== "operator") {
    redirect("/pay");
  }

  const { instanceId } = await params;

  return <PaymentCollectionForm instanceId={instanceId} />;
}
