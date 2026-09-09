import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";
import { InstancesGridClient } from "./instances-grid-client";

export default async function InstancesPage() {
  const role = await getSessionRole();

  if (!role) redirect("/login");
  if (role !== "admin") redirect("/pay");

  return <InstancesGridClient />;
}
