<<<<<<< HEAD
import axios from 'axios'
import { supabase } from './supabase.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async config => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) config.headers.Authorization = `Bearer ${session.access_token}`
  return config
})

api.interceptors.response.use(r => r, async err => {
  if (err.response?.status === 401) { await supabase.auth.signOut(); window.location.href = '/login' }
  return Promise.reject(err)
})
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a

export default api
