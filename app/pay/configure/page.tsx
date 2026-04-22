import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";
import { ConfigureInstances } from "./configure-instances";

export default async function ConfigurePage() {
  const role = await getSessionRole();
  console.log("User role:", role);

  if (!role) {
    redirect("/login");
  }

  if (role !== "admin") {
    redirect("/pay");
  }

  return <ConfigureInstances />;
}