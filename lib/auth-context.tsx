"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { UserRole } from "@/lib/auth-types";

type AuthContextType = {
  role: UserRole | null;
  instanceId: string | null;
  setRole: (role: UserRole | null) => void;
  setInstanceId: (instanceId: string | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  role: null,
  instanceId: null,
  setRole: () => {},
  setInstanceId: () => {},
});

export function AuthProvider({
  children,
  initialRole,
  initialInstanceId,
}: {
  children: React.ReactNode;
  initialRole: UserRole | null;
  initialInstanceId?: string | null;
}) {
  const [role, setRole] = useState<UserRole | null>(initialRole);
  const [instanceId, setInstanceId] = useState<string | null>(initialInstanceId ?? null);

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    setInstanceId(initialInstanceId ?? null);
  }, [initialInstanceId]);

  return (
    <AuthContext.Provider value={{ role, instanceId, setRole, setInstanceId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
