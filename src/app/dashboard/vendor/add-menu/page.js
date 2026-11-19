"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { uploadToImgBB } from "@/lib/imgbb";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, PlusCircle } from "lucide-react";

const CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

export default function AddMenuItemPage() {
  const router = useRouter();
  const { token, user } = useAuth();

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Classic Pizzas");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select a pizza image to upload.");
      return;
    }

    setSubmitting(true);
    try {
      const uploadedUrl = await uploadToImgBB(imageFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/menu-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName,
          category,
          description,
          price: parseFloat(price),
          location,
          images: [uploadedUrl],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Menu item submitted! Waiting for admin approval.");
        router.push("/dashboard/vendor/menu");
      } else {
        toast.error(data.message || "Failed to add menu item");
      }
    } catch (err) {
      toast.error(err.message || "Error uploading or submitting item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black">Add New Menu Item</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Publish a new pizza, side, or drink to your restaurant menu
        </p>
      </div>

      {user?.subscriptionPlan !== "premium" && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-amber-900 dark:text-amber-200 text-xs font-semibold">
          Free Plan Notice: You can have up to 3 active/pending items. Upgrade to Premium for unlimited items!
        </div>
      )}

      <Card className="border-orange-200/70 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="font-black">Item Details</CardTitle>
          <CardDescription>
            All items start with &ldquo;Pending&rdquo; status until approved by an Admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                placeholder="Smoky BBQ Chicken Pizza"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price">Price ($ USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="14.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Restaurant Location (Area / City)</Label>
              <Input
                id="location"
                placeholder="Banani, Dhaka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description & Ingredients</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Hand-tossed dough topped with smoky BBQ chicken, red onions, cilantro, and melted mozzarella..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="itemImage">Item Image (Required — Uploaded via ImgBB)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="itemImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  required
                />
                <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <PlusCircle className="h-4 w-4 mr-2" />
              )}
              {submitting ? "Uploading Image & Saving..." : "Publish Menu Item"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}