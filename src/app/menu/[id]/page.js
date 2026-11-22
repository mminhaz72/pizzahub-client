"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Store,
  Sparkles,
  ArrowLeft,
  Calendar,
  ShoppingBag,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://pizzahub-server-red.vercel.app";

export default function MenuItemDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Order Form State
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in");
    }
  }, [authLoading, user, router]);

  const fetchDetails = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/menu-items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Menu item not found");
      } else {
        setItem(data);
      }
    } catch (err) {
      setError("Failed to load menu item details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && id) {
      fetchDetails();
    }
  }, [token, id]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!deliveryDate || !deliveryAddress.trim()) {
      toast.error("Please enter both delivery date and delivery address.");
      return;
    }

    setSubmittingOrder(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: item._id,
          deliveryDate,
          deliveryAddress,
          message,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Order placed successfully! Track it in your dashboard.");
        setShowOrderForm(false);
        setDeliveryDate("");
        setDeliveryAddress("");
        setMessage("");
        router.push("/dashboard/customer/orders");
      } else {
        toast.error(data.message || "Could not place order");
      }
    } catch (err) {
      toast.error("Network error while placing order");
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/menu-items/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Thank you for your review!");
        setComment("");
        fetchDetails();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (err) {
      toast.error("Error submitting review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-600" />
        <h2 className="text-2xl font-bold">{error || "Invalid Item ID"}</h2>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
          <Link href="/menu">Back to Browse Menu</Link>
        </Button>
      </div>
    );
  }

  const images =
    item.images?.length > 0
      ? item.images
      : ["https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"];

  const canOrder = user?.role === "customer" && item.status === "approved";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <Link
        href="/menu"
        className="inline-flex items-center text-sm font-bold text-red-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Multiple Images Gallery */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-orange-200 dark:border-zinc-800 h-80 sm:h-96 bg-orange-50 dark:bg-zinc-900">
            <img
              src={images[selectedImage]}
              alt={item.itemName}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-20 w-24 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                    selectedImage === i ? "border-red-600" : "border-transparent opacity-70"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Item Details & Order Action */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-red-600 text-white">{item.category}</Badge>
            {item.vendorPlan === "premium" && (
              <Badge className="bg-amber-500 text-zinc-950 font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Premium Vendor
              </Badge>
            )}
            <Badge variant="outline" className="uppercase">
              Status: {item.status}
            </Badge>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
              {item.itemName}
            </h1>
            <p className="text-3xl font-black text-red-600 mt-2">
              ${Number(item.price).toFixed(2)}
            </p>
          </div>

          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {item.description}
          </p>

          <div className="p-4 rounded-xl bg-orange-50/70 dark:bg-zinc-900 border border-orange-200/70 dark:border-zinc-800 space-y-2 text-sm">
            <div className="flex items-center gap-2 font-bold">
              <Store className="h-4 w-4 text-orange-600" />
              <span>Restaurant: {item.vendorName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-red-600" />
              <span>Location: {item.location}</span>
            </div>
          </div>

          {/* Role-Based Order Rules */}
          {user?.role === "vendor" && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-amber-800 dark:text-amber-200 text-sm font-semibold">
              Vendor accounts cannot place customer orders. Switch to a customer account to order.
            </div>
          )}

          {user?.role === "admin" && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 text-blue-800 dark:text-blue-200 text-sm font-semibold">
              Admin accounts cannot place customer orders.
            </div>
          )}

          {canOrder && !showOrderForm && (
            <Button
              size="lg"
              onClick={() => setShowOrderForm(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-md"
            >
              <ShoppingBag className="h-5 w-5 mr-2" /> Order This Pizza Now
            </Button>
          )}

          {/* Order Form */}
          {canOrder && showOrderForm && (
            <Card className="border-red-200 dark:border-zinc-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-600" /> Complete Your Delivery Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="deliveryDate">Delivery Date</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Input
                      id="deliveryAddress"
                      placeholder="House 14, Road 7, Dhanmondi, Dhaka"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">Additional Message / Crust Preference</Label>
                    <Textarea
                      id="message"
                      placeholder="Extra oregano, ring the doorbell..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={submittingOrder}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                      {submittingOrder ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Confirm Order (${Number(item.price).toFixed(2)})
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowOrderForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reviews & Ratings Section (Optional Requirement) */}
      <div className="pt-10 border-t border-orange-200/70 dark:border-zinc-800 space-y-6">
        <h2 className="text-2xl font-black">
          Customer Reviews ({item.reviews?.length || 0})
        </h2>

        {user?.role === "customer" && (
          <form
            onSubmit={handleAddReview}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-orange-200/70 dark:border-zinc-800 space-y-4 max-w-xl"
          >
            <h3 className="font-bold text-sm">Rate this Pizza</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="cursor-pointer"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Share how fresh and cheesy this pizza was..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <Button
              type="submit"
              disabled={submittingReview}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
            >
              Submit Review
            </Button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {item.reviews?.length > 0 ? (
            item.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{rev.userName}</span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" /> {rev.rating}/5
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No reviews yet. Be the first to taste and review!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}