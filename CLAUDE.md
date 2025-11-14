# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ReogCommerce** is a full-stack e-commerce platform for authentic Ponorogo Reog cultural products and events. This is a college project that's production-ready for testing with a complete backend API and functional frontend interface.

## Development Commands

### Backend (Express.js API)
```bash
cd backend
npm run dev         # Start development server with nodemon (port 5000)
npm start          # Start production server
npm test           # Run Jest tests
```

### Frontend (React + TypeScript)
```bash
cd frontend
npm run dev         # Start Vite dev server (port 5173)
npm build           # Build for production
npm lint           # Run ESLint
npm preview        # Preview production build
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express.js (ES modules)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth with Bearer tokens
- **Storage**: Firebase Storage + Cloudinary
- **Styling**: TailwindCSS with glassmorphic design patterns

### Key Directories
- `backend/` - Express.js API server with 50+ RESTful endpoints
- `frontend/` - React TypeScript application
- `frontend/src/pages/` - All page components (Login, Profile, Products, etc.)
- `frontend/src/lib/api.ts` - Axios configuration with auto-authentication
- `backend/src/controllers/` - API route handlers
- `backend/src/services/` - Business logic layer

## Data Models & API Structure

### Firestore Collections
The backend uses 8 main collections:
- **Users** - Multi-role authentication (buyer/seller/admin)
- **Products** - Flexible pricing system (fixed/range/variant)
- **Events** - Ticket categories with capacity management
- **Carts** - Real-time cart persistence per user
- **Orders** - Complete order lifecycle with tracking
- **Outlets** - Store management with statistics

### Key API Endpoints
- **Authentication**: `/auth/register`, `/auth/login` (returns Bearer token)
- **Products**: `/products`, `/products/:id`, `/products/outlet/:id`
- **Events**: `/events`, `/events/:id`, `/events/outlet/:id`
- **Cart**: `/cart`, `/cart/add`, `/cart/update`
- **Orders**: `/orders/checkout`, `/orders`, `/orders/:id`

Base URL: `http://localhost:5000/api`

## Authentication Flow

1. User registers → Firebase Auth + Firestore user created
2. User logs in → Bearer token returned (1-hour expiry)
3. Token stored in `localStorage` and auto-injected via axios interceptors
4. Protected routes require valid token in `Authorization: Bearer <token>` header

## Development Patterns

### Flexible Pricing System
- **Fixed**: Single price products
- **Range**: Negotiable pricing with min/max values
- **Variant**: Multiple variants with individual pricing (e.g., Topeng sizes)

### Dynamic Specifications
Products use 2D array structure for unlimited attributes:
```javascript
specifications: [
  ["Ukuran", "S", "M", "L"],
  ["Warna", "Merah", "Hitam", "Kuning"]
]
```

### Real-time Cart Management
- Persistent cart per user in Firestore
- Products and events grouped separately
- Price snapshots taken at time of addition
- Real-time stock validation

## Environment Setup

### Backend Environment Variables (.env)
```
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=immersive-reog-commerce
FIREBASE_CLIENT_EMAIL=firebase-admin-email
FIREBASE_PRIVATE_KEY="service-account-key"
FRONTEND_URL=http://localhost:5173
API_SECRET_KEY=your-secret
CLOUDINARY_CLOUD_NAME=cloudinary-name
CLOUDINARY_API_KEY=cloudinary-key
CLOUDINARY_API_SECRET=cloudinary-secret
```

### Firebase Configuration
- Project: "immersive-reog-commerce"
- Services: Auth, Firestore, Storage enabled
- CORS configured for `http://localhost:5173`

## Testing

- **Backend**: Complete API testing guide in `backend/API_TESTING.md`
- **Frontend**: Jest testing configured
- Use real Ponorogo cultural product examples for test data

## Project Status

The project is production-ready for testing with:
- ✅ Complete frontend UI with glassmorphic design
- ✅ Full backend API with 50+ endpoints
- ✅ Authentication system with Firebase
- ✅ Database schema and security rules
- ✅ Comprehensive testing framework
- ✅ Complete documentation

Next steps: Frontend-backend API integration, payment gateway, production deployment.

## Key Files to Reference

- `PROJECT_STATUS.md` - Detailed project status and next steps
- `backend/API_TESTING.md` - Complete API testing guide
- `frontend/src/lib/api.ts` - API client configuration
- `backend/src/app.js` - Express server setup and middleware