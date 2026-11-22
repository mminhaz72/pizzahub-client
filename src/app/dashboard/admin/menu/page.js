"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Search, Check, X, Trash2, Loader2 } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://pizzahub-server-red.vercel.app";

export default function AdminManageMenuPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const fetchItems = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (status !== "all") params.append("status", status);

      const res = await fetch(
        `${API_URL}/admin/menu-items?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) setItems(await res.json());
    } catch (err) {
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchItems, 300);
    return () => clearTimeout(timer);
  }, [token, search, status]);

  const handleStatusChange = async (id, nextStatus) => {
    try {
      const res = await fetch(
        `${API_URL}/admin/menu-items/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchItems();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/admin/menu-items/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        toast.success("Item deleted by admin");
        fetchItems();
      }
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case "approved":
        return <Badge className="bg-emerald-600 text-white uppercase">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-rose-600 text-white uppercase">Rejected</Badge>;
      case "inactive":
        return <Badge variant="secondary" className="uppercase">Inactive</Badge>;
      default:
        return <Badge className="bg-amber-500 text-zinc-950 uppercase">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Review & Manage Menu Items</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Approve pending pizzas, reject inappropriate submissions, or manage published items
        </p>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search by item name or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-orange-200/70 dark:border-zinc-800">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-red-600" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="flex items-center gap-3 font-bold">
                    <img
                      src={item.images?.[0]}
                      alt={item.itemName}
                      className="h-11 w-11 rounded-lg object-cover border shrink-0"
                    />
                    <div>
                      <p className="line-clamp-1">{item.itemName}</p>
                      <p className="text-xs font-normal text-muted-foreground">
                        {item.location}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold">
                    {item.vendorName}
                  </TableCell>
                  <TableCell className="text-xs">{item.category}</TableCell>
                  <TableCell className="font-bold text-red-600">
                    ${Number(item.price).toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right space-x-1.5">
                    {item.status !== "approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(item._id, "approved")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Approve
                      </Button>
                    )}
                    {item.status !== "rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(item._id, "rejected")}
                      >
                        <X className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}