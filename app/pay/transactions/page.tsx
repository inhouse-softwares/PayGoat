import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { TransactionHistoryClient } from "./transaction-history-client";

export default async function TransactionHistoryPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  return <TransactionHistoryClient />;
}
