
import axios from 'axios';

// Debug environment variables in development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:');
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('Mode:', import.meta.env.MODE);
}

// Fallback untuk production jika env variable tidak tersedia
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://reog-commerce-be.vercel.app/api';

// Log di production untuk debugging
if (import.meta.env.PROD) {
  console.log('🚀 Production API URL:', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    // Log request di development
    if (import.meta.env.DEV) {
      console.log('📡 API Request:', config.method?.toUpperCase(), config.url);
    }
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    // Log response di development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    return response;
  },
  async (error) => {
    // Log error untuk debugging
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      baseURL: error.config?.baseURL,
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
