"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Pizza,
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

export default function CustomerOverviewPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  const total = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const accepted = orders.filter((o) => o.status === "accepted").length;
  const rejected = orders.filter((o) => o.status === "rejected").length;

  const chartData = [
    { name: "Pending", count: pending },
    { name: "Accepted", count: accepted },
    { name: "Rejected", count: rejected },
    { name: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Welcome, {user?.name}!</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your pizza orders and delivery status at a glance
          </p>
        </div>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold">
          <Link href="/menu">
            <Pizza className="h-4 w-4 mr-2" /> Order More Pizza
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Total Orders</CardTitle>
            <ShoppingBag className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{total}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Pending Orders</CardTitle>
            <Clock className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{pending}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Accepted Orders</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{accepted}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Rejected Orders</CardTitle>
            <XCircle className="h-5 w-5 text-rose-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Chart */}
      <Card className="border-orange-200/70 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg font-black">Order Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#DC2626" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}