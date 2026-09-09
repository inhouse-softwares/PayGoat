"use client";

import { Eye, EyeOff, User, Shield } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { PageHeader } from "../components/ui/page-header";
import { Avatar } from "../components/ui/avatar";
import { Skeleton } from "../components/ui/skeleton";

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

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      setProfile((prev) => (prev ? { ...prev, email } : prev));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 rounded-[var(--radius-xl)]" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <PageHeader
        title="My Profile"
        description="Update your login email and password."
      />

      {/* Profile card */}
      <Card padding="lg" className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={profile?.email || "U"} size="lg" />
          <div>
            <p className="font-semibold text-[var(--foreground)]">
              {profile?.email}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield size={14} className="text-[var(--accent)]" />
              <span className="text-xs text-[var(--muted-foreground)] capitalize">
                {profile?.role}
              </span>
            </div>
          </div>
        </div>

        {profile?.lastLoginAt && (
          <p className="text-xs text-[var(--muted-foreground)]">
            Last login: {new Date(profile.lastLoginAt).toLocaleString()}
          </p>
        )}
      </Card>

      {/* Password change form */}
      <Card padding="lg">
        <h3 className="text-base font-semibold text-[var(--foreground)] mb-4">
          Change Password
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type={showCurrent ? "text" : "password"}
            placeholder="Required to set a new password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="cursor-pointer"
                tabIndex={-1}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <Input
            label="New Password"
            type={showNew ? "text" : "password"}
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="cursor-pointer"
                tabIndex={-1}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <Input
            label="Confirm New Password"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (newPassword && e.target.value !== newPassword) {
                setError("New passwords do not match.");
              } else {
                setError("");
              }
            }}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="cursor-pointer"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          {error && (
            <div className="rounded-[var(--radius-md)] bg-[var(--danger-soft)] border border-[var(--danger)]/20 px-4 py-3 text-sm text-[var(--danger)]">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-[var(--radius-md)] bg-[var(--success-soft)] border border-[var(--success)]/20 px-4 py-3 text-sm text-[var(--success)]">
              {success}
            </div>
          )}

          <Button
            type="submit"
            loading={saving}
            className="w-full"
            size="lg"
          >
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
