"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { Pizza, Sun, Moon, LayoutDashboard, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "vendor") return "/dashboard/vendor";
    return "/dashboard/customer";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Menu", href: "/menu" },
  ];

  if (user) {
    if (user.role === "customer") {
      navLinks.push({ name: "My Orders", href: "/dashboard/customer/orders" });
    } else if (user.role === "vendor") {
      navLinks.push({ name: "My Menu", href: "/dashboard/vendor/menu" });
      navLinks.push({ name: "Orders", href: "/dashboard/vendor/orders" });
    } else if (user.role === "admin") {
      navLinks.push({ name: "Manage Users", href: "/dashboard/admin/users" });
      navLinks.push({ name: "Review Menu", href: "/dashboard/admin/menu" });
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-200/70 dark:border-zinc-800 bg-[#FFFDF9]/90 dark:bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-red-600 text-white p-2 rounded-xl shadow-sm group-hover:bg-orange-600 transition-colors">
            <Pizza className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Pizza<span className="text-red-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-red-600 dark:text-orange-500"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-orange-400"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark/Light Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full text-zinc-700 dark:text-zinc-300"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {loading ? (
            <div className="h-9 w-24 rounded-lg bg-orange-100 dark:bg-zinc-800 animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-orange-200 dark:border-zinc-800 bg-orange-50/60 dark:bg-zinc-900 hover:bg-orange-100/70 transition cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="bg-red-600 text-white font-bold text-xs">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white leading-none">
                    {user.name}
                  </p>
                  <p className="text-[10px] font-semibold uppercase text-orange-600 mt-0.5">
                    {user.role}
                  </p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <p className="font-bold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push(getDashboardLink())}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4 text-red-600" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-orange-600" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-accent transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-orange-100 dark:border-zinc-800 bg-[#FFFDF9] dark:bg-zinc-950 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-red-600"
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="pt-3 border-t border-orange-100 dark:border-zinc-800 space-y-2">
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-bold text-red-600"
              >
                Dashboard ({user.role})
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-semibold"
              >
                Profile Settings
              </Link>
              <Button onClick={handleLogout} variant="destructive" className="w-full">
                Logout
              </Button>
            </div>
          ) : (
            <div className="pt-3 border-t border-orange-100 dark:border-zinc-800 flex gap-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="w-1/2 py-2 text-center text-sm font-semibold border rounded-md"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileOpen(false)}
                className="w-1/2 py-2 text-center text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}