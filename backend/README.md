# ReogCommerce Backend API

Backend API untuk platform e-commerce ReogCommerce menggunakan Node.js, Express.js, dan Firebase (Firestore, Authentication, Storage).

## 🏗️ Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage
- **Validation**: express-validator
- **Security**: helmet, cors

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── firebase.js          # Firebase initialization
│   ├── middleware/
│   │   ├── auth.js               # Authentication middleware
│   │   ├── validation.js         # Request validation
│   │   └── errorHandler.js       # Global error handler
│   ├── routes/
│   │   ├── auth.routes.js        # Authentication routes
│   │   ├── user.routes.js        # User management
│   │   ├── product.routes.js     # Product CRUD
│   │   ├── event.routes.js       # Event CRUD
│   │   ├── outlet.routes.js      # Outlet/Store management
│   │   ├── cart.routes.js        # Shopping cart
│   │   └── order.routes.js       # Order management
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── event.controller.js
│   │   ├── outlet.controller.js
│   │   ├── cart.controller.js
│   │   └── order.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── product.service.js
│   │   ├── event.service.js
│   │   ├── outlet.service.js
│   │   ├── cart.service.js
│   │   └── order.service.js
│   ├── models/
│   │   └── schemas.js            # Firestore data schemas
│   ├── utils/
│   │   ├── response.js           # Standardized API response
│   │   ├── upload.js             # File upload handler
│   │   └── helpers.js            # Helper functions
│   └── app.js                    # Express app setup
├── .env.example                  # Environment variables template
├── .gitignore
├── package.json
└── server.js                     # Entry point
```

## 🔥 Firebase Firestore Schema

### 1. Users Collection (`users`)

```javascript
{
  uid: string,                    // Firebase Auth UID
  email: string,
  name: string,
  origin: string,                 // Kota/Kabupaten
  category: string,               // Mahasiswa, Umum, Seniman, etc.
  phoneNumber?: string,
  photoURL?: string,
  role: string,                   // "buyer" | "seller" | "admin"
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // Optional seller info
  sellerInfo?: {
    hasOutlet: boolean,
    outletId?: string,
    totalSales: number,
    rating: number,
    joinedAsSellerAt: timestamp
  }
}
```

### 2. Outlets Collection (`outlets`)

```javascript
{
  id: string,                     // Auto-generated
  ownerId: string,                // User UID
  name: string,
  type: string,                   // "produk" | "event" | "keduanya"
  description: string,
  location: string,
  contact: string,                // WhatsApp number
  logoURL?: string,
  bannerURL?: string,
  
  // Statistics
  stats: {
    totalProducts: number,
    totalEvents: number,
    totalOrders: number,
    rating: number,
    reviewCount: number
  },
  
  // Status
  isActive: boolean,
  isVerified: boolean,
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3. Products Collection (`products`)

```javascript
{
  id: string,                     // Auto-generated
  outletId: string,
  sellerId: string,               // User UID
  
  // Basic Info
  name: string,
  description: string,
  category: string,               // "Topeng", "Kostum", "Wayang", etc.
  
  // Pricing & Stock (FLEXIBLE PRICING)
  pricing: {
    priceMin: number,             // Harga minimal (untuk size/variasi terkecil)
    priceMax: number,             // Harga maksimal (untuk size/variasi terbesar)
    basePriceMin: number,         // Base price (sebelum diskon)
    basePriceMax: number
  },
  stock: number,
  condition: string,              // "Baru" | "Bekas"
  
  // Specifications (2D Array - Dynamic)
  // User bisa menambah spesifikasi sesuai kebutuhan
  specifications: [
    {
      name: string,               // "Ukuran" | "Material" | "Warna" | "Jenis Kayu"
      description: string,        // "Tersedia dalam ukuran..." | "Menggunakan..."
      variants: [
        {
          value: string,          // "Small" | "Mahoni" | "Merah"
          price: number,          // Harga tambahan dari base price (bisa 0)
          stock: number           // Stok per variant
        }
      ]
    }
  ],
  
  // Details
  material: string,
  size: string,
  weight: number,                 // in kg
  origin: string,                 // Desa/Kecamatan
  
  // Media
  images: [string],               // Array of image URLs
  videoURL?: string,
  
  // SEO & Discovery
  tags: [string],
  featured: boolean,
  
  // Statistics
  stats: {
    views: number,
    likes: number,
    sold: number,
    rating: number,
    reviewCount: number
  },
  
  // Status
  isActive: boolean,
  isDeleted: boolean,
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3a. Product Pricing & Specifications Examples

#### Example 1: Topeng dengan Multiple Ukuran
```javascript
{
  name: "Topeng Singa Barong Premium",
  pricing: {
    priceMin: 2500000,      // Ukuran Small
    priceMax: 3500000       // Ukuran Large
  },
  specifications: [
    {
      name: "Ukuran",
      description: "Pilih ukuran sesuai kebutuhan",
      variants: [
        { value: "Small (35cm)", price: 0, stock: 5 },           // Base price
        { value: "Medium (40cm)", price: 300000, stock: 8 },     // +300rb dari base
        { value: "Large (45cm)", price: 600000, stock: 3 }       // +600rb dari base
      ]
    },
    {
      name: "Jenis Kayu",
      description: "Pilih material kayu",
      variants: [
        { value: "Mahoni", price: 0, stock: 10 },
        { value: "Jati", price: 200000, stock: 6 }
      ]
    }
  ]
}
```

#### Example 2: Kostum dengan Warna & Ukuran
```javascript
{
  name: "Kostum Warok Lengkap",
  pricing: {
    priceMin: 1500000,
    priceMax: 2000000
  },
  specifications: [
    {
      name: "Ukuran",
      description: "Ukuran badan",
      variants: [
        { value: "XS (anak 6-8 thn)", price: 0, stock: 5 },
        { value: "S (anak 9-11 thn)", price: 100000, stock: 8 },
        { value: "M (dewasa muda)", price: 200000, stock: 6 },
        { value: "L (dewasa)", price: 300000, stock: 4 },
        { value: "XL (dewasa besar)", price: 400000, stock: 2 }
      ]
    },
    {
      name: "Warna Komprang",
      description: "Warna celana komprang",
      variants: [
        { value: "Merah", price: 0, stock: 8 },
        { value: "Kuning", price: 0, stock: 7 },
        { value: "Biru", price: 0, stock: 6 },
        { value: "Kombinasi (Merah-Kuning)", price: 150000, stock: 4 }
      ]
    }
  ]
}
```

#### Example 3: Kendang tanpa Variasi
```javascript
{
  name: "Kendang Reog Kulit Sapi Asli",
  pricing: {
    priceMin: 1200000,
    priceMax: 1200000    // Same = no variants
  },
  specifications: [
    {
      name: "Diameter",
      description: "Standar Reog Ponorogo",
      variants: [
        { value: "45cm (standar)", price: 0, stock: 10 }
      ]
    }
  ]
}
```

#### Example 4: Dadak Merak dengan Custom Options
```javascript
{
  name: "Dadak Merak Bulu Merak Asli",
  pricing: {
    priceMin: 7500000,
    priceMax: 10000000
  },
  specifications: [
    {
      name: "Panjang Bulu",
      description: "Panjang bulu merak yang digunakan",
      variants: [
        { value: "2.5 meter", price: 0, stock: 3 },
        { value: "3 meter", price: 1000000, stock: 5 },
        { value: "3.5 meter", price: 2000000, stock: 2 }
      ]
    },
    {
      name: "Jenis Ornamen",
      description: "Hiasan tambahan",
      variants: [
        { value: "Sederhana", price: 0, stock: 4 },
        { value: "Berlian & Emas", price: 2500000, stock: 3 },
        { value: "Premium (Kristal & Emas Asli)", price: 5000000, stock: 1 }
      ]
    },
    {
      name: "Garansi",
      description: "Jaminan kualitas",
      variants: [
        { value: "1 Tahun", price: 0, stock: 10 },
        { value: "2 Tahun + Servis Gratis", price: 500000, stock: 5 }
      ]
    }
  ]
}
```

```javascript
{
  id: string,                     // Auto-generated
  outletId: string,
  organizerId: string,            // User UID (penyelenggara)
  
  // Basic Info
  name: string,
  description: string,
  category: string,               // "Festival", "Workshop", "Pagelaran", etc.
  
  // Schedule
  date: timestamp,
  startTime: string,              // "19:00"
  endTime: string,                // "23:00"
  
  // Location
  location: {
    name: string,                 // "Alun-alun Ponorogo"
    address: string,
    coordinates?: {
      lat: number,
      lng: number
    }
  },
  
  // Capacity
  capacity: number,
  remainingTickets: number,
  
  // Ticket Categories
  ticketCategories: [
    {
      category: string,           // "VIP", "Tribun", "Festival"
      price: number,
      benefits: string,
      quota: number,
      sold: number
    }
  ],
  
  // Media
  images: [string],
  videoURL?: string,
  
  // Program
  eventProgram: [string],         // Array of activities
  
  // Statistics
  stats: {
    views: number,
    interested: number,
    ticketsSold: number,
    rating: number,
    reviewCount: number
  },
  
  // Status
  status: string,                 // "upcoming" | "ongoing" | "completed" | "cancelled"
  isActive: boolean,
  featured: boolean,
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 5. Carts Collection (`carts`)

```javascript
{
  id: string,                     // User UID (one cart per user)
  userId: string,
  
  // Cart Items
  products: [
    {
      productId: string,
      quantity: number,
      price: {
        min: number,              // Snapshot of min price at time of add
        max?: number              // Snapshot of max price (if exists)
      },
      selectedPrice?: number,     // Harga yang dipilih user (jika sudah nego/dipilih)
      addedAt: timestamp
    }
  ],
  
  events: [
    {
      eventId: string,
      ticketCategory: string,
      quantity: number,
      price: number,              // Snapshot of price
      addedAt: timestamp
    }
  ],
  
  // Totals (calculated)
  totalItems: number,
  totalAmount: number,
  
  updatedAt: timestamp
}
```

### 6. Orders Collection (`orders`)

```javascript
{
  id: string,                     // Auto-generated
  orderNumber: string,            // "ORD-20240225-001"
  userId: string,
  
  // Order Type
  type: string,                   // "product" | "event" | "mixed"
  
  // Items
  items: [
    {
      type: string,               // "product" | "event"
      itemId: string,             // productId or eventId
      name: string,
      price: number,              // Final price yang disepakati/dibayar
      originalPrice?: {           // Price range asli dari produk (untuk referensi)
        min: number,
        max?: number
      },
      quantity: number,
      
      // For events
      ticketCategory?: string,
      eventDate?: timestamp,
      
      // For products
      sellerId?: string,
      outletId?: string
    }
  ],
  
  // Payment
  payment: {
    subtotal: number,
    serviceFee: number,
    total: number,
    method: string,               // "transfer" | "ewallet" | "cod"
    status: string,               // "pending" | "paid" | "failed"
    paidAt?: timestamp,
    proofURL?: string
  },
  
  // Delivery (for products)
  delivery?: {
    recipientName: string,
    phone: string,
    address: string,
    province: string,
    city: string,
    postalCode: string,
    notes?: string,
    
    shippingMethod: string,       // "jne" | "jnt" | "pickup"
    shippingCost: number,
    trackingNumber?: string,
    
    status: string,               // "pending" | "processing" | "shipped" | "delivered"
    shippedAt?: timestamp,
    deliveredAt?: timestamp
  },
  
  // Tickets (for events)
  tickets?: [
    {
      ticketNumber: string,       // "TIK-20240225-001"
      qrCode: string,             // URL to QR code image
      status: string,             // "active" | "used" | "cancelled"
      usedAt?: timestamp
    }
  ],
  
  // Status & Timeline
  status: string,                 // "pending" | "confirmed" | "completed" | "cancelled"
  timeline: [
    {
      status: string,
      timestamp: timestamp,
      notes?: string
    }
  ],
  
  // Cancellation
  cancellation?: {
    reason: string,
    cancelledBy: string,          // "user" | "seller" | "admin"
    cancelledAt: timestamp,
    refundStatus: string,         // "pending" | "processed"
    refundAmount: number
  },
  
  // Review
  reviewed: boolean,
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 7. Reviews Collection (`reviews`)

```javascript
{
  id: string,                     // Auto-generated
  orderId: string,
  userId: string,
  targetId: string,               // productId or eventId
  targetType: string,             // "product" | "event"
  
  // Review Content
  rating: number,                 // 1-5
  comment: string,
  images?: [string],
  
  // Metadata
  isVerifiedPurchase: boolean,
  helpfulCount: number,
  
  // Response from seller
  sellerResponse?: {
    comment: string,
    respondedAt: timestamp
  },
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 8. Notifications Collection (`notifications`)

```javascript
{
  id: string,                     // Auto-generated
  userId: string,
  
  type: string,                   // "order" | "payment" | "delivery" | "review" | "promo"
  title: string,
  message: string,
  
  // Additional data
  data?: {
    orderId?: string,
    productId?: string,
    eventId?: string
  },
  
  // Status
  isRead: boolean,
  readAt?: timestamp,
  
  createdAt: timestamp
}
```

## 🔄 Data Flow Diagrams

### 1. User Registration & Authentication Flow

```
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. POST /api/auth/register
       │    { email, password, name }
       ▼
┌─────────────────┐
│  Auth Service   │
├─────────────────┤
│ • Validate data │
│ • Create auth   │──► Firebase Auth
│ • Create user   │──► Firestore (users)
│   document      │
└──────┬──────────┘
       │
       │ 2. Return JWT + user data
       ▼
┌─────────────┐
│   Client    │
│ Store token │
│  in localStorage
└─────────────┘
```

### 2. Product Creation Flow (Seller)

```
┌─────────────┐
│   Seller    │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. POST /api/products
       │    + FormData (images, details)
       ▼
┌─────────────────────┐
│  Product Service    │
├─────────────────────┤
│ • Verify auth token │
│ • Check outlet      │──► Firestore (outlets)
│ • Upload images     │──► Firebase Storage
│ • Create product    │──► Firestore (products)
│ • Update outlet     │
│   stats             │
└──────┬──────────────┘
       │
       │ 2. Return product data
       ▼
┌─────────────┐
│   Seller    │
│ Dashboard   │
│   update    │
└─────────────┘
```

### 3. Add to Cart Flow

```
┌─────────────┐
│    Buyer    │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. POST /api/cart/add
       │    { productId, quantity }
       ▼
┌─────────────────────┐
│   Cart Service      │
├─────────────────────┤
│ • Verify auth       │
│ • Check product     │──► Firestore (products)
│   stock             │
│ • Get/Create cart   │──► Firestore (carts)
│ • Add item          │
│ • Calculate total   │
└──────┬──────────────┘
       │
       │ 2. Return updated cart
       ▼
┌─────────────┐
│    Buyer    │
│ Cart page   │
│   update    │
└─────────────┘
```

### 4. Checkout & Order Creation Flow

```
┌─────────────┐
│    Buyer    │
└──────┬──────┘
       │
       │ 1. POST /api/orders/checkout
       │    { items, delivery, payment }
       ▼
┌─────────────────────────┐
│   Order Service         │
├─────────────────────────┤
│ • Verify auth & items   │
│ • Check stock/tickets   │──► Firestore (products/events)
│ • Calculate totals      │
│ • Create order          │──► Firestore (orders)
│ • Reduce stock          │
│ • Clear cart items      │──► Firestore (carts)
│ • Send notification     │──► Firestore (notifications)
│                         │
│ • Generate tickets      │──► If event order
│   (QR codes)            │──► Firebase Storage
└──────┬──────────────────┘
       │
       │ 2. Return order details
       ▼
┌─────────────┐
│    Buyer    │
│ Order page  │
│  + Payment  │
│ instructions│
└─────────────┘
```

### 5. Event Ticket Purchase Flow

```
┌─────────────┐
│    Buyer    │
└──────┬──────┘
       │
       │ 1. Select event + ticket categories
       │ 2. POST /api/orders/checkout
       ▼
┌─────────────────────────┐
│   Order Service         │
├─────────────────────────┤
│ • Verify ticket         │──► Firestore (events)
│   availability          │
│ • Create order          │──► Firestore (orders)
│ • Generate tickets      │
│   with QR codes         │
│ • Reduce remaining      │
│   tickets in event      │
│ • Send notification     │
└──────┬──────────────────┘
       │
       │ 3. Return order + ticket URLs
       ▼
┌─────────────┐
│    Buyer    │
│ • Download  │
│   tickets   │
│ • Show QR   │
│   code      │
└─────────────┘
```

## 🔐 Authentication & Authorization

### Middleware Flow

```
Request
   │
   ▼
┌──────────────────┐
│  CORS Middleware │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Helmet (Security)│
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Auth Middleware │──► Verify Firebase token
│  • Extract token │
│  • Verify with   │
│    Firebase Auth │
│  • Attach user   │
│    to req.user   │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Role Check       │──► Check user role
│  (if needed)     │    (buyer/seller/admin)
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Validation      │──► express-validator
└────────┬─────────┘
         ▼
┌──────────────────┐
│   Controller     │──► Business logic
└────────┬─────────┘
         ▼
┌──────────────────┐
│     Service      │──► Database operations
└────────┬─────────┘
         ▼
    Response
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login with Google OAuth
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/avatar` - Upload profile picture
- `GET /api/users/:id` - Get user by ID (public info)

### Outlets
- `POST /api/outlets` - Create new outlet
- `GET /api/outlets/:id` - Get outlet details
- `PUT /api/outlets/:id` - Update outlet
- `DELETE /api/outlets/:id` - Delete outlet
- `GET /api/outlets/my` - Get my outlets

### Products
- `POST /api/products` - Create product (seller only)
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)
- `GET /api/products/outlet/:outletId` - Get products by outlet
- `POST /api/products/:id/like` - Like/unlike product

### Events
- `POST /api/events` - Create event (seller only)
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event (owner only)
- `DELETE /api/events/:id` - Delete event (owner only)
- `GET /api/events/outlet/:outletId` - Get events by outlet

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders/checkout` - Create order from cart
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/payment` - Upload payment proof
- `GET /api/orders/seller` - Get seller orders (seller only)
- `PUT /api/orders/:id/status` - Update order status (seller/admin)

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/product/:productId` - Get product reviews
- `GET /api/reviews/event/:eventId` - Get event reviews
- `PUT /api/reviews/:id` - Update review (owner only)
- `DELETE /api/reviews/:id` - Delete review (owner only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## 🚀 Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "reog-commerce"
3. Enable services:
   - **Authentication** → Email/Password, Google
   - **Firestore Database** → Production mode
   - **Storage** → Default bucket
4. Get service account key:
   - Project Settings → Service Accounts → Generate new private key
5. Save as `serviceAccountKey.json` (add to .gitignore)

### 2. Environment Variables

Create `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Firebase
FIREBASE_PROJECT_ID=reog-commerce
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_STORAGE_BUCKET=reog-commerce.appspot.com

# API Keys
API_SECRET_KEY=your-secret-key

# Frontend URL
FRONTEND_URL=http://localhost:5173

# WhatsApp
WHATSAPP_NUMBER=6285136994744

# Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Install Dependencies

```bash
cd backend
npm init -y
npm install express cors helmet dotenv
npm install firebase-admin
npm install express-validator
npm install multer
npm install --save-dev nodemon
```

### 4. Update package.json

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## 📊 Firestore Indexes

Create composite indexes for queries:

```javascript
// products collection
{
  collectionGroup: "products",
  fields: [
    { fieldPath: "isActive", order: "ASCENDING" },
    { fieldPath: "category", order: "ASCENDING" },
    { fieldPath: "createdAt", order: "DESCENDING" }
  ]
}

// events collection
{
  collectionGroup: "events",
  fields: [
    { fieldPath: "status", order: "ASCENDING" },
    { fieldPath: "date", order: "ASCENDING" }
  ]
}

// orders collection
{
  collectionGroup: "orders",
  fields: [
    { fieldPath: "userId", order: "ASCENDING" },
    { fieldPath: "createdAt", order: "DESCENDING" }
  ]
}
```

## 🔒 Security Rules

Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users - read own data, admins can read all
    match /users/{userId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == userId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products - public read, owner write
    match /products/{productId} {
      allow read: if resource.data.isActive == true;
      allow create: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'seller';
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.sellerId;
    }
    
    // Events - public read, owner write
    match /events/{eventId} {
      allow read: if resource.data.isActive == true;
      allow create: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'seller';
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.organizerId;
    }
    
    // Orders - user can read own orders
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.userId ||
                      request.auth.uid in resource.data.items[].sellerId);
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && 
                       (request.auth.uid == resource.data.userId ||
                        request.auth.uid in resource.data.items[].sellerId);
    }
    
    // Carts - user can only access own cart
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 💡 Product Price Range & Additional Info

### Price Range Structure

Produk dapat memiliki harga tetap atau harga range:

**1. Harga Tetap (Fixed Price)**
```javascript
{
  price: {
    min: 100000,
    max: undefined  // atau tidak diisi
  }
}
```
- Jika `max` tidak ada atau `undefined`, berarti harga tetap sebesar `min`
- Frontend menampilkan: "Rp 100.000"

**2. Harga Range (Price Range)**
```javascript
{
  price: {
    min: 100000,
    max: 150000
  }
}
```
- Frontend menampilkan: "Rp 100.000 - Rp 150.000"
- User dapat memilih harga dalam range tersebut saat checkout
- Seller dapat nego harga dengan buyer melalui chat/WhatsApp

**3. Contoh Request Body untuk Create Product**
```json
{
  "name": "Topeng Reog Ponorogo",
  "description": "Topeng reog berkualitas tinggi",
  "category": "Topeng",
  "price": {
    "min": 500000,
    "max": 750000
  },
  "stock": 10,
  "condition": "Baru",
  "additionalInfo": [
    {
      "label": "Ukuran",
      "value": "35 x 40 cm"
    },
    {
      "label": "Material",
      "value": "Kayu Jati"
    },
    {
      "label": "Berat",
      "value": "2.5 kg"
    },
    {
      "label": "Asal",
      "value": "Desa Bantaran, Ponorogo"
    }
  ],
  "images": ["url1", "url2"],
  "tags": ["reog", "topeng", "ponorogo"]
}
```

### Additional Info (Dynamic Product Information)

Field `additionalInfo` adalah array of objects yang memungkinkan seller menambahkan informasi produk secara dinamis:

```javascript
additionalInfo: [
  { label: "Ukuran", value: "35 x 40 cm" },
  { label: "Material", value: "Kayu Jati" },
  { label: "Berat", value: "2.5 kg" },
  { label: "Warna", value: "Merah, Kuning, Hitam" },
  { label: "Kondisi", value: "Baru" }
]
```

**Keuntungan:**
- Seller dapat menambahkan informasi sesuai kebutuhan produk
- Tidak terbatas pada field tertentu (material, size, weight)
- Fleksibel untuk berbagai jenis produk

**Validasi:**
- `label` wajib diisi (string, min 1 karakter)
- `value` wajib diisi (string, min 1 karakter)
- Array tidak boleh kosong (minimal 1 item)
- Tidak ada duplicate label (optional, bisa ditambahkan validasi)

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error description"
  }
}
```

## 🧪 Testing

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## 📚 Next Steps

1. Initialize Firebase project
2. Create basic Express server
3. Implement authentication endpoints
4. Add product/event CRUD operations
5. Implement cart functionality
6. Build order processing system
7. Add file upload (images)
8. Create notification system
9. Add analytics tracking
10. Deploy to production

---

**Note**: This documentation provides the foundation. Implementation details for each endpoint will be created in subsequent steps based on priority.
