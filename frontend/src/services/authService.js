// ===================================================
// authService.js — خدمة المصادقة (Frontend)
// المسار: frontend/src/services/authService.js
// ===================================================

import api from './api.js'

export const authService = {
  register:     (data)   => api.post('/auth/register', data),
  login:        (data)   => api.post('/auth/login', data),
  getProfile:   ()       => api.get('/auth/profile'),
  updateSkills: (skills) => api.put('/auth/skills', { skills }),
}
