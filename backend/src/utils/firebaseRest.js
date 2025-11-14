/**
 * Firebase REST API Helper
 * Since Firebase Admin SDK doesn't verify passwords, we use REST API
 */

import fetch from 'node-fetch';

/**
 * Verify email and password using Firebase REST API
 * Returns user data if credentials are valid
 */
export const verifyEmailPassword = async (email, password) => {
  try {
    const apiKey = process.env.FIREBASE_API_KEY;
    
    if (!apiKey) {
      throw new Error('FIREBASE_API_KEY not set in environment variables');
    }

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    // Check if response has error
    if (data.error) {
      if (data.error.message === 'INVALID_PASSWORD') {
        throw new Error('Invalid credentials');
      }
      if (data.error.message === 'EMAIL_NOT_FOUND') {
        throw new Error('Invalid credentials');
      }
      throw new Error(data.error.message || 'Authentication failed');
    }

    // Return user ID (localId is the Firebase UID)
    return {
      uid: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    console.error('Error verifying email/password:', error);
    throw error;
  }
};
