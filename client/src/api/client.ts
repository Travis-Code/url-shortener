import axios from 'axios';

// Production API URL - direct call to Railway backend
// Use environment variable if available, otherwise use Railway in production or localhost in dev
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production'
    ? 'https://url-shortener-production-c83f.up.railway.app'
    : 'http://localhost:5001');

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  signup: (username: string, email: string, password: string) =>
    api.post('/api/auth/signup', { username, email, password }),
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
};

export const urlApi = {
  createUrl: (originalUrl: string, customShortCode?: string, title?: string, description?: string, expiresAt?: string) =>
    api.post('/api/urls/create', { originalUrl, customShortCode, title, description, expiresAt }),
  getUrls: () => api.get('/api/urls'),
  getAnalytics: (id: number) => api.get(`/api/urls/${id}/analytics`),
  deleteUrl: (id: number) => api.delete(`/api/urls/${id}`),
};

export const adminApi = {
  getStats: () => api.get('/api/admin/stats'),
  getUsers: (page = 1, limit = 20) => api.get(`/api/admin/users?page=${page}&limit=${limit}`),
  getUrls: (page = 1, limit = 20) => api.get(`/api/admin/urls?page=${page}&limit=${limit}`),
  getClicks: (page = 1, limit = 50) => api.get(`/api/admin/clicks?page=${page}&limit=${limit}`),
  deleteUrl: (id: number) => api.delete(`/api/admin/urls/${id}`),
  banUser: (id: number, banned: boolean) => api.patch(`/api/admin/users/${id}/ban`, { banned }),
};

export default api;
