import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";

export default async function DashboardPage() {
  const role = await getSessionRole();

  if (!role) {
    redirect("/login");
  }

  if (role !== "admin") {
    redirect("/pay");
  }

  const transactions = [
    {
      id: "TXN-1091",
      payer: "Brightline Energy",
      service: "Permit Processing",
      amount: "$8,400.00",
      idclPercentage: "35%",
      idclAmount: "$2,940.00",
      motAmount: "$5,460.00",
      status: "Completed",
      date: "Mar 06, 2026",
    },
    {
      id: "TXN-1090",
      payer: "Aina Logistics",
      service: "Inspection Fees",
      amount: "$3,250.00",
      idclPercentage: "30%",
      idclAmount: "$975.00",
      motAmount: "$2,275.00",
      status: "Completed",
      date: "Mar 06, 2026",
    },
    {
      id: "TXN-1089",
      payer: "Kano Steel Works",
      service: "Compliance Renewal",
      amount: "$5,100.00",
      idclPercentage: "40%",
      idclAmount: "$2,040.00",
      motAmount: "$3,060.00",
      status: "Pending",
      date: "Mar 05, 2026",
    },
    {
      id: "TXN-1088",
      payer: "Mori Farms",
      service: "License Issuance",
      amount: "$1,780.00",
      idclPercentage: "25%",
      idclAmount: "$445.00",
      motAmount: "$1,335.00",
      status: "Completed",
      date: "Mar 05, 2026",
    },
    {
      id: "TXN-1087",
      payer: "Nexa Construction",
      service: "Project Certification",
      amount: "$6,320.00",
      idclPercentage: "33%",
      idclAmount: "$2,085.60",
      motAmount: "$4,234.40",
      status: "Failed",
      date: "Mar 04, 2026",
    },
  ];

  const statusClasses: Record<string, string> = {
    Completed: "bg-[#e6f6ed] text-[var(--success)]",
    Pending: "bg-[#fff3dd] text-[var(--warning)]",
    Failed: "bg-[#fde8e8] text-[var(--danger)]",
  };

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            Payment Overview
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Track collections and earnings split between IDCL and MOT.
          </p>
        </div>

        <section className="rounded-2xl bg-blue-700 px-5 py-5 text-white">
          <p className="text-sm text-white/80">Total Payments</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight">
            $24,850.00
          </p>
          <p className="mt-2 text-sm text-white/80">
            38 successful payments this week
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <p className="text-sm text-[var(--muted-foreground)]">IDCL Earnings</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              $8,485.60
            </p>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              Average IDCL share: 32.6%
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <p className="text-sm text-[var(--muted-foreground)]">MOT Earnings</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              $16,364.40
            </p>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              Average MOT share: 67.4%
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Transaction History
            </h2>
            <div className="flex gap-2 text-xs">
              <button className="rounded-full bg-[var(--surface-alt)] px-3 py-1.5 font-medium text-[var(--muted-foreground)]">
                Last 7 Days
              </button>
              <button className="rounded-full bg-[var(--surface-alt)] px-3 py-1.5 font-medium text-[var(--muted-foreground)]">
                Export
              </button>
              <div className="">
                <input
                  className="h-10 w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                  placeholder="Search transactions"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-[var(--surface-alt)] text-left text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Transaction ID</th>
                  <th className="px-4 py-3 font-semibold">Payer</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">IDCL %</th>
                  <th className="px-4 py-3 font-semibold">IDCL Earning</th>
                  <th className="px-4 py-3 font-semibold">MOT Earning</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-[var(--border)] text-[var(--foreground)] even:bg-[var(--surface-soft)]"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium text-[var(--foreground)]">
                      {transaction.id}
                    </td>
                    <td className="px-4 py-3">{transaction.payer}</td>
                    <td className="px-4 py-3">{transaction.service}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--foreground)]">
                      {transaction.amount}
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--accent)]">
                      {transaction.idclPercentage}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--success)]">
                      {transaction.idclAmount}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--foreground)]">
                      {transaction.motAmount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[transaction.status]}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {transaction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
