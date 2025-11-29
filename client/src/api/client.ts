import axios from 'axios';

const API_URL = '/api';

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
  createUrl: (originalUrl: string, title?: string, description?: string, expiresAt?: string) =>
    api.post('/urls/create', { originalUrl, title, description, expiresAt }),
  getUrls: () => api.get('/urls'),
  getAnalytics: (id: number) => api.get(`/urls/${id}/analytics`),
  deleteUrl: (id: number) => api.delete(`/urls/${id}`),
};

export default api;
