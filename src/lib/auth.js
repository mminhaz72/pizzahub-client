import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();
const client = new MongoClient(uri);
const db = client.db("pizzahub");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL?.trim() || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET?.trim(),
  trustedOrigins: [
    "http://localhost:3000",
    process.env.BETTER_AUTH_URL?.trim(),
  ].filter(Boolean),
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID?.trim() || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() || "",
    },
  },
});