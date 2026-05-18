// ===== سياق المصادقة العام =====
// يوفر بيانات المستخدم لكل مكوّنات التطبيق بدون تمرير props
// TODO (الأسبوع 2): إضافة منطق الـ JWT والتحقق من الجلسة

import { createContext, useContext, useState } from 'react'

// إنشاء السياق
const AuthContext = createContext(null)

// المزوّد: يلف التطبيق بالكامل في App.jsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // بيانات المستخدم الحالي

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('token', token) // حفظ الـ token
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook مخصص للوصول للسياق بسهولة
export const useAuthContext = () => useContext(AuthContext)
