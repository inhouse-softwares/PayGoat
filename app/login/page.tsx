"use client"
import Link from "next/link";
import { loginAction } from "../actions/auth";
import { ThemeToggle } from "../components/theme-toggle";
import { useState } from "react";
import { redirect } from "next/navigation";
import { Sign } from "crypto";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
    const loginData = {
      email,
      password,
    };
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    
    if (!response.ok) {
      console.log("Login failed");
      return;
    }
    
    const data = await response.json();
    redirect(data.role === "admin" ? "/dashboard" : "/pay");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: "var(--page-bg)" }}>
      <main className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_-30px_rgba(20,30,60,0.35)] sm:p-8">
        <div className="mb-4 flex justify-end">
          <ThemeToggle />
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[var(--accent)]" />
          <div>
            <p className="text-lg font-semibold text-[var(--foreground)]">PayGoat Portal</p>
            <p className="text-xs text-[var(--muted-foreground)]">Admin or operator sign in</p>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Welcome back</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Sign in to manage payments, settlements, and logs.
        </p>

        <form onSubmit={(e) => handleLogin(e)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--foreground)]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@paygoat.com"
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

          <button
            type="submit"
            className={`h-11 w-full rounded-xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-xs text-[var(--muted-foreground)]">
          Admin: <span className="font-mono">admin@paygoat.com / admin123</span>
        </p>
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          Operator: <span className="font-mono">operator@paygoat.com / operator123</span>
        </p>
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          Override via <span className="font-mono">ADMIN_EMAIL</span>,{" "}
          <span className="font-mono">ADMIN_PASSWORD</span>, <span className="font-mono">OPERATOR_EMAIL</span>, and{" "}
          <span className="font-mono">OPERATOR_PASSWORD</span>.
        </p>

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
