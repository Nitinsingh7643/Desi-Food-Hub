# Desi Food Hub - Project Architecture Strategy

## 1. Project Overview
**Desi Food Hub** is a scalable, SEO-optimized food delivery platform built with the MERN stack and Next.js.
- **Client**: Next.js 14+ (App Router) for hybrid rendering (SSR/SSG/CSR).
- **Server**: Node.js/Express.js for robust REST APIs.
- **Database**: MongoDB for flexible schema design.

---

## 2. Rendering Strategy
To ensure optimal SEO and User Experience (UX), we utilize Next.js's hybrid rendering capabilities.

| Page / Feature | Strategy | Reason |
| :--- | :--- | :--- |
| **Homepage** | **SSG** (Static Site Generation) | High traffic, content changes infrequently. Revalidate every 60m (ISR). |
| **City/Zone Listings** | **SSG** + **ISR** | Landing pages for SEO (e.g., "Food delivery in Mumbai"). Revalidate via ISR. |
| **Restaurant Details** | **SSR** (Server-Side Rendering) | Menu items, stock status, and pricing must be real-time. Critical for SEO. |
| **Search Results** | **SSR** | Based on dynamic user queries and location data. |
| **User Dashboard** | **CSR** (Client-Side Rendering) | Private, interactive data (Orders, Profile). No SEO need. |
| **Checkout/Cart** | **CSR** | Highly dynamic, user-specific state. |
| **Admin Panel** | **CSR** | Secure, internal dashboard. |

---

## 3. SEO Strategy
- **Dynamic Metadata**: Use `generateMetadata` in Next.js for unique titles/descriptions per restaurant/city.
- **Structured Data (JSON-LD)**: Inject schema markup for *Restaurants*, *Menus*, and *Breadcrumbs*.
- **Sitemaps**: Dynamic sitemap generation for all restaurant and city routes.
- **Open Graph**: Dynamic OG image generation (using `next/og`) showing restaurant rating/cuisine.

---

## 4. Folder Structure Plan

### A. Root Directory
```text
/Desi_Food_Hub
├── /client                 # Next.js Frontend
├── /server                 # Express Backend
├── /docs                   # Documentation & API Specs
├── ARCHITECTURE.md         # This file
└── README.md
```

### B. Client Structure (`/client`) - Next.js App Router
```text
/client
├── /app
│   ├── (public)            # Public facing pages (SEO Critical)
│   │   ├── layout.tsx      # Main layout (Navbar/Footer)
│   │   ├── page.tsx        # Homepage (SSG)
│   │   ├── search/         # Search results (SSR)
│   │   └── city/
│   │       └── [slug]/     # Dynamic City Pages (SSG)
│   ├── (shop)              # Restaurant & Menu flow
│   │   └── restaurant/
│   │       └── [id]/       # Restaurant Platform with Menu (SSR)
│   ├── (protected)         # User Dashboard (CSR)
│   │   ├── checkout/
│   │   ├── orders/
│   │   └── profile/
│   └── (admin)             # Admin Panel (Separate Layout)
│       ├── layout.tsx      # Admin Sidebar
│       └── dashboard/  
├── /components
│   ├── /ui                 # Reusable atoms (Buttons, Inputs - shadcn/ui style)
│   ├── /common             # Navbar, Footer, SeoHead
│   ├── /features           # Complex modules
│   │   ├── /cart           # CartDrawer, AddToCartButton
│   │   ├── /map            # MapView, LocationPicker
│   │   └── /restaurant     # RestaurantCard, MenuList
├── /lib
│   ├── /api                # Axios instances & Service functions
│   ├── /hooks              # Custom React Hooks (useCart, useLocation)
│   ├── /store              # State Management (Zustand/Redux)
│   └── /utils              # Helper functions (currency formatter)
├── /public                 # Static assets
└── next.config.mjs
```

### C. Server Structure (`/server`) - Express + MongoDB
```text
/server
├── /src
│   ├── /config             # DB, Stripe, Firebase, Logger configs
│   ├── /controllers        # Request Handlers (Auth, Order, Restaurant)
│   ├── /middlewares        # Auth, ErrorHandling, Validation
│   ├── /models             # Mongoose Schemas (User, Order, Restro)
│   ├── /routes             # API Route Definitions
│   ├── /services           # Business Logic (EmailService, PaymentService)
│   ├── /utils              # Error classes, Validators
│   ├── app.js              # App setup
│   └── server.js           # Entry point
└── package.json

