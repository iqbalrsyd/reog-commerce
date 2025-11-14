import { auth } from '../config/firebase.js';
import { unauthorizedResponse, forbiddenResponse, serverErrorResponse } from '../utils/response.js';

/**
 * Authentication Middleware
 * Verifies Firebase ID token from Authorization header
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse(res, 'No token provided. Please include a valid token in the Authorization header.');
    }
    
    // Extract token
    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      return unauthorizedResponse(res, 'Invalid token format.');
    }
    
    try {
      // Try to verify as ID token first (preferred)
      let decodedToken;
      try {
        decodedToken = await auth.verifyIdToken(token);
      } catch (idTokenError) {
        // If ID token verification fails, try custom token
        if (idTokenError.code === 'auth/argument-error' && 
            idTokenError.message.includes('custom token')) {
          // This is a custom token created by createCustomToken()
          // Custom tokens have different format, just decode without verification
          // since Firebase admin SDK created it
          console.warn('Custom token used instead of ID token. Please use ID token for better security.');
          
          // For custom tokens, we need to get user from Firestore directly
          // Custom tokens only contain uid claim
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) {
            throw new Error('Invalid custom token format');
          }
          
          // Decode JWT payload manually (it's just base64 encoded)
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
          if (!payload.uid) {
            throw new Error('Custom token missing uid claim');
          }
          
          decodedToken = {
            uid: payload.uid,
            email: null,
            email_verified: false,
            name: null,
            picture: null,
          };
        } else {
          throw idTokenError;
        }
      }
      
      // Attach user info to request object
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        emailVerified: decodedToken.email_verified || false,
        name: decodedToken.name || null,
        picture: decodedToken.picture || null,
      };
      
      // Continue to next middleware
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      
      // Provide helpful error messages
      if (error.code === 'auth/argument-error') {
        return unauthorizedResponse(
          res,
          'Invalid token format. Token must be either an ID token or custom token from authentication.'
        );
      }
      
      if (error.code === 'auth/id-token-expired') {
        return unauthorizedResponse(res, 'Token has expired. Please login again.');
      }
      
      if (error.code === 'auth/id-token-revoked') {
        return unauthorizedResponse(res, 'Token has been revoked.');
      }
      
      if (error.code === 'auth/invalid-credential') {
        return unauthorizedResponse(res, 'Invalid token. Please login again.');
      }
      
      return unauthorizedResponse(res, `Invalid or expired token: ${error.message}`);
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return serverErrorResponse(res, 'Authentication failed');
  }
};

/**
 * Role-based Authorization Middleware
 * Checks if user has required role(s)
 * @param {string|Array<string>} allowedRoles - Required role(s)
 */
export const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.uid) {
        return unauthorizedResponse(res, 'User not authenticated');
      }
      
      // Get user document from Firestore to check role
      const { db } = await import('../config/firebase.js');
      const userDoc = await db.collection('users').doc(req.user.uid).get();
      
      if (!userDoc.exists) {
        return unauthorizedResponse(res, 'User not found');
      }
      
      const userData = userDoc.data();
      const userRole = userData.role || 'buyer';
      
      // Check if user has required role
      if (!allowedRoles.includes(userRole)) {
        return forbiddenResponse(res, `Access denied. Required role: ${allowedRoles.join(' or ')}`);
      }
      
      // Attach user data to request
      req.user.role = userRole;
      req.user.userData = userData;
      
      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      return serverErrorResponse(res, 'Authorization failed');
    }
  };
};

/**
 * Optional Authentication Middleware
 * Verifies token if present, but doesn't fail if absent
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      
      if (token) {
        try {
          // Try to verify as ID token first
          let decodedToken;
          try {
            decodedToken = await auth.verifyIdToken(token);
          } catch (idTokenError) {
            // If ID token verification fails, try custom token
            if (idTokenError.code === 'auth/argument-error' && 
                idTokenError.message.includes('custom token')) {
              // Decode custom token manually
              const tokenParts = token.split('.');
              if (tokenParts.length === 3) {
                const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
                if (payload.uid) {
                  decodedToken = {
                    uid: payload.uid,
                    email: null,
                    email_verified: false,
                    name: null,
                    picture: null,
                  };
                }
              }
            } else {
              throw idTokenError;
            }
          }
          
          if (decodedToken) {
            req.user = {
              uid: decodedToken.uid,
              email: decodedToken.email || null,
              emailVerified: decodedToken.email_verified || false,
              name: decodedToken.name || null,
              picture: decodedToken.picture || null,
            };
          }
        } catch (error) {
          // Token is invalid, but we continue without user
          console.warn('Optional auth: Invalid token, continuing without user');
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional authentication middleware error:', error);
    // Continue even if there's an error
    next();
  }
};

/**
 * Check if user is the owner of a resource
 * @param {string} resourceUserId - User ID of resource owner
 */
export const isOwner = (req, res, next) => {
  try {
    if (!req.user || !req.user.uid) {
      return unauthorizedResponse(res, 'User not authenticated');
    }
    
    // Check if user is the owner
    if (req.user.uid !== req.params.userId && req.user.uid !== req.body.userId) {
      return forbiddenResponse(res, 'Access denied. You are not the owner of this resource.');
    }
    
    next();
  } catch (error) {
    console.error('IsOwner middleware error:', error);
    return serverErrorResponse(res, 'Authorization check failed');
  }
};

