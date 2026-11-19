import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-rose-100 dark:bg-rose-950/50 p-4 rounded-full mb-4">
        <XCircle className="h-14 w-14 text-rose-600" />
      </div>
      <h1 className="text-3xl font-black">Payment Cancelled</h1>
      <p className="text-muted-foreground max-w-md mt-2">
        Your Stripe checkout session was cancelled and no charges were made. You can upgrade anytime from your dashboard.
      </p>
      <Button asChild className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold">
        <Link href="/dashboard/vendor/subscription">Back to Subscription Plans</Link>
      </Button>
    </div>
  );
}