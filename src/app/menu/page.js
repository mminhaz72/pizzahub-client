"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MenuCard from "@/components/menu/MenuCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, RotateCcw, Pizza } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pizzahub-server-red.vercel.app";

const CATEGORIES = [
  "All",
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

function BrowseMenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("default");

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (category && category !== "All") params.append("category", category);
      if (location.trim()) params.append("location", location.trim());
      if (sort && sort !== "default") params.append("sort", sort);

      const res = await fetch(`${API_URL}/menu-items?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenuItems();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, location, sort]);

  const handleReset = () => {
    setSearch("");
    setCategory("All");
    setLocation("");
    setSort("default");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <p className="text-xs font-black uppercase tracking-widest text-red-600">
          Freshly Baked Selection
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
          Browse Pizza Menu
        </h1>
        <p className="text-sm text-muted-foreground">
          Filter by category, search your favorite toppings, or sort by price
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-orange-200/80 dark:border-zinc-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search by Name */}
        <div className="relative lg:col-span-2">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search pizza name, toppings, or restaurant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <div className="relative">
          <MapPin className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Area / City..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Price Sort (Challenge Requirement) */}
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Newest First</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filter Reset */}
      {(search || category !== "All" || location || sort !== "default") && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Showing <span className="font-bold text-foreground">{items.length}</span> matching items
          </p>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600">
            <RotateCcw className="h-4 w-4 mr-1.5" /> Reset Filters
          </Button>
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="space-y-3">
              <Skeleton className="h-52 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-dashed border-orange-300 dark:border-zinc-800 space-y-3">
          <Pizza className="h-12 w-12 mx-auto text-orange-400" />
          <h3 className="text-xl font-bold">No Matching Pizzas Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Try adjusting your search keywords, area filter, or category selection.
          </p>
          <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default function BrowseMenuPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading menu...</div>}>
      <BrowseMenuContent />
    </Suspense>
  );
}