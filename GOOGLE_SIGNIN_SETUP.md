# 🔐 Google Sign-In Setup Guide

Panduan lengkap untuk mengaktifkan Google Sign-In di ReogCommerce (Local & Production).

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Google Cloud Console Setup](#google-cloud-console-setup)
3. [Local Development Setup](#local-development-setup)
4. [Production Deployment (Vercel)](#production-deployment-vercel)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## 📋 Prerequisites

- ✅ Project Firebase yang sudah ada
- ✅ Akses ke Google Cloud Console
- ✅ Backend sudah running (local atau deployed)
- ✅ Vercel account (untuk production)

---

## 🔧 Google Cloud Console Setup

### Step 1: Buka Google Cloud Console

1. Go to: https://console.cloud.google.com/
2. Login dengan akun Google Anda
3. Pilih project Firebase Anda (atau buat baru)

### Step 2: Enable Google Sign-In

1. **Navigation Menu** → **APIs & Services** → **OAuth consent screen**
2. Pilih **External** (untuk testing) atau **Internal** (untuk organisasi)
3. Fill in:
   - **App name**: `ReogCommerce`
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **Save and Continue**
5. **Scopes**: Skip atau add `email`, `profile`
6. **Test users** (jika External): Add your test emails
7. Click **Save and Continue**

### Step 3: Create OAuth 2.0 Credentials

1. **Navigation Menu** → **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. **Application type**: Web application
4. **Name**: `ReogCommerce Web Client`

5. **Authorized JavaScript origins** - Add ALL these:
   ```
   http://localhost:5173
   http://localhost:3000
   http://localhost:5174
   https://your-app.vercel.app
   https://your-custom-domain.com
   ```

6. **Authorized redirect URIs** - Add (sama seperti origins):
   ```
   http://localhost:5173
   http://localhost:3000
   http://localhost:5174
   https://your-app.vercel.app
   https://your-custom-domain.com
   ```

7. Click **CREATE**

### Step 4: Copy Credentials

Setelah dibuat, Anda akan mendapat:
- **Client ID**: `123456789-abc123xyz.apps.googleusercontent.com`
- **Client Secret**: (tidak digunakan untuk frontend)

📝 **Copy Client ID** - Anda akan membutuhkan ini!

---

## 💻 Local Development Setup

### Step 1: Clone & Install

```bash
cd reog-commerce-2/frontend
npm install
```

### Step 2: Configure Environment

1. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
   ```
   ⚠️ Replace dengan Client ID yang Anda copy dari Google Console!

### Step 3: Start Backend

```bash
# Terminal 1 - Backend
cd reog-commerce-2/backend
npm run dev
# Backend running on http://localhost:5000
```

### Step 4: Start Frontend

```bash
# Terminal 2 - Frontend
cd reog-commerce-2/frontend
npm run dev
# Frontend running on http://localhost:5173
```

### Step 5: Test Local

1. Open browser: `http://localhost:5173/login`
2. Click **"Masuk dengan Google"** atau **"Daftar dengan Google"**
3. Google popup should appear
4. Select account → Grant permissions
5. Should redirect to Landing (existing user) or Onboarding (new user)

✅ **Local development ready!**

---

## 🚀 Production Deployment (Vercel)

### Step 1: Deploy Backend

**Option A: Vercel (Recommended)**
```bash
cd reog-commerce-2/backend
vercel
# Follow prompts
# Note: You'll need vercel.json configured for Express
```

**Option B: Railway / Render / Other**
- Deploy backend to your preferred platform
- Note the production URL: `https://api-reogcommerce.vercel.app`

### Step 2: Update Google Cloud Console

1. Go back to **Google Cloud Console** → **Credentials**
2. **Edit** your OAuth Client
3. **Add production URLs** to Authorized JavaScript origins:
   ```
   https://reog-commerce.vercel.app
   https://www.your-custom-domain.com
   ```
4. Click **Save**

### Step 3: Deploy Frontend to Vercel

#### Via Vercel Dashboard (Easiest)

1. **Go to**: https://vercel.com/dashboard
2. **Click**: New Project
3. **Import** your Git repository
4. **Configure**:
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables** - Add these:

   | Name | Value | Example |
   |------|-------|---------|
   | `VITE_API_URL` | Your backend URL | `https://api-reogcommerce.vercel.app/api` |
   | `VITE_GOOGLE_CLIENT_ID` | Your Google Client ID | `123456789-abc...apps.googleusercontent.com` |

   ⚠️ **Important**: 
   - Pastikan `VITE_API_URL` mengarah ke backend production
   - Bisa menggunakan **same Client ID** untuk local dan production
   - Atau buat **Client ID baru** khusus production (recommended)

6. **Click**: Deploy

#### Via Vercel CLI

```bash
cd reog-commerce-2/frontend

# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add VITE_API_URL
# Enter: https://your-backend.vercel.app/api

vercel env add VITE_GOOGLE_CLIENT_ID  
# Enter: your_google_client_id

# Deploy to production
vercel --prod
```

### Step 4: Update Allowed Origins

Setelah deploy, Vercel akan memberikan URL seperti:
- `https://reog-commerce-abc123.vercel.app`

**Go back to Google Cloud Console**:
1. Edit OAuth Client
2. Add Vercel URL to Authorized JavaScript origins
3. Save

### Step 5: Test Production

1. Open your production URL
2. Go to `/login`
3. Click "Masuk dengan Google"
4. Should work sama seperti local!

✅ **Production ready!**

---

## 🧪 Testing

### Test Checklist

- [ ] **Local Development**
  - [ ] Backend running on http://localhost:5000
  - [ ] Frontend running on http://localhost:5173
  - [ ] Google Sign-In button visible
  - [ ] Click button → Google popup appears
  - [ ] New user → Redirect to onboarding
  - [ ] Existing user → Redirect to landing
  - [ ] User data saved in localStorage
  - [ ] Token working for API calls

- [ ] **Production (Vercel)**
  - [ ] Frontend deployed successfully
  - [ ] Backend URL configured correctly
  - [ ] Google Sign-In button visible
  - [ ] Click button → Google popup appears
  - [ ] New user flow working
  - [ ] Existing user flow working
  - [ ] CORS configured on backend
  - [ ] HTTPS working (should be automatic on Vercel)

### Manual Test Flow

**Test 1: New User (Sign Up with Google)**
```
1. Clear localStorage
2. Go to /login → Click "Daftar dengan Google"
3. Select Google account
4. Should redirect to /onboarding
5. Fill form (origin, category, etc)
6. Submit
7. Should redirect to / (landing)
8. Should be logged in
```

**Test 2: Existing User (Login with Google)**
```
1. Logout if logged in
2. Go to /login → Click "Masuk dengan Google"
3. Select same Google account
4. Should redirect directly to / (landing)
5. Should be logged in
6. Profile page should show Google data
```

**Test 3: Token Persistence**
```
1. Login with Google
2. Refresh page
3. Should still be logged in
4. Navigate to protected routes
5. Should have access
```

---

---

## 🔍 Troubleshooting

### ❌ Error: "redirect_uri_mismatch"

**Problem:** URL tidak match dengan yang didaftarkan di Google Console

**Solution:**
1. Copy exact URL dari error message
2. Go to Google Cloud Console → Credentials
3. Edit OAuth Client ID
4. Add exact URL ke **Authorized JavaScript origins**
5. Save dan tunggu 5-10 menit untuk propagasi
6. Clear browser cache
7. Try again

**Common mistakes:**
- ❌ `http://localhost:5173/` (dengan trailing slash)
- ✅ `http://localhost:5173` (tanpa trailing slash)
- ❌ Different port (5174 vs 5173)
- ✅ Add all possible ports

---

### ❌ Error: "Google Sign-In script belum dimuat"

**Problem:** Script Google Identity Services belum fully loaded

**Solution:**
1. Check internet connection
2. Open DevTools → Network tab
3. Look for `https://accounts.google.com/gsi/client`
4. If blocked → Check firewall/ad blocker
5. Refresh page dan tunggu beberapa detik
6. Try again

**If still not working:**
```javascript
// Check in browser console
console.log(window.google); 
// Should show object, not undefined
```

---

### ❌ Error: "Google Client ID belum dikonfigurasi"

**Problem:** `.env` file tidak ada atau Client ID salah

**Solution:**

**For Local:**
```bash
cd frontend
# Check if .env exists
ls -la | grep .env

# If not exists
cp .env.example .env

# Edit .env
nano .env
# or
code .env

# Add your Client ID
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here

# Restart dev server
npm run dev
```

**For Vercel:**
1. Go to Vercel Dashboard
2. Select project
3. Settings → Environment Variables
4. Check `VITE_GOOGLE_CLIENT_ID` exists and correct
5. If wrong → Update → Redeploy

---

### ❌ Error: "CORS policy blocked"

**Problem:** Backend tidak allow request dari frontend domain

**Solution - Backend:**

```javascript
// backend/src/index.js or app.js
import cors from 'cors';

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-app.vercel.app', // Add your Vercel URL
    'https://www.your-domain.com'  // Add custom domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

**Quick fix for testing:**
```javascript
// Allow all origins (ONLY for development!)
app.use(cors({ origin: '*' }));
```

---

### ❌ Error: "Invalid credentials" atau "User not found"

**Problem:** Backend atau Firestore issue

**Solution:**
1. Check backend logs
2. Verify Firestore rules allow read/write
3. Check `/api/auth/google-signin` endpoint exists
4. Test backend directly with Postman:
   ```json
   POST http://localhost:5000/api/auth/google-signin
   {
     "uid": "test123",
     "email": "test@gmail.com",
     "displayName": "Test User",
     "photoURL": "https://...",
     "idToken": "eyJhbGc..."
   }
   ```

---

### ❌ New user tidak redirect ke onboarding

**Problem:** Backend tidak return `isNewUser: true`

**Solution:**
1. Check backend response:
   ```javascript
   // Should return
   {
     "success": true,
     "data": {
       "user": {...},
       "token": "...",
       "isNewUser": true  // ← This!
     }
   }
   ```

2. Clear Firestore users collection (if testing)
3. Try with different Google account

---

### ❌ Vercel deployment failed

**Problem:** Build error atau environment variables

**Solution:**

**Build Error:**
```bash
# Check build locally first
cd frontend
npm run build

# If error, fix it
# Common issues:
# - TypeScript errors
# - Missing dependencies
# - Import errors
```

**Environment Variables:**
1. Vercel Dashboard → Project → Settings
2. Environment Variables
3. Make sure all `VITE_*` variables exist
4. Redeploy: Deployments → Latest → Redeploy

---

### ❌ Google Sign-In works locally but not in production

**Problem:** Production URL not added to Google Console

**Checklist:**
- [ ] Production URL added to Google Console Authorized origins
- [ ] Wait 5-10 minutes after adding URL
- [ ] Clear browser cache
- [ ] Check HTTPS (must be HTTPS in production)
- [ ] Check VITE_API_URL points to production backend
- [ ] Check CORS on production backend
- [ ] Check backend is actually deployed and running

**Debug:**
```javascript
// Add in Login.tsx temporarily
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
// Open browser console and check values
```

---

## 📱 Production Checklist

Before going live, verify:

### Backend
- [ ] Deployed and accessible
- [ ] CORS configured for production domain
- [ ] Environment variables set correctly
- [ ] Firebase credentials working
- [ ] Health check endpoint working: `/health` or `/api/health`
- [ ] HTTPS enabled

### Frontend (Vercel)
- [ ] Deployed successfully
- [ ] All environment variables set:
  - [ ] `VITE_API_URL`
  - [ ] `VITE_GOOGLE_CLIENT_ID`
- [ ] Production URL added to Google Console
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Custom domain configured (if any)

### Google Cloud Console
- [ ] OAuth Client created
- [ ] All production URLs added to Authorized origins
- [ ] OAuth consent screen configured
- [ ] Test users added (if still in testing)
- [ ] App published (if ready for public)

### Testing
- [ ] Test new user signup flow
- [ ] Test existing user login flow
- [ ] Test logout and re-login
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Test with different Google accounts

---

## 🎯 Quick Setup Summary

### For Local Development:
```bash
# 1. Setup Google Console
#    - Create OAuth Client
#    - Add http://localhost:5173 to origins
#    - Copy Client ID

# 2. Frontend setup
cd frontend
cp .env.example .env
# Edit .env, add Client ID
npm install
npm run dev

# 3. Backend setup
cd backend
npm run dev

# 4. Test
# Open http://localhost:5173/login
# Click "Masuk dengan Google"
```

### For Vercel Production:
```bash
# 1. Deploy backend (Vercel/Railway/etc)
#    Note the URL: https://api-xxx.vercel.app

# 2. Update Google Console
#    Add production URL to origins

# 3. Deploy frontend to Vercel
#    Add environment variables:
#    - VITE_API_URL=https://api-xxx.vercel.app/api
#    - VITE_GOOGLE_CLIENT_ID=your_client_id

# 4. Test
#    Open https://your-app.vercel.app/login
#    Click "Masuk dengan Google"
```

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use HTTPS in production
- ✅ Verify ID token in backend (already implemented)
- ✅ Store tokens securely in localStorage
- ✅ Use environment variables for sensitive data
- ✅ Add only necessary origins to Google Console
- ✅ Log authentication events
- ✅ Implement token refresh (optional but recommended)
- ✅ Use different Client IDs for local and production

### ❌ DON'T:
- ❌ Commit `.env` file to Git
- ❌ Use HTTP in production
- ❌ Skip backend token verification
- ❌ Allow all origins in CORS (`*`)
- ❌ Store sensitive data in localStorage (only tokens)
- ❌ Share Client ID publicly in documentation
- ❌ Use same credentials for all environments

---

## 📞 Support & Resources

### Official Documentation:
- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Vercel Deployment](https://vercel.com/docs)

### Common Issues:
- [Stack Overflow - Google Sign-In](https://stackoverflow.com/questions/tagged/google-signin)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Project Files:
- `.env.example` - Environment template
- `src/lib/auth.service.ts` - Auth logic
- `src/pages/Login.tsx` - Login UI
- `backend/src/services/auth.service.js` - Backend auth

---

**Last Updated:** November 14, 2025  
**Version:** 2.0  
**Status:** ✅ Production Ready (Local & Vercel)
