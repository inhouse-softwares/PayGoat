import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";
import { InstanceDetailClient } from "./instance-detail-client";

export default async function InstanceDetailPage({
  params,
}: {
  params: Promise<{ instanceId: string }>;
}) {
  const role = await getSessionRole();

  if (!role) {
    redirect("/login");
  }

  if (role !== "admin") {
    redirect("/pay");
  }

  const { instanceId } = await params;

  return <InstanceDetailClient instanceId={instanceId} />;
}
