import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { OperatorDashboardClient } from "./operator-dashboard-client";

export default async function PayPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  if (session.role === "admin") {
    redirect("/dashboard");
  }

  return <OperatorDashboardClient />;
}
