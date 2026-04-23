"use client"
import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/auth-types";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { setRole } = useAuth();
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError("Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    const data = await response.json();

    // Update context BEFORE navigating so PortalChrome has the role immediately
    setRole(data.role as UserRole);
    router.push(data.role === "admin" ? "/dashboard" : "/pay");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: "var(--page-bg)" }}>
      <main className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_-30px_rgba(20,30,60,0.35)] sm:p-8">
        <div className="mb-4 flex justify-end">
          <ThemeToggle />
        </div>

        <div className="mb-6 flex items-center gap-3">
          <Image src="/logo.svg" alt="PayGoat" width={40} height={40} className="w-10"/>
          <div>
            <p className="text-lg font-semibold text-[var(--foreground)]">Paygoat</p>
            <p className="text-xs text-[var(--muted-foreground)]">Payment collections, simplified.</p>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Welcome back</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Sign in to manage payments, settlements, and logs.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--foreground)]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@example.com"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--foreground)]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* {hasInvalidCredentials ? (
            <p className="rounded-lg border border-[#f2c7c7] bg-[#fde8e8] px-3 py-2 text-sm text-[#a12a2a]">
              Invalid email or password.
            </p>
          ) : null} */}

          {error && (
            <p className="rounded-lg border border-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={`h-11 w-full rounded-xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-xs text-[var(--muted-foreground)]">
          Need access? Contact your system administrator or return to{" "}
          <Link href="/" className="font-medium text-[var(--accent)]">
            home
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
