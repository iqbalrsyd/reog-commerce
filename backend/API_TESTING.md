# 📚 ReogCommerce API Testing Guide

Panduan lengkap untuk testing API ReogCommerce menggunakan Postman atau cURL.

## 🚀 Quick Start

### 1. Server Setup
```bash
cd backend
npm run dev
# Server akan berjalan di http://localhost:5000
```

### 2. Test dengan Script
```bash
node test-auth-flow.js
```

---

## 📋 API Endpoints & Testing Data

### Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Flow

### Step 1: Register User

**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "email": "seller@ponorogo.com",
  "password": "Password123!",
  "name": "Ahmad Pengrajin",
  "origin": "Desa Setono, Ponorogo",
  "category": "Seniman",
  "phoneNumber": "085136994744"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "iMh1Up9MFfP2Hm1sT6QH",
    "email": "seller@ponorogo.com",
    "name": "Ahmad Pengrajin",
    "category": "Seniman",
    ...
  },
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save Token:** Gunakan `token` untuk requests berikutnya sebagai Bearer token.

---

### Step 2: Login User

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "seller@ponorogo.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "iMh1Up9MFfP2Hm1sT6QH",
    "email": "seller@ponorogo.com",
    ...
  },
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Step 3: Get User Profile (Authenticated)

**Endpoint:** `GET /users/profile`

**Headers:**
```
Authorization: Bearer <TOKEN_FROM_LOGIN>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uid": "iMh1Up9MFfP2Hm1sT6QH",
    "email": "seller@ponorogo.com",
    "name": "Ahmad Pengrajin",
    "category": "Seniman",
    "phoneNumber": "085136994744",
    ...
  }
}
```

---

## 🏪 Outlet Management

### Create Outlet (Product Type)

**Endpoint:** `POST /outlets`

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Toko Pengrajin Setono",
  "type": "produk",
  "description": "Menjual kerajinan Reog tradisional dari Desa Setono",
  "location": "Desa Setono, Jenangan, Ponorogo, Jawa Timur",
  "contact": "085136994744"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "outlet123",
    "name": "Toko Pengrajin Setono",
    "type": "produk",
    ...
  }
}
```

---

### Create Outlet (Event Type)

**Endpoint:** `POST /outlets`

**Request:**
```json
{
  "name": "Penyelenggara Festival Grebeg Suro",
  "type": "event",
  "description": "Penyelenggara event Grebeg Suro dan workshop Reog",
  "location": "Alun-alun Ponorogo, Jawa Timur",
  "contact": "082234567890"
}
```

---

## 📦 Product Management

### Create Product

**Endpoint:** `POST /products`

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request:**
```json
{
  "outletId": "outlet123",
  "name": "Topeng Singa Barong Premium",
  "description": "Topeng Singa Barong adalah elemen paling ikonik dalam Reog Ponorogo. Diukir dari kayu mahoni pilihan dengan detail sangat teliti.",
  "category": "Topeng",
  "condition": "Baru",
  "price": {
    "min": 2500000,
    "max": 3500000
  },
  "stock": 16,
  "additionalInfo": [
    { "ukuran": "35cm - 45cm" },
    { "berat": "3.5 kg" },
    { "material": "Kayu Mahoni" },
    { "asal": "Desa Setono, Ponorogo" },
    { "lamaPreOrder": "1 minggu" }
  ],
  "image": [
    "https://example.com/topeng1.jpg",
    "https://example.com/topeng2.jpg"
  ],
  "videoURL": "https://example.com/topeng-video.mp4",
  "tags": ["topeng", "reog", "handmade", "ponorogo"],
  "featured": true,
  "isActive": true,
  "isDelete": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "product123",
    "name": "Topeng Singa Barong Premium",
    "price": { "min": 2500000, "max": 3500000 },
    ...
  }
}
```

---

### Get All Products

**Endpoint:** `GET /products`

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

### Get Products by Category

**Endpoint:** `GET /products?category=Topeng`

---

### Get Products by Outlet

**Endpoint:** `GET /products/outlet/<OUTLET_ID>`

---

### Get Product Detail

**Endpoint:** `GET /products/<PRODUCT_ID>`

---

### Update Product

**Endpoint:** `PUT /products/<PRODUCT_ID>`

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request:** (sama seperti create, update fields yang diinginkan)

---

## 🎪 Event Management

### Create Event

**Endpoint:** `POST /events`

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request:**
```json
{
  "outletId": "outlet123",
  "name": "Festival Grebeg Suro Ponorogo 2024",
  "description": "Puncak perayaan tahun baru Islam di Ponorogo dengan kemegahan Reog Ponorogo",
  "category": "Festival",
  "date": "2024-02-25T00:00:00Z",
  "startTime": "19:00",
  "endTime": "23:00",
  "location": {
    "name": "Alun-alun Ponorogo",
    "address": "Jl. Alun-alun Utara, Kelurahan Tonatan, Ponorogo",
    "coordinates": {
      "lat": -7.8663,
      "lng": 111.4938
    }
  },
  "capacity": 1000,
  "ticketCategories": [
    {
      "category": "VIP",
      "price": 150000,
      "benefits": "Kursi depan, meet & greet penari, merchandise",
      "quota": 200
    },
    {
      "category": "Tribun",
      "price": 100000,
      "benefits": "Kursi tribun, view terbaik, merchandise",
      "quota": 400
    },
    {
      "category": "Festival",
      "price": 50000,
      "benefits": "Standing area, free akses semua zona",
      "quota": 400
    }
  ],
  "eventProgram": [
    "Kirab Pusaka Reog Ponorogo dengan 100 penari",
    "Penampilan Singo Barong dari berbagai sanggar terbaik",
    "Tari Dadak Merak spektakuler dengan mahkota bulu merak 3 meter"
  ],
  "images": ["https://example.com/grebeg1.jpg"],
  "featured": true
}
```

---

### Get All Events

**Endpoint:** `GET /events`

---

### Get Event Detail

**Endpoint:** `GET /events/<EVENT_ID>`

---

### Get Events by Outlet

**Endpoint:** `GET /events/outlet/<OUTLET_ID>`

---

## 🛒 Cart Management

### Get Cart

**Endpoint:** `GET /cart`

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "items": [...],
    "total": 5000000,
    "itemCount": 3
  }
}
```

