# ✅ Konfigurasi Google Console yang BENAR

## 🔴 Masalah dengan Konfigurasi Anda Sekarang:

### ❌ Yang SALAH di konfigurasi Anda:

1. **Authorized JavaScript origins** → URL backend salah!
   - ❌ `https://reog-commerce-be.vercel.app` → INI BACKEND, bukan frontend!
   
2. **Authorized redirect URIs** → Tidak perlu untuk Google Identity Services!
   - Aplikasi kita pakai **Google Identity Services API** (popup)
   - Bukan OAuth 2.0 flow tradisional
   - Redirect URIs TIDAK DIPERLUKAN!

---

## ✅ Konfigurasi yang BENAR:

### 1. Authorized JavaScript origins

**Ini adalah URL FRONTEND tempat user membuka aplikasi di browser!**

```
URIs 1: http://localhost:5173
URIs 2: https://reog-commerce.vercel.app
URIs 3: http://localhost:3000
URIs 4: http://127.0.0.1:5173
```

**Penjelasan:**
- `http://localhost:5173` → Development frontend (Vite default)
- `https://reog-commerce.vercel.app` → Production frontend (ganti dengan URL Vercel frontend Anda)
- `http://localhost:3000` → Alternative local port
- `http://127.0.0.1:5173` → Alternative localhost

### 2. Authorized redirect URIs

**❌ HAPUS SEMUA! Tidak diperlukan untuk Google Identity Services!**

Kalau tetap mau diisi (tidak masalah tapi tidak terpakai):
```
URIs 1: http://localhost:5173
URIs 2: https://reog-commerce.vercel.app
```

---

## 📸 Screenshot Konfigurasi yang BENAR:

```
╔═══════════════════════════════════════════════════════════╗
║  OAuth 2.0 Client ID                                      ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Authorized JavaScript origins                            ║
║  For use with requests from a browser                     ║
║                                                           ║
║  URIs 1:  http://localhost:5173                          ║
║  URIs 2:  http://localhost:3000                          ║
║  URIs 3:  http://127.0.0.1:5173                          ║
║  URIs 4:  https://reog-commerce.vercel.app               ║
║                                                           ║
║  [+ ADD URI]                                              ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Authorized redirect URIs                                 ║
║  For use with requests from a web server                  ║
║                                                           ║
║  (KOSONGKAN atau isi dengan frontend URL saja)           ║
║                                                           ║
║  URIs 1:  http://localhost:5173                (optional)║
║  URIs 2:  https://reog-commerce.vercel.app     (optional)║
║                                                           ║
║  [+ ADD URI]                                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🎯 Perbedaan URL Frontend vs Backend:

| Type | Purpose | Example |
|------|---------|---------|
| **Frontend URL** | Tempat user buka browser | `http://localhost:5173` |
| | | `https://reog-commerce.vercel.app` |
| **Backend URL** | API endpoint (tidak perlu di Google Console!) | `http://localhost:5000` |
| | | `https://reog-commerce-be.vercel.app` |

**PENTING**: 
- Google Console hanya perlu tahu URL **FRONTEND**
- Backend URL TIDAK perlu dimasukkan ke Google Console
- User login di frontend, bukan di backend!

---

## 🔧 Action Required - Update Google Console SEKARANG:

### Step 1: Buka Google Cloud Console
https://console.cloud.google.com/apis/credentials

### Step 2: Edit OAuth 2.0 Client ID

Klik pada Client ID yang Anda gunakan

### Step 3: Update "Authorized JavaScript origins"

**HAPUS:**
- ❌ `https://reog-commerce-be.vercel.app` (ini backend!)

**TAMBAHKAN:**
- ✅ `http://localhost:5173`
- ✅ `http://localhost:3000`
- ✅ `http://127.0.0.1:5173`
- ✅ `https://[FRONTEND-URL-VERCEL].vercel.app`

### Step 4: Update "Authorized redirect URIs"

**PILIHAN 1 (RECOMMENDED):**
- ✅ **HAPUS SEMUA** (tidak diperlukan untuk Google Identity Services)

**PILIHAN 2 (Optional):**
- Isi dengan frontend URL saja:
  - `http://localhost:5173`
  - `https://[FRONTEND-URL].vercel.app`

### Step 5: SAVE

Klik tombol **SAVE** di bawah

### Step 6: Tunggu

Tunggu **5-10 menit** untuk propagasi perubahan

---

## 🧪 Testing

Setelah update Google Console:

### 1. Clear Browser Cache
```
Chrome/Edge: Ctrl + Shift + Delete
Firefox: Ctrl + Shift + Del
```

### 2. Restart Dev Server
```bash
cd frontend
npm run dev
```

### 3. Test Login
1. Buka http://localhost:5173/login
2. Klik "Masuk dengan Google"
3. Error 403 seharusnya HILANG! ✅

---

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=114013587667-xxxxxxxxx.apps.googleusercontent.com
```

### Backend (.env)
```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
```

**PENTING**: Backend TIDAK perlu Google Client ID!

---

## 🚀 Deploy ke Production

### Frontend (Vercel)

1. **Deploy Frontend** ke Vercel
   ```bash
   cd frontend
   vercel --prod
   ```

2. **Dapatkan Production URL**
   - Example: `https://reog-commerce-abc123.vercel.app`

3. **Add Environment Variable** di Vercel Dashboard:
   - `VITE_API_URL` = `https://reog-commerce-be.vercel.app/api`
   - `VITE_GOOGLE_CLIENT_ID` = `your-client-id.apps.googleusercontent.com`

4. **Update Google Console** dengan production URL:
   - Tambah: `https://reog-commerce-abc123.vercel.app`

5. **Redeploy** (otomatis setelah add env var)

### Backend (Vercel)

Backend deployment tidak perlu perubahan apapun untuk Google Sign-In!

---

## ❓ FAQ

### Q: Kenapa backend URL tidak perlu di Google Console?

**A**: Karena Google Sign-In terjadi di **browser user** (frontend), bukan di server (backend). Backend hanya menerima token dari frontend untuk verifikasi.

### Q: Apa itu "Authorized JavaScript origins"?

**A**: Ini adalah daftar URL tempat **kode JavaScript** Anda berjalan (yaitu frontend/browser). Google akan REJECT request dari origin yang tidak ada di list ini.

### Q: Kapan pakai "Authorized redirect URIs"?

**A**: Untuk OAuth 2.0 flow tradisional (redirect-based). Aplikasi kita pakai **Google Identity Services** (popup-based), jadi tidak perlu.

### Q: Error 403 masih muncul setelah update?

**A**: 
1. Tunggu 5-10 menit (propagation time)
2. Clear browser cache
3. Pastikan URL EXACT (http vs https, with/without trailing slash)
4. Try incognito/private mode

---

## 🎯 Checklist Final

Sebelum test, pastikan:

- [ ] Google Console: Authorized origins = **FRONTEND URLs** only
- [ ] Google Console: Hapus/edit redirect URIs yang salah
- [ ] Google Console: Saved dan tunggu 5-10 menit
- [ ] Frontend .env: VITE_GOOGLE_CLIENT_ID sudah benar
- [ ] Frontend .env: VITE_API_URL pointing ke backend
- [ ] Dev server restarted
- [ ] Browser cache cleared

Setelah semua checklist ✅, error 403 akan hilang! 🎉

---

## 📞 Need Help?

Jika masih error:
1. Screenshot error di console
2. Screenshot konfigurasi Google Console
3. Share frontend URL yang digunakan
4. Check network tab di browser DevTools

