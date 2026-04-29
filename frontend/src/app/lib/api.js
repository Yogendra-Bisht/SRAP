import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Auto-attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nest_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
