# Authentication Flow Documentation

## Overview

Backend API menggunakan Firebase Authentication dengan ID token untuk autentikasi. Custom token digunakan hanya untuk registrasi dan harus ditukar menjadi ID token di client side.

## Authentication Flow

### 1. Registration Flow

#### Step 1: Register User (Backend)
```
POST /api/auth/register
Body: {
  email: "user@example.com",
  password: "password123",
  name: "User Name",
  origin: "Ponorogo",
  category: "Mahasiswa",
  phoneNumber: "081234567890"
}

Response: {
  success: true,
  message: "User registered successfully. Please exchange custom token for ID token on client side.",
  data: {
    user: { ... },
    customToken: "eyJhbGciOiJSUzI1NiIs...",
    message: "Registration successful. Please exchange custom token for ID token on client side using signInWithCustomToken()"
  }
}
```

#### Step 2: Exchange Custom Token for ID Token (Client Side)
```javascript
// Client side (React/Next.js/etc)
import { getAuth, signInWithCustomToken } from 'firebase/auth';

const auth = getAuth();
const customToken = response.data.customToken;

// Exchange custom token for ID token
const userCredential = await signInWithCustomToken(auth, customToken);
const idToken = await userCredential.user.getIdToken();

// Store ID token for API requests
localStorage.setItem('idToken', idToken);
```

#### Step 3: Use ID Token for Authenticated Requests
```javascript
// Use ID token in Authorization header
fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
});
```

### 2. Login Flow

#### Option A: Client-Side Login (Recommended)
```javascript
// Client side
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const idToken = await userCredential.user.getIdToken();

// Store ID token
localStorage.setItem('idToken', idToken);

// Use ID token for API requests
fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
});
```

#### Option B: Backend Login Endpoint
```
POST /api/auth/login
Body: {
  email: "user@example.com",
  idToken: "eyJhbGciOiJSUzI1NiIs..." // ID token from client side
}

Response: {
  success: true,
  message: "Login successful",
  data: {
    user: { ... },
    token: "eyJhbGciOiJSUzI1NiIs..." // ID token
  }
}
```

**Note**: Backend login endpoint membutuhkan ID token dari client side. Client harus melakukan login dengan Firebase Auth SDK terlebih dahulu untuk mendapatkan ID token.

### 3. Google OAuth Login Flow

```javascript
// Client side
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();
const userCredential = await signInWithPopup(auth, provider);
const idToken = await userCredential.user.getIdToken();

// Store ID token
localStorage.setItem('idToken', idToken);

// Use ID token for API requests
fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
});
```

## Token Types

### Custom Token
- **Purpose**: Used for user registration
- **Created by**: Backend (Firebase Admin SDK)
- **Cannot be verified**: Cannot be verified with `verifyIdToken()`
- **Must be exchanged**: Must be exchanged for ID token on client side using `signInWithCustomToken()`

### ID Token
- **Purpose**: Used for authenticated API requests
- **Created by**: Firebase Auth Client SDK
- **Can be verified**: Can be verified with `verifyIdToken()` on backend
- **Lifespan**: Expires after 1 hour (default)
- **Format**: JWT token

## Error Handling

### Common Errors

#### 1. Custom Token Error
```
Error: verifyIdToken() expects an ID token, but was given a custom token.
```

**Solution**: Exchange custom token for ID token on client side using `signInWithCustomToken()`.

#### 2. Invalid Token Error
```
Error: Invalid token format. Please make sure you are using an ID token, not a custom token.
```

**Solution**: Use ID token from Firebase Auth client SDK, not custom token.

#### 3. Token Expired Error
```
Error: Token has expired. Please login again.
```

**Solution**: Get new ID token from Firebase Auth client SDK.

## Best Practices

1. **Always use ID token for authenticated requests**
   - Never use custom token directly in API requests
   - Always exchange custom token for ID token first

2. **Handle token refresh**
   - ID tokens expire after 1 hour
   - Implement token refresh logic on client side
   - Use `user.getIdToken(true)` to force refresh

3. **Store tokens securely**
   - Store ID token in memory or secure storage
   - Never store tokens in localStorage if security is critical
   - Consider using httpOnly cookies for production

4. **Client-side authentication**
   - Prefer client-side authentication with Firebase Auth SDK
   - Backend endpoints are optional and mainly for user data management
   - Use backend login endpoint only if you need server-side user data management

## Example: Complete Registration Flow

```javascript
// 1. Register user (Backend)
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'User Name',
    origin: 'Ponorogo',
    category: 'Mahasiswa'
  })
});

const { data } = await registerResponse.json();
const { customToken, user } = data;

// 2. Exchange custom token for ID token (Client)
import { getAuth, signInWithCustomToken } from 'firebase/auth';

const auth = getAuth();
const userCredential = await signInWithCustomToken(auth, customToken);
const idToken = await userCredential.user.getIdToken();

// 3. Use ID token for authenticated requests
const profileResponse = await fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
});

const profileData = await profileResponse.json();
```

## Example: Complete Login Flow

```javascript
// 1. Login with Firebase Auth SDK (Client)
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const idToken = await userCredential.user.getIdToken();

// 2. Use ID token for authenticated requests
const profileResponse = await fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
});

const profileData = await profileResponse.json();
```

## Summary

- **Registration**: Backend returns custom token → Client exchanges for ID token → Use ID token for API requests
- **Login**: Client logs in with Firebase Auth SDK → Get ID token → Use ID token for API requests
- **Authentication**: Always use ID token in `Authorization: Bearer <idToken>` header
- **Never use custom token directly** in API requests - it will fail

