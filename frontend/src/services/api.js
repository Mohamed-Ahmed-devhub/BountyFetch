// ===================================================
// api.js - الـ Axios Instance الرئيسي
// كل طلبات الـ API تمر عبر هذا الملف
// ===================================================
import axios from 'axios'

// إنشاء نسخة Axios مع الإعدادات الافتراضية
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000, // 15 ثانية حد أقصى للانتظار
  headers: {
    'Content-Type': 'application/json',
  },
})

// --- Interceptor للطلبات: إضافة الـ Token تلقائياً ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// --- Interceptor للردود: معالجة الأخطاء بشكل مركزي ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // إذا انتهت صلاحية الـ Token، أعد توجيه المستخدم لصفحة الدخول
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
