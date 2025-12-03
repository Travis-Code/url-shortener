import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'client-boom-codes-projects.vercel.app' 
    ? 'https://url-shortener-production-c83f.up.railway.app/api'
    : '/api');

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
    api.post('/auth/signup', { username, email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const urlApi = {
  createUrl: (originalUrl: string, customShortCode?: string, title?: string, description?: string, expiresAt?: string) =>
    api.post('/urls/create', { originalUrl, customShortCode, title, description, expiresAt }),
  getUrls: () => api.get('/urls'),
  getAnalytics: (id: number) => api.get(`/urls/${id}/analytics`),
  deleteUrl: (id: number) => api.delete(`/urls/${id}`),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (page = 1, limit = 20) => api.get(`/admin/users?page=${page}&limit=${limit}`),
  getUrls: (page = 1, limit = 20) => api.get(`/admin/urls?page=${page}&limit=${limit}`),
  getClicks: (page = 1, limit = 50) => api.get(`/admin/clicks?page=${page}&limit=${limit}`),
  deleteUrl: (id: number) => api.delete(`/admin/urls/${id}`),
  banUser: (id: number, banned: boolean) => api.patch(`/admin/users/${id}/ban`, { banned }),
};

export default api;
