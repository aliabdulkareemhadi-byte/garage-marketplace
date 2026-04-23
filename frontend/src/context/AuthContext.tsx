import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Session, UserRole } from "../data/mockData";

type AuthCtx = {
  session: Session | null;
  login: (role: UserRole, name: string, email: string, entityId?: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const login = (role: UserRole, name: string, email: string, entityId?: string) => {
    setSession({ role, name, email, entityId });
  };
  const logout = () => setSession(null);

  return <Ctx.Provider value={{ session, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
