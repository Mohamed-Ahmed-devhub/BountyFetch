// ===== الـ Axios Instance المركزي =====
// كل طلبات الـ API تمر من هنا لضمان إضافة الـ token تلقائياً
// وإدارة الأخطاء بشكل موحد

import axios from 'axios'

// إنشاء instance مخصص بالإعدادات الأساسية
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api', // عنوان الـ Backend
  timeout: 10000, // مهلة الطلب: 10 ثواني
  headers: { 'Content-Type': 'application/json' }
})

// Interceptor: يضيف الـ JWT token لكل طلب تلقائياً
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: إدارة الأخطاء العامة
api.interceptors.response.use(
  (response) => response, // نجح الطلب، أعد الرد كما هو
  (error) => {
    if (error.response?.status === 401) {
      // انتهت الجلسة، أعد للـ Login
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
