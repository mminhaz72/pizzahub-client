"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Loader2, User, Calendar, MapPin } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://pizzahub-server-red.vercel.app";

export default function VendorCustomerOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/vendor/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      toast.error("Failed to fetch customer orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleOrderAction = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_URL}/vendor/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Order ${status}!`);
        fetchOrders();
      } else {
        toast.error(data.message || "Could not update order");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setUpdatingId(null);
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
      <div>
        <h1 className="text-3xl font-black">Incoming Customer Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Accept or reject pending pizza orders (status can only be set once)
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="font-bold text-lg">No customer orders received yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="border-orange-200/70 dark:border-zinc-800">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-lg">{order.itemName}</h3>
                    <Badge
                      className={
                        order.status === "accepted"
                          ? "bg-emerald-600 text-white uppercase"
                          : order.status === "rejected"
                          ? "bg-rose-600 text-white uppercase"
                          : order.status === "cancelled"
                          ? "bg-zinc-500 text-white uppercase"
                          : "bg-amber-500 text-zinc-950 uppercase"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-red-600" />
                    Customer: {order.customerName} ({order.customerEmail})
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-orange-600" />
                      Delivery Date: <strong>{order.deliveryDate}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-red-600" />
                      {order.deliveryAddress}
                    </span>
                  </div>
                  {order.message && (
                    <p className="text-xs italic text-muted-foreground">
                      Note: &ldquo;{order.message}&rdquo;
                    </p>
                  )}
                </div>

                {order.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      disabled={updatingId === order._id}
                      onClick={() => handleOrderAction(order._id, "accepted")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      <Check className="h-4 w-4 mr-1" /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={updatingId === order._id}
                      onClick={() => handleOrderAction(order._id, "rejected")}
                      className="font-bold"
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}