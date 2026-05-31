<<<<<<< HEAD
import api from './api.js'
export const authService = {
  supabaseSync: token => api.post('/auth/supabase-sync', { access_token: token }),
  getProfile:   ()    => api.get('/auth/profile'),
  updateSkills: skills => api.put('/auth/skills', { skills }),
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
}
