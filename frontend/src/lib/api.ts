
import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
  // Development
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  }
  
  // Production - langsung hardcode untuk memastikan
  return 'https://reog-commerce-be.vercel.app/api';
};

const API_BASE_URL = getApiUrl();

// Log untuk debugging
console.log('🚀 API URL:', API_BASE_URL);
console.log('📍 Mode:', import.meta.env.MODE);
console.log('� VITE_API_URL env:', import.meta.env.VITE_API_URL);

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
