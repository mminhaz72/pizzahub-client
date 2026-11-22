"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import MenuCard from "@/components/menu/MenuCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Flame,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Classic Pizzas",
    desc: "Timeless Margherita, Pepperoni & wood-fired favorites",
    icon: "🍕",
  },
  {
    name: "Vegetarian Pizzas",
    desc: "Garden-fresh veggies, olives, mushrooms & extra mozzarella",
    icon: "🥗",
  },
  {
    name: "Meat Lovers",
    desc: "Loaded with smoky beef, pepperoni, sausage & grilled chicken",
    icon: "🥩",
  },
  {
    name: "Specialty / Gourmet Pizzas",
    desc: "Chef-crafted truffle, BBQ blast & artisan stuffed crusts",
    icon: "👑",
  },
  {
    name: "Sides & Appetizers",
    desc: "Cheesy garlic breadsticks, spicy wings & crispy wedges",
    icon: "🍟",
  },
  {
    name: "Beverages & Desserts",
    desc: "Chilled sodas, shakes & warm chocolate lava cakes",
    icon: "🥤",
  },
];

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://pizzahub-server-red.vercel.app";
        const res = await fetch(`${apiUrl}/menu-items?featured=true&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setFeaturedItems(data);
        }
      } catch (err) {
        console.error("Failed to fetch featured pizzas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-gradient-to-br from-red-950 via-red-900 to-orange-900 text-white py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Flame className="h-4 w-4 text-orange-400" />
              Fresh Out of Stone Ovens
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Hot & Fresh Pizza Delivered to Your Door
            </h1>
            <p className="text-base sm:text-lg text-orange-100/90 max-w-xl leading-relaxed">
              Explore top-rated neighborhood pizzerias, customize your favorite slices, and schedule piping-hot delivery straight from local kitchens.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-black text-base px-8 shadow-lg"
              >
                <Link href="/menu">
                  Explore Pizza Menu <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-orange-300/40 text-white hover:bg-white/10 font-bold text-base"
              >
                <Link href="/sign-up">Open a Vendor Kitchen</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden border-4 border-orange-400/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80"
                alt="Hot Artisanal Pizza"
                className="w-full h-[360px] sm:h-[420px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. DYNAMIC SECTION 1: FEATURED MENU ITEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-red-600">
              Chef&apos;s Spotlight
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mt-1">
              Featured Pizza Menu
            </h2>
          </div>
          <Button asChild variant="outline" className="font-bold border-red-200 text-red-600 hover:bg-red-50">
            <Link href="/menu">
              View All Menu Items <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
        </div>

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
        ) : featuredItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredItems.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-dashed border-orange-300 dark:border-zinc-800 bg-orange-50/40 dark:bg-zinc-900/40">
            <p className="text-lg font-bold text-zinc-700 dark:text-zinc-300">
              Fresh pizzas are baking in the oven!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Vendors are adding new items—check back shortly or browse the full menu.
            </p>
          </div>
        )}
      </section>

      {/* 3. DYNAMIC SECTION 2: PIZZA CATEGORIES */}
      <section className="bg-orange-50/70 dark:bg-zinc-900/60 py-20 border-y border-orange-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-orange-600">
              Craving Something Specific?
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mt-1">
              Explore by Pizza Category
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
              >
                <Link
                  href={`/menu?category=${encodeURIComponent(cat.name)}`}
                  className="block h-full p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-orange-200/70 dark:border-zinc-800 hover:border-red-500 hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white group-hover:text-red-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5">
                    {cat.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXTRA SECTION 1 (REQUIRED): WHY CHOOSE PIZZAHUB? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-black uppercase tracking-widest text-red-600">
            The PizzaHub Promise
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mt-1">
            Why Choose PizzaHub?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Flame,
              title: "Wood-Fired Freshness",
              desc: "Every pizza is baked to order using hand-stretched dough and 100% real mozzarella.",
            },
            {
              icon: ShieldCheck,
              title: "Verified Local Kitchens",
              desc: "All partner pizzerias and menu items undergo strict admin quality review.",
            },
            {
              icon: Clock,
              title: "Scheduled Delivery",
              desc: "Pick your exact delivery date and address with real-time order status tracking.",
            },
            {
              icon: Sparkles,
              title: "Premium Pizzeria Picks",
              desc: "Discover top-tier gourmet kitchens highlighted with our verified Premium badge.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-orange-200/60 dark:border-zinc-800 shadow-sm space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EXTRA SECTION 2: HOW PIZZAHUB WORKS */}
      <section className="bg-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-black">
              How PizzaHub Works
            </h2>
            <p className="text-red-100 mt-2">
              Three simple steps from oven to your dining table
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Search,
                title: "Browse & Filter Menu",
                desc: "Search by pizza name, filter by category or neighborhood, and sort by price.",
              },
              {
                step: "02",
                icon: ShoppingBag,
                title: "Schedule Your Order",
                desc: "Choose your delivery date, enter your address, and add special instructions.",
              },
              {
                step: "03",
                icon: Truck,
                title: "Track & Enjoy Hot Pizza",
                desc: "Track your order timeline from kitchen acceptance right to your doorstep.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-8 rounded-2xl bg-red-700/70 border border-red-400/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <item.icon className="h-8 w-8 text-orange-300" />
                  <span className="text-3xl font-black text-red-300/60">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold">{item.title}</h3>
                <p className="text-sm text-red-100 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}