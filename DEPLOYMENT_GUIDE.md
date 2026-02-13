# Deployment Guide - Desi Food Hub

This guide will help you deploy your full-stack food delivery application to production.

## 🏗️ Architecture Overview

- **Frontend (Client):** Next.js → Deploy to **Vercel**
- **Backend (Server):** Express.js → Deploy to **Render** or **Railway**
- **Database:** MongoDB → Use **MongoDB Atlas** (Cloud)
- **File Storage:** Firebase Storage (already configured)

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account (you already have this)
- ✅ Code pushed to GitHub (already done)
- ✅ Firebase project set up (already done)

You'll need to create accounts on:
1. **Vercel** - https://vercel.com (sign in with GitHub)
2. **MongoDB Atlas** - https://www.mongodb.com/cloud/atlas (free tier)
3. **Render** or **Railway** - for backend deployment

---

## Part 1: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new project (e.g., "Desi-Food-Hub")

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (choose closest to your users)
4. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `desifood_admin`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Atlas admin"
7. Click "Add User"

### Step 4: Whitelist IP Addresses
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://desifood_admin:<password>@cluster0.xxxxx.mongodb.net/`)
5. Replace `<password>` with your actual password
6. Add database name at the end: `mongodb+srv://desifood_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/desifoodhub`

---

## Part 2: Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

Create a `render.yaml` file in the root directory (I'll do this for you).

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `Nitinsingh7643/Desi-Food-Hub`
3. Configure:
   - **Name:** `desifoodhub-api`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build` (if you have a build script) or `npm install`
   - **Start Command:** `node src/server.js` or `npm start`
   - **Instance Type:** Free

### Step 4: Add Environment Variables on Render
Click "Advanced" → "Add Environment Variable" and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://desifood_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/desifoodhub
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
FIREBASE_PROJECT_ID=desifoodauth
FIREBASE_PRIVATE_KEY=your_firebase_private_key_from_service_account_json
FIREBASE_CLIENT_EMAIL=your_firebase_client_email_from_service_account_json
RAZORPAY_KEY_ID=your_razorpay_key_if_using
RAZORPAY_KEY_SECRET=your_razorpay_secret_if_using
CLIENT_URL=https://your-vercel-app.vercel.app
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your API will be available at: `https://desifoodhub-api.onrender.com`

---

## Part 3: Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import `Nitinsingh7643/Desi-Food-Hub`
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `client`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

### Step 3: Add Environment Variables
Click "Environment Variables" and add all your Firebase variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAxQUMwCWfrRsYmRPem0Q6VeH2Vxd6WyNU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=desifoodauth.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=desifoodauth
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=desifoodauth.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=730355069676
NEXT_PUBLIC_FIREBASE_APP_ID=1:730355069676:web:21b8890368dba4c563ebc9
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-5EVR978FVQ
NEXT_PUBLIC_API_URL=https://desifoodhub-api.onrender.com
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment (3-5 minutes)
3. Your app will be available at: `https://desi-food-hub.vercel.app` (or similar)

---

## Part 4: Post-Deployment Configuration

### 1. Update CORS in Backend
Make sure your server allows requests from your Vercel domain.

In `server/src/server.ts`, update CORS configuration:
```typescript
app.use(cors({
  origin: [
    'http://localhost:3005',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}));
```

### 2. Update API URL in Frontend
The `NEXT_PUBLIC_API_URL` environment variable should point to your Render backend.

### 3. Test Your Deployment
1. Visit your Vercel URL
2. Try signing up/logging in
3. Test creating orders
4. Verify Firebase authentication works
5. Check database connections

---

## 🔧 Troubleshooting

### Backend Issues
- **Check Render logs:** Dashboard → Your Service → Logs
- **Database connection:** Verify MongoDB URI is correct
- **Environment variables:** Double-check all are set

### Frontend Issues
- **Check Vercel logs:** Dashboard → Your Project → Deployments → View Function Logs
- **API calls failing:** Verify `NEXT_PUBLIC_API_URL` is correct
- **Firebase errors:** Check all Firebase env variables

### Common Errors
1. **CORS errors:** Update backend CORS configuration
2. **Database connection timeout:** Check MongoDB Atlas network access
3. **Environment variables not loading:** Redeploy after adding variables

---

## 📊 Monitoring & Maintenance

### Free Tier Limitations
- **Render Free:** App sleeps after 15 min of inactivity (cold starts)
- **Vercel Free:** 100GB bandwidth/month
- **MongoDB Atlas Free:** 512MB storage

### Recommended Upgrades
- **Render:** $7/month for always-on service
- **Vercel:** Pro plan if you exceed bandwidth
- **MongoDB Atlas:** Upgrade when you need more storage

---

## 🚀 Custom Domain (Optional)

### For Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Render (Backend)
1. Go to Service Settings → Custom Domain
2. Add your API subdomain (e.g., api.yourdomain.com)
3. Update DNS records

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Connection string obtained
- [ ] Backend deployed to Render
- [ ] All backend environment variables set
- [ ] Frontend deployed to Vercel
- [ ] All frontend environment variables set
- [ ] CORS configured correctly
- [ ] Test authentication
- [ ] Test database operations
- [ ] Test API endpoints
- [ ] Update GitHub security alert (dismiss as resolved)

---

## 📝 Next Steps After Deployment

1. **Set up monitoring:** Use Render/Vercel analytics
2. **Configure custom domain:** If you have one
3. **Set up CI/CD:** Auto-deploy on git push (Vercel does this automatically)
4. **Add error tracking:** Consider Sentry for production error monitoring
5. **Performance monitoring:** Use Vercel Analytics or Google Analytics

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/

Good luck with your deployment! 🚀
