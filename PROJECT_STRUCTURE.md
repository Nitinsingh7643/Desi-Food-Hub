# Desi Food Hub - Project Structure Map

This document outlines the file structure of the **Desi Food Hub** application to help you locate components, pages, and backend logic.

## 📂 Project Root
`c:\Users\HP\OneDrive\Desktop\Desi_Food_Hub\`

### 🖥️ Client (Frontend - Next.js)
Path: `/client`

```
client/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   │   ├── (admin)/        # Admin Dashboard Pages
│   │   │   └── dashboard/  # Admin Route: localhost:3000/dashboard
│   │   ├── (protected)/    # User Protected Routes
│   │   │   ├── profile/    # User Profile Page
│   │   │   ├── orders/     # User Orders Page
│   │   │   └── checkout/   # Checkout Page
│   │   ├── (public)/       # Public Routes (Auth)
│   │   │   ├── login/      # Login Page
│   │   │   └── signup/     # Signup Page
│   │   ├── layout.tsx      # Main Root Layout (Wraps all pages)
│   │   ├── page.tsx        # Homepage (/)
│   │   └── globals.css     # Global Styles (Tailwind imports)
│   │
│   ├── components/         # Reusable UI Components
│   │   ├── common/         # Global Components
│   │   │   ├── Navbar.tsx  # Top Navigation Bar
│   │   │   └── Footer.tsx  # Footer Section
│   │   ├── features/       # Feature-Specific Components
│   │   │   └── ChatBot.tsx # AI Chatbot Component
│   │   ├── home/           # Homepage Sections
│   │   │   ├── Hero.tsx    # Main Hero Banner
│   │   │   └── Menu.tsx    # Menu Grid Display
│   │   └── ui/             # Generic UI Elements (Buttons, Inputs)
│   │
│   ├── context/            # React Context API
│   │   ├── AuthContext.tsx # User Authentication State
│   │   ├── CartContext.tsx # Shopping Cart State
│   │   └── ThemeContext.tsx# Dark/Light Mode State
│   │
│   └── lib/                # Utility Functions & API Clients
│       ├── api/            # Backend API Calls (auth.ts, orders.ts)
│       └── utils.ts        # Helper functions (class merging, etc.)
```

### ⚙️ Server (Backend - Node.js/Express)
Path: `/server`

```
server/
├── src/
│   ├── config/             # Configuration Files
│   │   └── db.ts           # MongoDB Connection Setup
│   │
│   ├── controllers/        # Request Handlers (Logic Layer)
│   │   ├── authController.ts # Login/Signup Logic
│   │   ├── orderController.ts# Order Placement & Tracking
│   │   ├── productController.ts # Menu Management
│   │   └── aiController.ts   # Gemini AI Chatbot Logic
│   │
│   ├── middlewares/        # Express Middleware
│   │   └── authMiddleware.ts # JWT Verification & Admin Checks
│   │
│   ├── models/             # Mongoose Database Schemas
│   │   ├── User.ts         # User Schema
│   │   ├── Order.ts        # Order Schema
│   │   └── Product.ts      # Menu Item Schema
│   │
│   ├── routes/             # API Route Definitions
│   │   ├── authRoutes.ts   # (POST /api/auth/login)
│   │   ├── orderRoutes.ts  # (POST /api/orders)
│   │   ├── productRoutes.ts# (GET /api/products)
│   │   └── aiRoutes.ts     # (POST /api/ai/chat)
│   │
│   └── server.ts           # Main Entry Point (Express App Setup)
│
├── .env                    # Environment Variables (API Keys, DB URI)
├── seed.ts                 # Database Seeder Script (Add Initial Data)
└── package.json            # Backend Dependencies
```

## 🔑 Key Component Locations

| Component | File Path |
|-----------|-----------|
| **Navbar** | `client/src/components/common/Navbar.tsx` |
| **Footer** | `client/src/components/common/Footer.tsx` |
| **Hero Section** | `client/src/components/home/Hero.tsx` |
| **Chatbot** | `client/src/components/features/ChatBot.tsx` |
| **Login Page** | `client/src/app/(public)/login/page.tsx` |
| **Dashboard** | `client/src/app/(admin)/dashboard/page.tsx` |
| **API Backend**| `server/src/server.ts` |
