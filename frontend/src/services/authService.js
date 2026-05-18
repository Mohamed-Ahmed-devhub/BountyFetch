// ===== خدمة المصادقة =====
// تسجيل الدخول، إنشاء الحساب، التحقق من الجلسة

import api from './api.js'

// تسجيل الدخول بالبريد وكلمة المرور
export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data // { user, token }
}

// إنشاء حساب جديد
export const register = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password })
  return data // { user, token }
}

// التحقق من صلاحية الـ token الحالي
export const verifyToken = async () => {
  const { data } = await api.get('/auth/me')
  return data.user
}
