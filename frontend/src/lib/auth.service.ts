import api from './api';

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller';
  origin: string;
  category: string;
  photoURL?: string;
  sellerInfo?: {
    hasOutlet: boolean;
    outletId: string | null;
    joinedAsSellerAt: any;
  };
}

export const authService = {
  // Login using backend API
  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;

      // Store auth data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');

      return { user, token };
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register using backend API
  async register(userData: {
    email: string;
    password: string;
    name: string;
    origin: string;
    category: string;
  }) {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data.data;

      // Store auth data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');

      return { user, token };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Google Sign-In using Google Identity Services
  async googleSignIn(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if Google Sign-In API is loaded
      if (typeof window === 'undefined' || !window.google) {
        reject(new Error('Google Sign-In script belum dimuat. Silakan refresh page.'));
        return;
      }

      try {
        // Configure Google Sign-In
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        
        if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
          reject(new Error('Google Client ID belum dikonfigurasi. Silakan setup di .env file.'));
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            try {
              // Decode JWT token to get user info
              const credential = response.credential;
              const payload = JSON.parse(atob(credential.split('.')[1]));

              // Send to backend
              const backendResponse = await api.post('/auth/google-signin', {
                idToken: credential,
                email: payload.email,
                displayName: payload.name,
                photoURL: payload.picture,
                uid: payload.sub // Google user ID
              });

              const { user, token, isNewUser } = backendResponse.data.data;

              // Store auth data
              localStorage.setItem('authToken', token);
              localStorage.setItem('user', JSON.stringify(user));
              localStorage.setItem('isLoggedIn', 'true');

              resolve({ user, token, isNewUser });
            } catch (error: any) {
              console.error('Google Sign-In backend error:', error);
              reject(error);
            }
          },
        });

        // Show Google One Tap or render button
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('One Tap not displayed, will use button instead');
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  // Logout
  async logout() {
    try {
      // Call backend logout endpoint (optional but good for tracking)
      if (localStorage.getItem('authToken')) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Backend logout error:', error);
    } finally {
      // Clear local storage regardless of backend logout success
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userAccount');
      localStorage.removeItem('onboardingCompleted');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('outlet');
    }
  },

  // Get current user from localStorage
  getCurrentUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem('user');
      const isLoggedIn = localStorage.getItem('isLoggedIn');

      if (!userStr || !isLoggedIn) {
        return null;
      }

      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken') && localStorage.getItem('isLoggedIn') === 'true';
  },

  // Get current auth token
  async getToken(): Promise<string | null> {
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Update user data in localStorage
  updateUserData(userData: Partial<AuthUser>) {
    try {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error('Error updating user data:', error);
      return null;
    }
  },

  // Update user profile in backend
  async updateProfile(userData: { origin?: string; category?: string; phoneNumber?: string }) {
    try {
      const response = await api.put('/users/profile', userData);
      const updatedUser = response.data.data;

      // Update localStorage
      this.updateUserData(updatedUser);

      return updatedUser;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};