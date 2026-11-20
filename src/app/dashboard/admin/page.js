"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Store,
  UserCheck,
  Pizza,
  Clock,
  Receipt,
  DollarSign,
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

export default function AdminOverviewPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setStats(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  const chartData = [
    { name: "Users", count: stats?.totalUsers || 0 },
    { name: "Vendors", count: stats?.totalVendors || 0 },
    { name: "Customers", count: stats?.totalCustomers || 0 },
    { name: "Menu Items", count: stats?.totalMenuItems || 0 },
    { name: "Pending Items", count: stats?.pendingMenuItems || 0 },
    { name: "Transactions", count: stats?.totalTransactions || 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Admin Control Center</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform-wide users, menu submissions, and Stripe subscription revenue
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Total Registered Users</CardTitle>
            <Users className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{stats?.totalUsers || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Total Vendors</CardTitle>
            <Store className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{stats?.totalVendors || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Total Customers</CardTitle>
            <UserCheck className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{stats?.totalCustomers || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Total Menu Items</CardTitle>
            <Pizza className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{stats?.totalMenuItems || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Pending Menu Items</CardTitle>
            <Clock className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{stats?.pendingMenuItems || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200/70 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">Total Transactions</CardTitle>
            <Receipt className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">
              {stats?.totalTransactions || 0}{" "}
              <span className="text-base font-bold text-emerald-600">
                (${Number(stats?.totalRevenue || 0).toFixed(2)})
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Analytics Chart */}
      <Card className="border-orange-200/70 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg font-black">Platform Overview Analytics</CardTitle>
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