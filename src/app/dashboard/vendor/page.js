"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pizza,
  CheckCircle2,
  Clock,
  Sparkles,
  PlusCircle,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://pizzahub-server-red.vercel.app";

export default function VendorOverviewPage() {
  const { token, user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!token) return;
      try {
        const [menuRes, orderRes] = await Promise.all([
          fetch(`${API_URL}/vendor/menu-items`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/vendor/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (menuRes.ok) setMenuItems(await menuRes.json());
        if (orderRes.ok) setOrders(await orderRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorData();
  }, [token]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  const totalMenu = menuItems.length;
  const activeMenu = menuItems.filter((i) => i.status === "approved").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const acceptedOrders = orders.filter((o) => o.status === "accepted").length;

  const chartData = [
    { name: "Total Items", value: totalMenu },
    { name: "Active Items", value: activeMenu },
    { name: "Pending Orders", value: pendingOrders },
    { name: "Accepted Orders", value: acceptedOrders },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-black">
              {user?.businessName || user?.name}
            </h1>
            <Badge
              className={
                user?.subscriptionPlan === "premium"
                  ? "bg-amber-500 text-zinc-950 font-bold"
                  : "bg-zinc-200 text-zinc-800"
              }
            >
              {user?.subscriptionPlan === "premium" ? (
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> PREMIUM
                </span>
              ) : (
                "FREE PLAN"
              )}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor your pizza menu performance and incoming customer orders
          </p>
        </div>

        <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold">
          <Link href="/dashboard/vendor/add-menu">
            <PlusCircle className="h-4 w-4 mr-2" /> Add New Pizza
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Total Menu Items</CardTitle>
            <Pizza className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{totalMenu}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Active Items</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{activeMenu}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Pending Orders</CardTitle>
            <Clock className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{pendingOrders}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Accepted Orders</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{acceptedOrders}</p>
          </CardContent>
        </Card>
      </div>

      {/* Kitchen Chart */}
      <Card className="border-orange-200/70 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg font-black">Kitchen Activity Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#EA580C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}