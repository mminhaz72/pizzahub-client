"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Loader2,
  Power,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://pizzahub-server-red.vercel.app";

export default function VendorMenuItemsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchMyItems = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/vendor/menu-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setItems(await res.json());
    } catch (err) {
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/vendor/menu-items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Menu item deleted");
        fetchMyItems();
      } else {
        toast.error("Could not delete item");
      }
    } catch (err) {
      toast.error("Error deleting item");
    }
  };

  const handleToggleAvailability = async (item) => {
    const nextStatus = item.status === "approved" ? "inactive" : "approved";
    try {
      const res = await fetch(`${API_URL}/vendor/menu-items/${item._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        toast.success(`Item marked as ${nextStatus}`);
        fetchMyItems();
      }
    } catch (err) {
      toast.error("Failed to change availability");
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/vendor/menu-items/${editingItem._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName: editingItem.itemName,
          price: editingItem.price,
          location: editingItem.location,
          description: editingItem.description,
        }),
      });
      if (res.ok) {
        toast.success("Menu item updated!");
        setEditingItem(null);
        fetchMyItems();
      } else {
        toast.error("Failed to update item");
      }
    } catch (err) {
      toast.error("Error updating item");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
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

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">My Menu Items</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edit prices, toggle availability, or manage your submitted pizzas
          </p>
        </div>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold">
          <Link href="/dashboard/vendor/add-menu">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Menu Item
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="font-bold text-lg">No menu items published yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add your first pizza to start receiving orders!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <Card
              key={item._id}
              className="border-orange-200/70 dark:border-zinc-800 overflow-hidden"
            >
              <CardContent className="p-5 flex gap-4">
                <img
                  src={item.images?.[0]}
                  alt={item.itemName}
                  className="h-24 w-24 rounded-xl object-cover shrink-0 border"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-base line-clamp-1">{item.itemName}</h3>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.category} • {item.location}
                  </p>
                  <p className="font-black text-red-600 text-base">
                    ${Number(item.price).toFixed(2)}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingItem(item)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>

                    {["approved", "inactive"].includes(item.status) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleAvailability(item)}
                      >
                        <Power className="h-3.5 w-3.5 mr-1" />
                        {item.status === "approved" ? "Pause" : "Activate"}
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-black">Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Item Name</Label>
                <Input
                  value={editingItem.itemName}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, itemName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input
                    value={editingItem.location}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, location: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                {saving ? "Saving..." : "Update Item"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}