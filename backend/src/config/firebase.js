import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
try {
  // Option 1: Using service account key file (for development)
  // Uncomment if you have serviceAccountKey.json file
  // const serviceAccount = require('../../serviceAccountKey.json');
  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  // });

  // Option 2: Using environment variables (recommended for production)
  // Note: We only use Firestore and Auth, not Storage (using Cloudinary instead)
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      // No storageBucket needed - we use Cloudinary for file storage
    });
  }

  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin SDK:', error);
  throw error;
}

// Export Firebase services
// Note: We only export Firestore and Auth, not Storage
// File storage is handled by Cloudinary
export const db = admin.firestore();
export const auth = admin.auth();

// Export admin for direct use if needed
export default admin;

