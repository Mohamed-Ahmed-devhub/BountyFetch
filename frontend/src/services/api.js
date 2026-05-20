// ===================================================
// api.js — Axios Instance الرئيسي
// كل طلبات الـ API تمر عبر هذا الملف
// المسار: frontend/src/services/api.js
// ===================================================

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

// ── إضافة الـ Token لكل طلب تلقائياً ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── معالجة انتهاء الجلسة مركزياً ──
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
