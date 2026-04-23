"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { UserRole } from "@/lib/auth-types";

type AuthContextType = {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  role: null,
  setRole: () => {},
});

export function AuthProvider({
  children,
  initialRole,
}: {
  children: React.ReactNode;
  initialRole: UserRole | null;
}) {
  const [role, setRole] = useState<UserRole | null>(initialRole);

  // Keep context in sync if the server sends a different initialRole
  // (e.g. after a hard navigation or when the cookie expires).
  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  return <AuthContext.Provider value={{ role, setRole }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
