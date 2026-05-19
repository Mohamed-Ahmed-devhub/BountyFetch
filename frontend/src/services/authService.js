// ===================================================
// authService.js - عمليات التسجيل وتسجيل الدخول
// ===================================================
import api from './api.js'

export const authService = {
  // تسجيل مستخدم جديد
  register: (userData) => {
    return api.post('/auth/register', userData)
  },

  // تسجيل الدخول
  login: (credentials) => {
    return api.post('/auth/login', credentials)
  },

  // جلب بيانات المستخدم الحالي
  getProfile: () => {
    return api.get('/auth/profile')
  },

  // تحديث مهارات المستخدم
  updateSkills: (skills) => {
    return api.put('/auth/skills', { skills })
  },
}
