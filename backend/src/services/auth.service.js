import { auth, db } from '../config/firebase.js';
import { getTimestamp } from '../utils/helpers.js';
import { hashPassword, comparePassword } from '../utils/password.js';

/**
 * Register new user
 * Return user data + bearer token langsung
 */
export const register = async (userData) => {
  try {
    const { email, password, name, origin, category, phoneNumber } = userData;

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    });

    // Hash password untuk disimpan di Firestore (opsional, untuk reference)
    const hashedPassword = await hashPassword(password);

    // Create user document in Firestore
    const userDoc = {
      uid: userRecord.uid,
      email,
      name,
      origin: origin || '',
      category: category || 'Umum',
      phoneNumber: phoneNumber || '',
      photoURL: '',
      role: 'buyer',  // Default role - becomes 'seller' when outlet is created
      sellerInfo: {
        hasOutlet: false,
        outletId: null,
        joinedAsSellerAt: null,
      },
      // Store hashed password untuk reference/verification
      // Note: Firebase Auth juga menyimpan password, ini backup
      passwordHash: hashedPassword,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
    };

    await db.collection('users').doc(userRecord.uid).set(userDoc);

    // Generate bearer token untuk client
    const token = await auth.createCustomToken(userRecord.uid);

    return {
      success: true,
      user: userDoc,
      token: token,
    };
  } catch (error) {
    console.error('Error in register service:', error);
    if (error.code === 'auth/email-already-exists') {
      throw new Error('Email already registered');
    }
    throw error;
  }
};

/**
 * Login user dengan email + password
 * Return user data + bearer token
 */
export const login = async (credentials) => {
  try {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Get user document dari Firestore by email
    const userSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      throw new Error('Invalid credentials');
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const uid = userDoc.id;

    // Verify password menggunakan bcrypt
    if (!userData.passwordHash) {
      // Fallback jika passwordHash tidak ada
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, userData.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate bearer token untuk client
    const token = await auth.createCustomToken(uid);

    return {
      success: true,
      user: {
        uid,
        ...userData,
      },
      token: token,
    };
  } catch (error) {
    console.error('Error in login service:', error);
    throw error;
  }
};

/**
 * Get user data from Firestore
 * Used after Firebase Auth client-side authentication
 */
export const getUserData = async (uid) => {
  try {
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    return {
      uid: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    console.error('Error in getUserData:', error);
    throw error;
  }
};

/**
 * Get user by ID (for authenticated routes)
 */
export const getUserById = async (uid) => {
  try {
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    return {
      uid: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    console.error('Error in getUserById service:', error);
    throw error;
  }
};

/**
 * Logout user (placeholder - Firebase handles client-side logout)
 */
export const logout = async () => {
  try {
    // Firebase handles logout on client side
    return { success: true };
  } catch (error) {
    console.error('Error in logout service:', error);
    throw error;
  }
};
