import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";
import { PayWorkspace } from "./pay-workspace";

export default async function PayPage() {
  const role = await getSessionRole();

  if (!role) {
    redirect("/login");
  }

  return <PayWorkspace role={role} />;
}
