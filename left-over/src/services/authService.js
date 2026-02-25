// src/services/authService.js
import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data).then(res => res.data),
  register: (data) => api.post('/auth/register', data).then(res => res.data),
  getMe: () => api.get('/auth/me').then(res => res.data)
};