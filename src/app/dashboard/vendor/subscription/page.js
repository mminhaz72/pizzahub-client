"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Loader2, CreditCard } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://pizzahub-server-red.vercel.app";

export default function VendorSubscriptionPage() {
  const { user, token } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  const isPremium = user?.subscriptionPlan === "premium";

  const handleUpgrade = async () => {
    setRedirecting(true);
    try {
      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Could not initiate Stripe Checkout");
        setRedirecting(false);
      }
    } catch (err) {
      toast.error("Error connecting to payment gateway");
      setRedirecting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Vendor Subscription Plan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Unlock unlimited pizza menu items, featured homepage placement, and a verified Premium badge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Free Plan */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-black">Free Plan</CardTitle>
              {!isPremium && <Badge variant="secondary">Current Plan</Badge>}
            </div>
            <CardDescription>Great for new neighborhood kitchens</CardDescription>
            <p className="text-4xl font-black pt-2">$0 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Max 3 active menu items</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Basic vendor dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Customer order management</span>
            </div>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="border-2 border-amber-500 shadow-lg relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-black flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-amber-500" /> Premium Plan
              </CardTitle>
              {isPremium && (
                <Badge className="bg-amber-500 text-zinc-950 font-bold">Active Plan</Badge>
              )}
            </div>
            <CardDescription>Maximum visibility & unlimited menu growth</CardDescription>
            <p className="text-4xl font-black pt-2 text-red-600">
              $19.99 <span className="text-sm font-normal text-muted-foreground">/ 30 days</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 font-semibold">
                <Check className="h-4 w-4 text-amber-500" />
                <span>Unlimited active menu items</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <Check className="h-4 w-4 text-amber-500" />
                <span>Verified &ldquo;Premium&rdquo; vendor badge on every card</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <Check className="h-4 w-4 text-amber-500" />
                <span>Priority featured placement on Homepage</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>All Free plan features included</span>
              </div>
            </div>

            {isPremium ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold text-center">
                ✅ Your Premium Subscription is Active!
              </div>
            ) : (
              <Button
                onClick={handleUpgrade}
                disabled={redirecting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-base"
              >
                {redirecting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                {redirecting ? "Redirecting to Stripe..." : "Upgrade to Premium"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}