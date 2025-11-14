/**
 * Firestore Data Schemas
 * Defines the structure of data stored in Firestore collections
 * These are used for validation and documentation purposes
 */

/**
 * User Schema
 */
export const userSchema = {
  uid: 'string', // Firebase Auth UID
  email: 'string',
  name: 'string',
  origin: 'string', // Kota/Kabupaten
  category: 'string', // Mahasiswa, Umum, Seniman, etc.
  phoneNumber: 'string?', // Optional
  photoURL: 'string?', // Optional
  role: 'string', // "buyer" | "seller" | "admin"
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  sellerInfo: {
    hasOutlet: 'boolean?',
    outletId: 'string?',
    totalSales: 'number?',
    rating: 'number?',
    joinedAsSellerAt: 'timestamp?',
  },
};

/**
 * Outlet Schema
 */
export const outletSchema = {
  id: 'string', // Auto-generated
  ownerId: 'string', // User UID
  name: 'string',
  type: 'string', // "produk" | "event" | "keduanya"
  description: 'string',
  location: 'string',
  contact: 'string', // WhatsApp number
  logoURL: 'string?',
  bannerURL: 'string?',
  stats: {
    totalProducts: 'number',
    totalEvents: 'number',
    totalOrders: 'number',
    rating: 'number',
    reviewCount: 'number',
  },
  isActive: 'boolean',
  isVerified: 'boolean',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
};

/**
 * Product Schema
 */
export const productSchema = {
  id: 'string', // Auto-generated
  outletId: 'string',
  sellerId: 'string', // User UID
  name: 'string',
  description: 'string',
  category: 'string', // "Topeng", "Kostum", "Wayang", etc.
  price: {
    min: 'number', // Harga minimum (wajib)
    max: 'number?', // Harga maksimum (opsional)
  },
  stock: 'number',
  condition: 'string', // "Baru" | "Bekas"
  material: 'string?',
  size: 'string?',
  weight: 'number?', // in kg
  origin: 'string?', // Desa/Kecamatan
  additionalInfo: [
    {
      label: 'string', // Contoh: "Ukuran", "Material", "Berat"
      value: 'string', // Contoh: "35 x 40 cm", "Kayu Jati", "2.5 kg"
    },
  ],
  images: ['string'], // Array of image URLs
  videoURL: 'string?',
  tags: ['string'],
  featured: 'boolean',
  stats: {
    views: 'number',
    likes: 'number',
    sold: 'number',
    rating: 'number',
    reviewCount: 'number',
  },
  isActive: 'boolean',
  isDeleted: 'boolean',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
};

/**
 * Event Schema
 */
export const eventSchema = {
  id: 'string', // Auto-generated
  outletId: 'string',
  organizerId: 'string', // User UID
  name: 'string',
  description: 'string',
  category: 'string', // "Festival", "Workshop", "Pagelaran", etc.
  date: 'timestamp',
  startTime: 'string', // "19:00"
  endTime: 'string', // "23:00"
  location: {
    name: 'string', // "Alun-alun Ponorogo"
    address: 'string',
    coordinates: {
      lat: 'number?',
      lng: 'number?',
    },
  },
  capacity: 'number',
  remainingTickets: 'number',
  ticketCategories: [
    {
      category: 'string', // "VIP", "Tribun", "Festival"
      price: 'number',
      benefits: 'string',
      quota: 'number',
      sold: 'number',
    },
  ],
  images: ['string'],
  videoURL: 'string?',
  eventProgram: ['string'], // Array of activities
  stats: {
    views: 'number',
    interested: 'number',
    ticketsSold: 'number',
    rating: 'number',
    reviewCount: 'number',
  },
  status: 'string', // "upcoming" | "ongoing" | "completed" | "cancelled"
  isActive: 'boolean',
  featured: 'boolean',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
};

/**
 * Cart Schema
 */
