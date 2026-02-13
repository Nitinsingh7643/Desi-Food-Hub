# 🍛 Desi Food Hub

> A modern, full-stack food delivery platform built with the MERN stack and Next.js, featuring real-time order tracking, AI-powered chatbot, and seamless payment integration.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-vercel-app.vercel.app)
[![Backend API](https://img.shields.io/badge/API-live-blue)](https://desifoodhub-api.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📸 Screenshots

### Homepage
![Homepage](./screenshots/homepage.png)
*Modern, responsive landing page with featured restaurants and offers*

### Restaurant Menu
![Menu](./screenshots/menu.png)
*Interactive menu with real-time cart updates*

### Order Tracking
![Order Tracking](./screenshots/order-tracking.png)
*Live order status with real-time updates*

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)
*Comprehensive admin panel for managing orders, products, and users*

### AI Chatbot
![Chatbot](./screenshots/chatbot.png)
*Intelligent chatbot powered by Google Gemini AI*

---

## ✨ Features

### 🎯 Core Features
- **🔐 Authentication**: Firebase-based phone/email authentication with OTP
- **🍕 Product Catalog**: Browse restaurants and menu items with filters
- **🛒 Shopping Cart**: Real-time cart management with local storage
- **💳 Payments**: Integrated Razorpay payment gateway
- **📦 Order Management**: Complete order lifecycle from placement to delivery
- **🎫 Coupons**: Dynamic coupon system with validation
- **⭐ Reviews**: User reviews and ratings for restaurants

### 🚀 Advanced Features
- **🤖 AI Chatbot**: Google Gemini-powered assistant for customer support
- **📍 Live Tracking**: Real-time order status updates
- **👨‍💼 Admin Panel**: Comprehensive dashboard for business management
- **🌙 Dark Mode**: Toggle between light and dark themes
- **📱 Responsive Design**: Mobile-first, works on all devices
- **⚡ Performance**: Optimized with Next.js SSR/SSG for fast load times

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌─────────────┐      ┌──────────────┐      ┌────────┐ │
│  │   Client    │─────▶│   Backend    │─────▶│MongoDB │ │
│  │  (Next.js)  │      │  (Express)   │      │ Atlas  │ │
│  └─────────────┘      └──────────────┘      └────────┘ │
│         │                     │                         │
│         │                     │                         │
│         ▼                     ▼                         │
│  ┌─────────────┐      ┌──────────────┐                 │
│  │  Firebase   │      │   Razorpay   │                 │
│  │    Auth     │      │   Payments   │                 │
│  └─────────────┘      └──────────────┘                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack

**Frontend:**
- ⚛️ Next.js 14+ (App Router)
- 🎨 Tailwind CSS
- 🔥 Firebase Authentication
- 📊 Context API for state management
- 🎭 Framer Motion for animations

**Backend:**
- 🟢 Node.js & Express.js
- 🍃 MongoDB with Mongoose
- 🔐 JWT Authentication
- 💳 Razorpay Integration
- 🤖 Google Gemini AI

**DevOps:**
- 🚀 Vercel (Frontend)
- 🔧 Render (Backend)
- 🗄️ MongoDB Atlas (Database)
- 🔄 GitHub Actions (CI/CD)

---

## 📁 Project Structure

```
Desi-Food-Hub/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   │   ├── (public)/  # Public pages (home, menu, etc.)
│   │   │   ├── (admin)/   # Admin dashboard
│   │   │   └── api/       # API routes
│   │   ├── components/    # Reusable components
│   │   │   ├── common/    # Navbar, Footer, etc.
│   │   │   └── ui/        # UI components (Button, Card, etc.)
│   │   ├── context/       # React Context providers
│   │   └── lib/           # Utilities and configs
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Express.js Backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Auth, error handling
│   │   ├── services/      # Business logic
│   │   └── server.ts      # Entry point
│   └── package.json
│
├── screenshots/           # App screenshots
├── ARCHITECTURE.md        # Detailed architecture docs
├── DEPLOYMENT_GUIDE.md    # Deployment instructions
├── SECURITY_FIX.md        # Security documentation
└── README.md             # You are here!
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** ([Atlas Free Tier](https://www.mongodb.com/cloud/atlas))
- **Firebase Account** ([Console](https://console.firebase.google.com/))
- **Razorpay Account** (Optional, for payments)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Nitinsingh7643/Desi-Food-Hub.git
cd Desi-Food-Hub
```

#### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file in `server/` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

#### 3. Setup Frontend

```bash
cd client
npm install
```

Create `.env.local` file in `client/` directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on `http://localhost:3005`

---

## 🔄 User Workflow

### Customer Journey

```
┌──────────────┐
│   Landing    │
│     Page     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Sign Up/   │
│   Sign In    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Browse     │
│ Restaurants  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Select      │
│  Products    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Add to Cart │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Checkout   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Payment    │
│  (Razorpay)  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Order Placed │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Track Order  │
│  (Real-time) │
└──────────────┘
```

### Admin Workflow

```
┌──────────────┐
│ Admin Login  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Dashboard   │
│  Overview    │
└──────┬───────┘
       │
       ├─────────────┬─────────────┬─────────────┐
       ▼             ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  Manage  │  │  Manage  │  │  Manage  │  │  Manage  │
│  Orders  │  │ Products │  │  Users   │  │ Coupons  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

---

## 🎨 Key Pages

### Public Pages
- **`/`** - Homepage with featured restaurants
- **`/menu`** - Browse all restaurants and menus
- **`/cart`** - Shopping cart
- **`/checkout`** - Order checkout
- **`/orders`** - Order history and tracking
- **`/signin`** - User authentication
- **`/signup`** - User registration

### Admin Pages
- **`/admin`** - Admin dashboard
- **`/admin/orders`** - Order management
- **`/admin/products`** - Product management
- **`/admin/users`** - User management
- **`/admin/coupons`** - Coupon management

---

## 🔐 Security Features

- ✅ Firebase Authentication with OTP verification
- ✅ JWT-based API authentication
- ✅ Environment variables for sensitive data
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Secure payment processing with Razorpay
- ✅ Password hashing with bcrypt
- ✅ Protected admin routes

**See [SECURITY_FIX.md](./SECURITY_FIX.md) for security documentation**

---

## 📦 Deployment

### Quick Deploy

The application is deployed using:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

**See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions**

### Live URLs

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://desifoodhub-api.onrender.com
- **API Docs**: https://desifoodhub-api.onrender.com/api-docs

---

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

---

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify OTP

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (Admin)

### Coupons
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons/validate` - Validate coupon
- `POST /api/coupons` - Create coupon (Admin)

**Full API documentation**: [API_DOCS.md](./API_DOCS.md)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Nitin Singh**
- GitHub: [@Nitinsingh7643](https://github.com/Nitinsingh7643)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- Firebase for authentication
- Razorpay for payment integration
- Google for Gemini AI
- All contributors and supporters

---

## 📞 Support

For support, email your-email@example.com or open an issue in this repository.

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Nitin Singh

</div>
