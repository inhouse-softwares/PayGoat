"use client";
import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/auth-types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { setRole, setInstanceId } = useAuth();
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
    setRole(data.role as UserRole);
    setInstanceId(data.instanceId ?? null);
    if (data.role === "admin") {
      router.push("/dashboard");
    } else {
      router.push(data.instanceId ? `/pay` : "/pay");
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: "var(--page-bg)" }}
    >
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo + Theme toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">PG</span>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                PayGoat
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Payment collections, simplified.
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Login card */}
        <div className="bg-[var(--surface)] rounded-[var(--radius-2xl)] border border-[var(--border)] shadow-[var(--shadow-lg)] p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
            Sign in to manage payments, settlements, and logs.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              icon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="rounded-[var(--radius-md)] bg-[var(--danger-soft)] border border-[var(--danger)]/20 px-4 py-3 text-sm text-[var(--danger)]">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
          Need access? Contact your system administrator or{" "}
          <Link
            href="/"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            return home
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
