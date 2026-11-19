"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [dbUser, setDbUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncWithBackend = async (sessionUser, extraData = {}) => {
    try {
      const pendingRole =
        typeof window !== "undefined" ? localStorage.getItem("pizzahub_pending_role") : null;
      const pendingBusiness =
        typeof window !== "undefined" ? localStorage.getItem("pizzahub_pending_business") : null;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sessionUser.email,
          name: sessionUser.name,
          image: sessionUser.image || "",
          role: extraData.role || pendingRole || "customer",
          businessName: extraData.businessName || pendingBusiness || "",
        }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        setDbUser(data.user);
        localStorage.setItem("pizzahub_jwt", data.token);
        localStorage.removeItem("pizzahub_pending_role");
        localStorage.removeItem("pizzahub_pending_business");
        return data.user;
      } else {
        setDbUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Backend JWT sync error:", error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  useEffect(() => {
    if (sessionLoading) return;

    if (session?.user) {
      const savedToken = localStorage.getItem("pizzahub_jwt");
      if (savedToken) setToken(savedToken);
      syncWithBackend(session.user);
    } else {
      setDbUser(null);
      setToken(null);
      localStorage.removeItem("pizzahub_jwt");
      setLoading(false);
    }
  }, [session, sessionLoading]);

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updated = await res.json();
        setDbUser(updated);
      }
    } catch (err) {
      console.error("Refresh user failed:", err);
    }
  };

  const logout = async () => {
    await authClient.signOut();
    localStorage.removeItem("pizzahub_jwt");
    setDbUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: dbUser,
        sessionUser: session?.user || null,
        token,
        loading: sessionLoading || loading,
        syncWithBackend,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);