"use client";

import { FormEvent, useEffect, useState } from "react";

type Profile = {
  id: string;
  email: string;
  role: string;
  lastLoginAt: string | null;
  instanceId: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setEmail(data.email ?? "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email !== profile?.email ? email : undefined,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update profile.");
        return;
      }

      setSuccess("Profile updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setProfile((prev) => prev ? { ...prev, email } : prev);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-sm text-[var(--muted-foreground)]">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">My Profile</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Update your login email and password.
        </p>
      </div>

      {profile?.lastLoginAt && (
        <p className="text-xs text-[var(--muted-foreground)]">
          Last login: {new Date(profile.lastLoginAt).toLocaleString()}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
            required
          />
        </div>

        <hr className="border-[var(--border)]" />
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Change password (optional)</p>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Current password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Required to set a new password"
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg border border-[var(--success)] bg-[var(--success)]/10 px-3 py-2 text-sm text-[var(--success)]">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="h-11 w-full rounded-xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
