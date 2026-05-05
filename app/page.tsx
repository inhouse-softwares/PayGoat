import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";
import LandingPage from "./landing-page";

export default async function Home() {
  const role = await getSessionRole();

  if (role === "admin") {
    redirect("/dashboard");
  }

  if (role === "operator") {
    redirect("/pay");
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
}
