"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/context/AuthContext";
import { uploadToImgBB } from "@/lib/imgbb";
import { toast } from "sonner";
import { Pizza, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  const router = useRouter();
  const { syncWithBackend } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [businessName, setBusinessName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter.";
    return null;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const pwdError = validatePassword(password);
    if (pwdError) {
      toast.error(pwdError);
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = "";
      if (imageFile) {
        try {
          uploadedImageUrl = await uploadToImgBB(imageFile);
        } catch (imgErr) {
          toast.warning("Profile image skipped: " + imgErr.message);
        }
      }

      localStorage.setItem("pizzahub_pending_role", role);
      if (role === "vendor" && businessName) {
        localStorage.setItem("pizzahub_pending_business", businessName);
      }

      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        image: uploadedImageUrl || undefined,
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        setLoading(false);
        return;
      }

      if (data?.user) {
        const syncedUser = await syncWithBackend(data.user, { role, businessName });
        toast.success("Welcome to PizzaHub! Account created successfully.");
        if (syncedUser?.role === "vendor") {
          router.push("/dashboard/vendor");
        } else {
          router.push("/dashboard/customer");
        }
      }
    } catch (err) {
      toast.error("Something went wrong during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    localStorage.setItem("pizzahub_pending_role", role);
    if (role === "vendor" && businessName) {
      localStorage.setItem("pizzahub_pending_business", businessName);
    }
    await authClient.signIn.social({
      provider: "google",
      callbackURL: role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer",
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-orange-50 via-[#FFFDF9] to-red-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <Card className="w-full max-w-md border-orange-200/80 dark:border-zinc-800 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-red-600 text-white p-2.5 rounded-xl w-fit">
            <Pizza className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-black">Create Your Account</CardTitle>
          <CardDescription>
            Join PizzaHub as a hungry customer or a local pizza restaurant
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-1.5">
              <Label>Account Role</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`py-2.5 px-3 rounded-lg text-sm font-bold border transition cursor-pointer ${
                    role === "customer"
                      ? "bg-red-600 text-white border-red-600"
                      : "border-zinc-200 dark:border-zinc-700 hover:bg-orange-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  🍕 Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("vendor")}
                  className={`py-2.5 px-3 rounded-lg text-sm font-bold border transition cursor-pointer ${
                    role === "vendor"
                      ? "bg-orange-600 text-white border-orange-600"
                      : "border-zinc-200 dark:border-zinc-700 hover:bg-orange-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  🏪 Vendor (Restaurant)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="MD. Minhaz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {role === "vendor" && (
              <div className="space-y-1.5">
                <Label htmlFor="businessName">Restaurant / Kitchen Name</Label>
                <Input
                  id="businessName"
                  placeholder="Crust & Fire Pizzeria"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="avatar">Profile Image (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignUp}
            className="w-full font-semibold"
          >
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-red-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}