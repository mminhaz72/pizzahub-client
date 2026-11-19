"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardRootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/sign-in");
    } else if (user.role === "admin") {
      router.replace("/dashboard/admin");
    } else if (user.role === "vendor") {
      router.replace("/dashboard/vendor");
    } else {
      router.replace("/dashboard/customer");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-red-600" />
    </div>
  );
}