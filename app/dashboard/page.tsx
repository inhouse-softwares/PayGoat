import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const role = await getSessionRole();

  if (!role) {
    redirect("/login");
  }

  if (role !== "admin") {
    redirect("/pay");
  }

  return <DashboardClient />;
}
