import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();

const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
} else {
  client = global._mongoClient;
}
global._mongoClient = client;

await global._mongoClientPromise;
const db = client.db("pizzahub");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL?.trim() || "https://pizzahub-client-pi.vercel.app",
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
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
      },
      businessName: {
        type: "string",
        defaultValue: "",
      },
      subscriptionPlan: {
        type: "string",
        defaultValue: "free",
      },
    },
  },
  advanced: {
    useSecureCookies: true,
    crossSubDomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
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