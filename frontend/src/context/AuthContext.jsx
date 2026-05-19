// ===================================================
// AuthContext.jsx - إدارة حالة المستخدم عالمياً
// يوفر بيانات المستخدم الحالي لكل مكونات التطبيق
// ===================================================
import React, { createContext, useContext, useState, useEffect } from 'react'

// إنشاء الـ Context (الحاوية العامة للبيانات)
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // حالة المستخدم الحالي (null = غير مسجل)
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // عند فتح التطبيق: تحقق هل المستخدم مسجل مسبقاً
    const token = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_data')
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    setLoading(false)
  }, [])

  // دالة تسجيل الدخول - تُستدعى بعد نجاح الـ API
  const login = (userData, token) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_data', JSON.stringify(userData))
    setUser(userData)
  }

  // دالة تسجيل الخروج
  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Hook مخصص لاستخدام الـ Auth في أي مكون بسهولة
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth يجب استخدامه داخل AuthProvider')
  return context
}
