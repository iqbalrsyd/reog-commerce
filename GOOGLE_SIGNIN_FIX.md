# 🔧 Fix Google Sign-In Error 403

## Problem

Error yang muncul di console:
```
GET https://accounts.google.com/gsi/status?client_id=... 403 (Forbidden)
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

## Solution

### Step 1: Tambahkan Origin ke Google Cloud Console

1. **Buka Google Cloud Console**
   - Go to: https://console.cloud.google.com/apis/credentials

2. **Pilih OAuth 2.0 Client ID yang sudah dibuat**
   - Klik pada Client ID yang Anda gunakan

3. **Tambahkan Authorized JavaScript origins**
   
   **Untuk Local Development:**
   ```
   http://localhost:5173
   http://localhost:3000
   http://127.0.0.1:5173
   ```

   **Untuk Production (Vercel):**
   ```
   https://your-app-name.vercel.app
   https://www.your-domain.com (jika pakai custom domain)
   ```

4. **Tambahkan Authorized redirect URIs** (optional, tapi recommended)
   ```
   http://localhost:5173
   http://localhost:5173/login
   https://your-app-name.vercel.app
   https://your-app-name.vercel.app/login
   ```

5. **Save Changes**
   - Klik "SAVE"
   - Tunggu 5-10 menit untuk propagasi

### Step 2: Verifikasi .env Configuration

Pastikan file `.env` di frontend sudah benar:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**PENTING**: 
- Jangan gunakan placeholder `YOUR_GOOGLE_CLIENT_ID`
- Gunakan Client ID yang benar dari Google Console
- Restart development server setelah mengubah .env

### Step 3: Test Google Sign-In

1. **Clear Browser Cache**
   - Buka Developer Tools (F12)
   - Application → Clear Storage → Clear site data

2. **Restart Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Login**
   - Buka http://localhost:5173/login
   - Klik "Masuk/Daftar dengan Google"
   - Error 403 seharusnya sudah hilang

---

## New User Flow (Google Sign-In)

### Current Implementation

Sekarang flow untuk user baru sudah diperbaiki:

**1. User Baru (Belum Pernah Login)**
```
Google Sign-In Button
  ↓
Backend Check: isNewUser = true
  ↓
Redirect ke /onboarding
  ↓
User isi data (TANPA password):
  - Nama (pre-filled dari Google)
  - Asal Daerah
  - Kategori (Mahasiswa/Umum/Seniman)
  ↓
Complete Registration
  ↓
Redirect ke Landing Page
```

**2. User Existing (Sudah Pernah Login)**
```
Google Sign-In Button
  ↓
Backend Check: isNewUser = false
  ↓
Redirect langsung ke Landing Page
```

### Code Changes Made

**Login.tsx** sudah diperbaiki:
```typescript
const handleGoogleAuth = async () => {
  const result = await authService.googleSignIn();
  
  if (result.isNewUser) {
    // New user - ke onboarding dengan Google data
    navigate('/onboarding', { 
      state: { 
        email: result.user.email, 
        name: result.user.name,
        photoURL: result.user.photoURL,
        isGoogleAuth: true  // Flag penting!
      } 
    });
  } else {
    // Existing user - langsung ke landing
    navigate('/', { replace: true });
  }
};
```

**Onboarding.tsx** perlu diperbaiki untuk handle Google Auth (lihat bawah).

---

## Troubleshooting

### Error: "Google Sign-In script belum dimuat"

**Penyebab**: Script Google belum load

**Solusi**:
1. Tunggu 2-3 detik setelah page load
2. Refresh page
3. Check internet connection

### Error: "Google Client ID belum dikonfigurasi"

**Penyebab**: Environment variable tidak terdeteksi

**Solusi**:
1. Check file `.env` ada di folder `frontend/`
2. Pastikan ada `VITE_GOOGLE_CLIENT_ID=...`
3. Restart dev server: `npm run dev`

### Error: 403 Forbidden masih muncul

**Penyebab**: Origin belum di-authorize

**Solusi**:
1. Double check Google Console → Credentials
2. Pastikan origin sudah ditambahkan EXACT (case-sensitive)
3. Tunggu 5-10 menit untuk propagasi
4. Clear browser cache
5. Try incognito/private mode

### Google Sign-In button tidak muncul

**Penyebab**: Script tidak dimuat

**Solusi**:
1. Check console untuk error
2. Pastikan tidak ada ad-blocker yang block Google API
3. Pastikan internet connection stable

---

## Next Steps

### Update Onboarding Page

File: `frontend/src/pages/Onboarding.tsx`

Tambahkan logika untuk skip password input jika `isGoogleAuth = true`:

```typescript
const location = useLocation();
const { email, name, photoURL, password, isGoogleAuth } = location.state || {};

// Conditional password field
{!isGoogleAuth && (
  <div>
    <label>Password</label>
    <input type="password" ... />
  </div>
)}

// Submit tanpa password untuk Google Auth
const handleSubmit = async () => {
  const userData = {
    email,
    name,
    origin,
    category,
    ...(isGoogleAuth ? {} : { password }) // Skip password if Google Auth
  };
  
  // Call backend register
  await authService.register(userData);
};
```

---

## Verification Checklist

- [ ] Google Console: Authorized origins ditambahkan
- [ ] .env file: VITE_GOOGLE_CLIENT_ID sudah benar
- [ ] Dev server restarted
- [ ] Browser cache cleared
- [ ] Test Google Sign-In: No 403 error
- [ ] Test new user flow: Redirect ke onboarding
- [ ] Test existing user flow: Redirect ke landing
- [ ] Onboarding page: Skip password untuk Google Auth

---

## Production Deployment

### Vercel Environment Variables

1. **Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add Variables**:
   ```
   VITE_GOOGLE_CLIENT_ID = your-client-id.apps.googleusercontent.com
   ```

3. **Google Console**: Tambahkan production URL ke Authorized origins
   ```
   https://your-app.vercel.app
   ```

4. **Redeploy**: Vercel akan auto-deploy dengan env baru

---

## Support

Jika masih ada masalah:
1. Check console log untuk error detail
2. Verify semua steps di atas sudah dilakukan
3. Try different browser
4. Check Google Cloud Console status
