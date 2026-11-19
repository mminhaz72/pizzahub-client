"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Pizza,
  PlusCircle,
  ClipboardList,
  CreditCard,
  Users,
  CheckSquare,
  Receipt,
  UserCog,
  Loader2,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    // Strict URL Role Guard
    if (pathname.startsWith("/dashboard/admin") && user.role !== "admin") {
      router.replace(`/dashboard/${user.role}`);
    } else if (pathname.startsWith("/dashboard/vendor") && user.role !== "vendor") {
      router.replace(`/dashboard/${user.role}`);
    } else if (pathname.startsWith("/dashboard/customer") && user.role !== "customer") {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-red-600" />
        <p className="text-sm font-semibold text-muted-foreground">
          Verifying secure dashboard access...
        </p>
      </div>
    );
  }

  const roleMenus = {
    customer: [
      { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
      { name: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
      { name: "Profile Settings", href: "/dashboard/profile", icon: UserCog },
    ],
    vendor: [
      { name: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
      { name: "My Menu Items", href: "/dashboard/vendor/menu", icon: Pizza },
      { name: "Add Menu Item", href: "/dashboard/vendor/add-menu", icon: PlusCircle },
      { name: "Customer Orders", href: "/dashboard/vendor/orders", icon: ClipboardList },
      { name: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
      { name: "Profile Settings", href: "/dashboard/profile", icon: UserCog },
    ],
    admin: [
      { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
      { name: "Manage Menu Items", href: "/dashboard/admin/menu", icon: CheckSquare },
      { name: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
      { name: "Profile Settings", href: "/dashboard/profile", icon: UserCog },
    ],
  };

  const links = roleMenus[user.role] || [];

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-orange-50/40 dark:bg-zinc-950">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-5 right-5 z-50 bg-red-600 text-white p-3.5 rounded-full shadow-xl"
        aria-label="Toggle Dashboard Menu"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-68 bg-white dark:bg-zinc-900 border-r border-orange-200/70 dark:border-zinc-800 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 space-y-6">
          {/* User Profile Card in Sidebar */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-zinc-800 dark:to-zinc-800/60 border border-orange-200/60 dark:border-zinc-700 flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-red-500">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="bg-red-600 text-white font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-extrabold text-sm truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge className="bg-red-600 text-white text-[10px] uppercase px-2 py-0">
                  {user.role}
                </Badge>
                {user.role === "vendor" && user.subscriptionPlan === "premium" && (
                  <Badge className="bg-amber-500 text-zinc-950 text-[10px] font-bold px-1.5 py-0 flex items-center gap-0.5">
                    <Sparkles className="h-2.5 w-2.5" /> PRO
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {links.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-orange-100/70 dark:hover:bg-zinc-800"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-5 border-t border-orange-100 dark:border-zinc-800 text-xs text-muted-foreground">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300 truncate">
            {user.email}
          </p>
          <p className="mt-0.5">PizzaHub Control Panel</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}