// ===================================================
// AuthContext.jsx — إدارة حالة المصادقة عالمياً
// يوفر بيانات المستخدم الحالي لكل مكونات التطبيق
// المسار: frontend/src/context/AuthContext.jsx
// ===================================================

import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true) // true أثناء قراءة localStorage

  // عند أول تحميل: استعادة الجلسة المحفوظة
  useEffect(() => {
    try {
      const token     = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('user_data')
      if (token && savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch {
      // بيانات تالفة — امسحها
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    } finally {
      setLoading(false)
    }
  }, [])

  // تسجيل الدخول — يُستدعى بعد نجاح الـ API
  const login = (userData, token) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_data', JSON.stringify(userData))
    setUser(userData)
  }

  // تسجيل الخروج
  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }

  // تحديث بيانات المستخدم (مثلاً بعد تعديل المهارات)
  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    localStorage.setItem('user_data', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook مختصر للاستخدام في أي مكون
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth يجب استخدامه داخل AuthProvider')
  return ctx
}