---

### Add Product to Cart

**Endpoint:** `POST /cart/add`

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request:**
```json
{
  "productId": "product123",
  "quantity": 2
}
```

---

### Add Event Ticket to Cart

**Endpoint:** `POST /cart/add`

**Request:**
```json
{
  "eventId": "event123",
  "ticketCategory": "VIP",
  "quantity": 2
}
```

---

### Update Cart Item Quantity

**Endpoint:** `PUT /cart/update`

**Request:**
```json
{
  "itemId": "product123",
  "quantity": 1,
  "type": "product"
}
```

---

### Remove Item from Cart

**Endpoint:** `DELETE /cart/remove/<ITEM_ID>`

---

### Clear Cart

**Endpoint:** `DELETE /cart/clear`

---

## 🧪 Testing dengan Postman

### Import Collection

1. Buka Postman
2. Klik "Import"
3. Buat collection dengan endpoints di atas

### Environment Variables

Buat environment dengan variables:
```
baseUrl = http://localhost:5000/api
token = <TOKEN_DARI_LOGIN>
outletId = <OUTLET_ID_DARI_CREATE>
productId = <PRODUCT_ID_DARI_CREATE>
eventId = <EVENT_ID_DARI_CREATE>
```

### Pre-request Script

Untuk auto-set Authorization header:
```javascript
if (pm.environment.get("token")) {
  pm.request.headers.add({
    key: "Authorization",
    value: "Bearer " + pm.environment.get("token")
  });
}
```

---

## 🧪 Testing dengan cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@ponorogo.com",
    "password": "Password123!",
    "name": "Ahmad Pengrajin",
    "origin": "Desa Setono, Ponorogo",
    "category": "Seniman",
    "phoneNumber": "085136994744"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@ponorogo.com",
    "password": "Password123!"
  }'
```

### Create Outlet (with token)
```bash
curl -X POST http://localhost:5000/api/outlets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "name": "Toko Pengrajin Setono",
    "type": "produk",
    "description": "Menjual kerajinan Reog tradisional",
    "location": "Desa Setono, Ponorogo",
    "contact": "085136994744"
  }'
```

---

## ✅ Checklist Testing

- [ ] Register user (get token)
- [ ] Login user (get token)
- [ ] Get profile (authenticated)
- [ ] Create outlet (produk)
- [ ] Create outlet (event)
- [ ] Create product
- [ ] Get all products
- [ ] Get products by category
- [ ] Create event
- [ ] Get all events
- [ ] Add product to cart
- [ ] Add event ticket to cart
- [ ] Get cart
- [ ] Remove item from cart

---

## 🆘 Troubleshooting

### Bearer Token Error
```
Error: Authorization header missing or invalid
```
**Solution:** Pastikan header format: `Authorization: Bearer <TOKEN>`

### Email Already Registered
```
Error: Email already registered
```
**Solution:** Gunakan email yang berbeda (tambahkan timestamp)

### Outlet ID Missing
```
Error: Outlet not found
```
**Solution:** Pastikan outlet sudah dibuat sebelum create product

### Product Not Created
```
Error: Error creating product
```
**Solution:** Cek:
- Token valid (dari login/register)
- OutletId exist
- Price field format: `{ "min": 2500000, "max": 3500000 }`
- AdditionalInfo array of objects format

---

## 📞 Support

Jika ada error, check:
1. Server running: `curl http://localhost:5000/health`
2. Token valid (belum expired)
3. Request format sesuai dokumentasi
4. Content-Type header: `application/json`

