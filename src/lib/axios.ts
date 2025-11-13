import axios from 'axios';

// URL base del backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Configuración global de axios para Sanctum
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Necesario para Sanctum con cookies
  timeout: 45000, 
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Manejo global de errores
    if (error.response?.status === 401) {
      // Redirigir a login si no está autorizado
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;