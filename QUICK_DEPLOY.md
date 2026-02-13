# Quick Deployment Steps

Follow these steps to deploy your Desi Food Hub application:

## 🚀 Quick Start (15 minutes)

### 1. Database Setup (5 min)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create database user
4. Get connection string
5. Whitelist all IPs (0.0.0.0/0)

### 2. Backend Deployment (5 min)
1. Create account at [Render](https://render.com) with GitHub
2. Click "New +" → "Web Service"
3. Select your repository: `Nitinsingh7643/Desi-Food-Hub`
4. Settings:
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables (see DEPLOYMENT_GUIDE.md)
6. Deploy!

### 3. Frontend Deployment (5 min)
1. Create account at [Vercel](https://vercel.com) with GitHub
2. Click "Add New Project"
3. Import `Nitinsingh7643/Desi-Food-Hub`
4. Settings:
   - Root Directory: `client`
   - Framework: Next.js (auto-detected)
5. Add environment variables (all NEXT_PUBLIC_FIREBASE_* variables)
6. Deploy!

## 📋 Environment Variables Needed

### Backend (Render)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-vercel-app.vercel.app
```

### Frontend (Vercel)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAxQUMwCWfrRsYmRPem0Q6VeH2Vxd6WyNU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=desifoodauth.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=desifoodauth
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=desifoodauth.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=730355069676
NEXT_PUBLIC_FIREBASE_APP_ID=1:730355069676:web:21b8890368dba4c563ebc9
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-5EVR978FVQ
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
```

## ✅ After Deployment

1. Update CORS in backend to allow your Vercel domain
2. Test the application
3. Monitor logs for any errors

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
