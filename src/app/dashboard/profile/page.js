"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadToImgBB } from "@/lib/imgbb";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://pizzahub-server-red.vercel.app";

export default function ProfileSettingsPage() {
  const { user, token, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = user?.image || "";
      if (imageFile) {
        imageUrl = await uploadToImgBB(imageFile);
      }

      const res = await fetch(`${API_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          image: imageUrl,
          businessName: user?.role === "vendor" ? businessName : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await refreshUser();
        toast.success("Profile updated successfully!");
        setImageFile(null);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error(err.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal details and profile avatar
        </p>
      </div>

      <Card className="border-orange-200/70 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-red-600">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback className="bg-red-600 text-white text-xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-black">{user?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-red-600 text-white uppercase">{user?.role}</Badge>
              {user?.role === "vendor" && (
                <Badge variant="outline" className="uppercase">
                  Plan: {user?.subscriptionPlan}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {user?.role === "vendor" && (
              <div className="space-y-1.5">
                <Label htmlFor="businessName">Restaurant / Kitchen Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address (Read-only)</Label>
              <Input id="email" value={user?.email || ""} disabled />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profileImg">Upload New Profile Image (Optional)</Label>
              <Input
                id="profileImg"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}