export const cartSchema = {
  id: 'string', // User UID (one cart per user)
  userId: 'string',
  products: [
    {
      productId: 'string',
      quantity: 'number',
      price: {
        min: 'number',
        max: 'number?',
      },
      selectedPrice: 'number?', // Harga yang dipilih user (jika sudah nego/dipilih)
      addedAt: 'timestamp',
    },
  ],
  events: [
    {
      eventId: 'string',
      ticketCategory: 'string',
      quantity: 'number',
      price: 'number',
      addedAt: 'timestamp',
    },
  ],
  totalItems: 'number',
  totalAmount: 'number',
  updatedAt: 'timestamp',
};

/**
 * Order Schema
 */
export const orderSchema = {
  id: 'string', // Auto-generated
  orderNumber: 'string', // "ORD-20240225-001"
  userId: 'string',
  type: 'string', // "product" | "event" | "mixed"
  items: [
    {
      type: 'string', // "product" | "event"
      itemId: 'string', // productId or eventId
      name: 'string',
      price: 'number', // Final price yang disepakati/dibayar
      originalPrice: {
        min: 'number?',
        max: 'number?',
      },
      quantity: 'number',
      ticketCategory: 'string?',
      eventDate: 'timestamp?',
      sellerId: 'string?',
      outletId: 'string?',
    },
  ],
  payment: {
    subtotal: 'number',
    serviceFee: 'number',
    total: 'number',
    method: 'string', // "transfer" | "ewallet" | "cod"
    status: 'string', // "pending" | "paid" | "failed"
    paidAt: 'timestamp?',
    proofURL: 'string?',
  },
  delivery: {
    recipientName: 'string?',
    phone: 'string?',
    address: 'string?',
    province: 'string?',
    city: 'string?',
    postalCode: 'string?',
    notes: 'string?',
    shippingMethod: 'string?', // "jne" | "jnt" | "pickup"
    shippingCost: 'number?',
    trackingNumber: 'string?',
    status: 'string?', // "pending" | "processing" | "shipped" | "delivered"
    shippedAt: 'timestamp?',
    deliveredAt: 'timestamp?',
  },
  tickets: [
    {
      ticketNumber: 'string', // "TIK-20240225-001"
      qrCode: 'string', // URL to QR code image
      status: 'string', // "active" | "used" | "cancelled"
      usedAt: 'timestamp?',
    },
  ],
  status: 'string', // "pending" | "confirmed" | "completed" | "cancelled"
  timeline: [
    {
      status: 'string',
      timestamp: 'timestamp',
      notes: 'string?',
    },
  ],
  cancellation: {
    reason: 'string?',
    cancelledBy: 'string?', // "user" | "seller" | "admin"
    cancelledAt: 'timestamp?',
    refundStatus: 'string?', // "pending" | "processed"
    refundAmount: 'number?',
  },
  reviewed: 'boolean',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
};

/**
 * Review Schema
 */
export const reviewSchema = {
  id: 'string', // Auto-generated
  orderId: 'string',
  userId: 'string',
  targetId: 'string', // productId or eventId
  targetType: 'string', // "product" | "event"
  rating: 'number', // 1-5
  comment: 'string',
  images: ['string?'],
  isVerifiedPurchase: 'boolean',
  helpfulCount: 'number',
  sellerResponse: {
    comment: 'string?',
    respondedAt: 'timestamp?',
  },
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
};

/**
 * Notification Schema
 */
export const notificationSchema = {
  id: 'string', // Auto-generated
  userId: 'string',
  type: 'string', // "order" | "payment" | "delivery" | "review" | "promo"
  title: 'string',
  message: 'string',
  data: {
    orderId: 'string?',
    productId: 'string?',
    eventId: 'string?',
  },
  isRead: 'boolean',
  readAt: 'timestamp?',
  createdAt: 'timestamp',
};

/**
 * Helper function to validate schema
 * Note: This is a simple validation. For production, use a proper validation library like Joi or Yup
 */
export const validateSchema = (data, schema) => {
  // This is a placeholder for schema validation
  // In production, implement proper validation logic
  return true;
};

