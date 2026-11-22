"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Store,
  Loader2,
  Eye,
  XCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://pizzahub-server-red.vercel.app";

export default function CustomerOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/customer/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleCancelOrder = async (orderId) => {
    setCancellingId(orderId);
    try {
      const res = await fetch(`${API_URL}/customer/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Order cancelled successfully");
        fetchOrders();
      } else {
        toast.error(data.message || "Could not cancel order");
      }
    } catch (err) {
      toast.error("Error cancelling order");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-emerald-600 text-white uppercase">Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-rose-600 text-white uppercase">Rejected</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="uppercase">Cancelled</Badge>;
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
      <div>
        <h1 className="text-3xl font-black">My Pizza Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View order timelines, delivery details, or cancel pending requests
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="text-lg font-bold">You haven&apos;t placed any orders yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Browse our pizza menu and schedule your first hot delivery!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="border-orange-200/70 dark:border-zinc-800 overflow-hidden"
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <img
                    src={
                      order.itemImage ||
                      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={order.itemName}
                    className="h-20 w-20 rounded-xl object-cover shrink-0 border"
                  />
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-lg">{order.itemName}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Store className="h-3.5 w-3.5 text-orange-600" />
                      {order.vendorName} •{" "}
                      <span className="text-red-600 font-bold">
                        ${Number(order.price).toFixed(2)}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-red-600" />
                        Delivery: <strong>{order.deliveryDate}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-orange-600" />
                        {order.deliveryAddress}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-center">
                  {/* Order Details & Status Timeline Modal */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="font-bold">
                        <Eye className="h-4 w-4 mr-1.5" /> Details & Timeline
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="font-black text-xl">
                          Order Details & Timeline
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 text-sm">
                        <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-zinc-900 space-y-1">
                          <p className="font-bold text-base">{order.itemName}</p>
                          <p className="text-muted-foreground">Vendor: {order.vendorName}</p>
                          <p className="text-muted-foreground">
                            Delivery Date: {order.deliveryDate}
                          </p>
                          <p className="text-muted-foreground">
                            Address: {order.deliveryAddress}
                          </p>
                          <p className="text-muted-foreground">
                            Requested On: {new Date(order.createdAt).toLocaleString()}
                          </p>
                          {order.message && (
                            <p className="text-muted-foreground">
                              Instructions: &ldquo;{order.message}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Visual Timeline (Optional Requirement) */}
                        <div className="space-y-3 pt-2">
                          <p className="font-bold uppercase text-xs text-muted-foreground">
                            Order Status Timeline
                          </p>
                          <div className="space-y-3 border-l-2 border-red-600 pl-4 ml-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              <span>Order Submitted ({new Date(order.createdAt).toLocaleDateString()})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-amber-500" />
                              <span>Vendor Kitchen Review</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold">
                              <span>Current Status:</span>
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {order.status === "pending" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={cancellingId === order._id}
                      onClick={() => handleCancelOrder(order._id)}
                      className="font-bold"
                    >
                      {cancellingId === order._id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      Cancel Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}