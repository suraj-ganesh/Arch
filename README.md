# ARCH — Next-Gen Footwear E-Commerce Platform

**ARCH** is a modern, premium footwear e-commerce application built with Next.js 16 (App Router with Turbopack), Supabase (Auth & PostgreSQL database), and eSewa ePay v2 payment integration.

---

## 🌟 Features

### 🛍️ Customer Experience
- **Catalog & Filtering**: Browse shoe collections by category (*Men*, *Women*, *Kids*), brand, or search query.
- **Product Details**: Size selection, real-time stock status (e.g., *Low Stock* warnings), detailed descriptions, and image galleries.
- **Shopping Bag**: Local state management via Zustand with persistent cart storage across pages.
- **Role-Based Access**:
  - Unauthenticated guests and admin accounts are restricted from purchasing/adding items to the bag to maintain catalog integrity.
  - Authenticated regular customers can complete checkout and place orders.
- **Customer Dashboard**: Track order delivery timelines (*Placed*, *Paid via eSewa*, *Shipped*, *Delivered*) and view full order histories under **My Orders**.

### 💳 Payment Integration (eSewa ePay v2)
- Seamless sandbox payment flow using HMAC-SHA256 signature generation.
- **Pre-payment Order Initiation**: Creates a `pending` / `unpaid` record in Supabase before redirecting to eSewa.
- **Server-Side Verification**: Decodes Base64 eSewa response payloads and automatically updates the order status to `paid`.

### 🛡️ Admin Dashboard (`/admin`)
- **Root Admin Profile**: View active admin details, system status, and a global **Log Out Admin** action (server-side cookie invalidation).
- **Inventory Management**: Add, update, or remove shoe models from the catalog.
- **Image Picker**: Native local device file selection with instant image preview for uploading new footwear products.
- **Order Management**: View all customer orders, filter by status, and update fulfillment states (*Pending*, *Shipped*, *Delivered*, *Cancelled*).

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16.3.3 (App Router, Turbopack)
- **Styling**: Tailwind CSS (Chalk, Stone, and Warm Earth tone palette `#f4f3ee`, `#463f3a`, `#839788`)
- **Icons**: Lucide React
- **State Management**: Zustand
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security policies & `@supabase/ssr` cookies)
- **Payment Gateway**: eSewa ePay v2 API

---

## 📁 Repository Structure

```
Arch/
├── app/
│   ├── account/          # Customer profile & My Orders pages
│   ├── admin/            # Admin inventory portal, product creation & order manager
│   ├── api/
│   │   ├── auth/logout/  # Server-side logout endpoint (cookie flush)
│   │   ├── esewa/        # eSewa initiation & signature verification routes
│   │   └── products/     # Product catalog REST endpoints
│   ├── cart/             # Shopping bag overview
│   ├── checkout/         # Shipping details form & eSewa redirect trigger
│   ├── login/            # Authentication login page
│   ├── products/         # Catalog & dynamic product detail routes ([id])
│   ├── signup/           # Customer registration page
│   ├── globals.css       # Design tokens & base styles
│   ├── layout.tsx        # Root layout with ToastProvider, Navbar & Footer
│   └── page.tsx          # Homepage with featured banners & product grid
├── components/
│   ├── ArchLogo.tsx      # Custom SVG brand mark
│   ├── Footer.tsx        # Site footer
│   ├── Navbar.tsx        # Navigation header with brand & search bar
│   ├── ProductCard.tsx   # Shoe item card with role-restricted buy logic
│   ├── ProductGrid.tsx   # Grid container for products
│   └── ToastProvider.tsx # Global notification context
├── lib/
│   ├── esewa.ts          # HMAC-SHA256 signature generator & payload decoder
│   ├── mockData.ts       # Mock footwear dataset for fallback
│   ├── store/            # Zustand cart store definition
│   ├── supabase/         # SSR & Browser Supabase clients
│   └── types.ts          # TypeScript interfaces (Product, Order, Profile, etc.)
├── public/               # Static assets & brand vectors
├── supabase/
│   └── schema.sql        # PostgreSQL tables, relations, and RLS policies
├── next.config.ts        # Next.js configuration
├── proxy.ts              # Next.js 16 proxy configuration
└── package.json          # Dependencies & npm scripts
```

---

## 🗄️ Database Schema (Supabase)

### `public.profiles`
- `id` (uuid, PK, references `auth.users`)
- `full_name` (text)
- `role` (text: `'customer'` | `'admin'`)
- `created_at` (timestamp)

### `public.products`
- `id` (uuid, PK)
- `name` (text)
- `description` (text)
- `brand` (text)
- `category` (text: `'men'` | `'women'` | `'kids'`)
- `price` (numeric)
- `sizes` (int[])
- `stock` (int)
- `image_urls` (text[])
- `created_at` (timestamp)

### `public.orders`
- `id` (uuid, PK)
- `user_id` (uuid, references `public.profiles`)
- `customer_name` (text)
- `customer_phone` (text)
- `shipping_address` (text)
- `total_amount` (numeric)
- `status` (text: `'pending'` | `'shipped'` | `'delivered'` | `'cancelled'`)
- `payment_status` (text: `'unpaid'` | `'paid'` | `'failed'`)
- `esewa_ref_id` (text)
- `created_at` (timestamp)

### `public.order_items`
- `id` (uuid, PK)
- `order_id` (uuid, references `public.orders`)
- `product_id` (uuid, references `public.products`)
- `size` (int)
- `quantity` (int)
- `price` (numeric)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

NEXT_PUBLIC_ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
NEXT_PUBLIC_ESEWA_INITIATE_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form
```

### 3. Installation & Local Development
```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🔑 Admin Credentials (Sandbox / Test Mode)

- **Admin Email**: `admin@arch.com`
- **Admin Password**: `Admin@Arch2024!`

---

## 🐙 Repository

- **GitHub Remote**: [https://github.com/suraj-ganesh/Arch.git](https://github.com/suraj-ganesh/Arch.git)
