import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
if (!global._mongoClient) {
  global._mongoClient = new MongoClient(uri, options);
}
client = global._mongoClient;

const db = client.db("pizzahub");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL?.trim() || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET?.trim(),
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://pizzahub-client-pi.vercel.app",
    process.env.BETTER_AUTH_URL?.trim(),
  ].filter(Boolean),
  database: mongodbAdapter(db, {
    client,
  }),
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