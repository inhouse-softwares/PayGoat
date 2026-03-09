import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";

export default async function Home() {
  const role = await getSessionRole();

  if (role === "admin") {
    redirect("/dashboard");
  }

  if (role === "operator") {
    redirect("/pay");
  }

  redirect("/login");
}
