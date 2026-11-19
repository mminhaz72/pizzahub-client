"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Store, Sparkles, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function MenuCard({ item }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleViewDetails = (e) => {
    if (!user) {
      e.preventDefault();
      router.push("/sign-in");
    }
  };

  const avgRating =
    item.reviews && item.reviews.length > 0
      ? (
          item.reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          item.reviews.length
        ).toFixed(1)
      : null;

  return (
    <Card className="group h-full flex flex-col overflow-hidden border-orange-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Equal Height Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-orange-100 dark:bg-zinc-800 shrink-0">
        <img
          src={
            item.images?.[0] ||
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
          }
          alt={item.itemName}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge className="bg-red-600 hover:bg-red-600 text-white font-semibold shadow">
            {item.category}
          </Badge>
          {item.vendorPlan === "premium" && (
            <Badge className="bg-amber-500 hover:bg-amber-500 text-zinc-950 font-bold shadow flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Premium
            </Badge>
          )}
        </div>
        {avgRating && (
          <div className="absolute bottom-3 right-3 bg-zinc-950/80 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {avgRating} ({item.reviews.length})
          </div>
        )}
      </div>

      {/* Equal Flex Body */}
      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white line-clamp-1">
              {item.itemName}
            </h3>
            <span className="text-lg font-black text-red-600 dark:text-orange-500 shrink-0">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1.5">
            {item.description}
          </p>
        </div>

        <div className="pt-3 border-t border-orange-100 dark:border-zinc-800 space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
            <Store className="h-3.5 w-3.5 text-orange-600 shrink-0" />
            <span className="truncate">{item.vendorName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-red-600 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          asChild
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm"
        >
          <Link href={`/menu/${item._id}`} onClick={handleViewDetails}>
            View Details <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}