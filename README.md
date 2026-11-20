# PizzaHub — Pizza Ordering & Delivery Platform

**PizzaHub** is a full-stack, role-based pizza ordering and delivery web application built with **Next.js (App Router)**, **Express.js**, **MongoDB**, **Better Auth**, **JWT**, and **Stripe**. Customers discover local pizzerias, search and filter artisan pizza menus, and schedule deliveries; Vendors manage restaurant menus and incoming orders with optional Premium upgrades via Stripe; and Admins oversee users, menu approvals, and verified platform transactions.

---

## Live & Repository Links
- **Live Website:** https://pizzahub-client.vercel.app *(Update after Vercel deploy)*
- **Client GitHub Repository:** https://github.com/mminhaz72/pizzahub-client
- **Server GitHub Repository:** https://github.com/mminhaz72/pizzahub-server

---

## Key Features
- **Role-Based Authentication & Authorization:** Powered by Better Auth (Email/Password + Google OAuth) synced with custom Express JWT tokens (`customer`, `vendor`, `admin`).
- **Customer Experience:** Browse approved menus, search by name/toppings, filter by category & location, sort by price, rate/review pizzas, place scheduled orders, track visual order timelines, and cancel pending orders.
- **Vendor Kitchen Management:** Publish pizza items with **ImgBB** image uploads, edit/pause/delete items, accept/reject incoming customer orders once, and upgrade to **Premium** via Stripe Checkout.
- **Admin Control Center:** Search/filter registered users, block/unblock accounts, approve/reject/delete submitted menu items, and monitor an immutable Stripe transaction ledger.
- **Modern Pizza-Themed UI/UX:** Warm cream, tomato red, and cheese orange palette with **Dark/Light Mode Toggle**, Framer Motion animations, Recharts analytics, and responsive ShadCN UI components.

---

## Challenge Requirements Implementation Note
1. **Advanced Search & Price Sorting:**
   - Implemented dynamic MongoDB query filters in `GET /menu-items` using query parameters: `search` (case-insensitive `$regex` across `itemName`, `description`, and `vendorName`), `category`, `location`, and `sort` (`price_asc` -> `{ price: 1 }`, `price_desc` -> `{ price: -1 }`, `featured=true` -> `{ vendorPlan: -1, createdAt: -1 }`).
2. **JWT & Role-Based Middleware Security:**
   - Upon login/registration via Better Auth, the client requests a signed 7-day JWT from `POST /auth/jwt`. Protected Express endpoints chain `verifyToken` (validates `Authorization: Bearer <token>`), `verifyActiveUser` (blocks suspended users), and `verifyRole(...)` (enforces `admin`, `vendor`, or `customer` permissions), returning `401` or `403` on unauthorized access.
3. **Verified Stripe Webhook Subscription Flow:**
   - Vendor upgrades initiate a Stripe Checkout session via `POST /create-checkout-session`. Premium status (`subscriptionPlan: "premium"`) and `transactions` records are written exclusively inside the signature-verified `POST /webhook` handler (`checkout.session.completed`).

---

## Technology Stack (NPM Packages)
- **Frontend:** `next`, `react`, `better-auth`, `framer-motion`, `lucide-react`, `next-themes`, `recharts`, `sonner`, `tailwindcss`, ShadCN UI (`@radix-ui/*`)
- **Backend:** `express`, `mongodb`, `jsonwebtoken`, `stripe`, `cors`, `dotenv`

---

## Environment Variables

### Client (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key