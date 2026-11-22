# 🍕 PizzaHub — Online Pizza Ordering & Multi-Vendor Platform (Client)

PizzaHub is a modern, full-stack pizza ordering and multi-vendor food delivery web application built with **Next.js (App Router)**. It supports role-based dashboards for **Customers**, **Vendors**, and **Admins**, complete with Google OAuth authentication, menu management, order tracking, and online payment integration.

- **Live Website:** [https://pizzahub-client-pi.vercel.app](https://pizzahub-client-pi.vercel.app)
- **Backend API:** [https://pizzahub-server-red.vercel.app](https://pizzahub-server-red.vercel.app)

---

## ✨ Key Features

- **Authentication & Account Linking:** Powered by **Better Auth** supporting both Email/Password sign-up and **Google OAuth**, synced with backend JWT authorization.
- **Role-Based Dashboards:**
  - **Customer:** Browse pizza menus, customize orders, complete online checkout, and track order statuses in real time.
  - **Vendor:** Manage restaurant profile, create/update/delete pizza menu items with image uploads, monitor kitchen activity analytics, and process incoming customer orders.
  - **Admin:** Oversee platform users, manage vendor approvals/blocks, and monitor overall system activity.
- **Image Hosting:** Seamless pizza and profile image uploads powered by **ImgBB API**.
- **Online Payments:** Dedicated payment checkout flow with success and cancellation handling.
- **Responsive UI:** Built with **Tailwind CSS** and modern UI components for smooth performance across desktop and mobile devices.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Authentication:** Better Auth (Email/Password & Google OAuth) + Custom JWT Sync
- **Database (Auth Session):** MongoDB Atlas
- **Image Upload:** ImgBB API
- **Deployment:** Vercel

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory of `pizzahub-client` and configure the following variables:

```env
```env
MONGODB_URI=your_mongodb_atlas_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

## 🚀 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/mminhaz72/pizzahub-client.git](https://github.com/mminhaz72/pizzahub-client.git)
   cd pizzahub-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.