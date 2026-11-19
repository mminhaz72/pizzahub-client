import Link from "next/link";
import { Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-red-100 dark:bg-red-950/50 p-4 rounded-full mb-4">
        <Pizza className="h-12 w-12 text-red-600 animate-bounce" />
      </div>
      <h1 className="text-6xl font-black text-red-600">404</h1>
      <h2 className="text-2xl font-bold mt-2">Slice Not Found!</h2>
      <p className="text-muted-foreground max-w-md mt-2">
        Looks like this pizza slice got eaten or the page URL doesn&apos;t exist.
      </p>
      <Button asChild className="mt-6 bg-red-600 hover:bg-red-700 text-white">
        <Link href="/">Back to Home Kitchen</Link>
      </Button>
    </div>
  );
}