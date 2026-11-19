"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    // Re-fetch user profile so webhook-updated premium status reflects in UI
    const timer = setTimeout(() => {
      refreshUser();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-emerald-100 dark:bg-emerald-950/50 p-4 rounded-full mb-4">
        <CheckCircle2 className="h-14 w-14 text-emerald-600" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-black">Payment Received!</h1>
      <p className="text-muted-foreground max-w-md mt-2">
        Thank you for upgrading to PizzaHub Vendor Premium. Your account status will activate automatically once Stripe confirms the webhook event.
      </p>
      <div className="flex gap-3 mt-6">
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold">
          <Link href="/dashboard/vendor">
            <Sparkles className="h-4 w-4 mr-2" /> Go to Vendor Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}