// ===== Custom Hook لإدارة حالة المصادقة =====
// يوفر: بيانات المستخدم الحالي، دوال تسجيل الدخول والخروج
// يقرأ الـ JWT token من localStorage ويتحقق من صلاحيته
// TODO (الأسبوع 2): ربط بـ AuthContext وAPI

export function useAuth() {
  // TODO: قراءة بيانات المستخدم من AuthContext
  const user = null
  const isAuthenticated = !!user

  const login = async (email, password) => {
    // TODO: استدعاء /api/auth/login وتخزين الـ token
  }

  const logout = () => {
    // TODO: حذف الـ token وإعادة التوجيه للـ Landing Page
    localStorage.removeItem('token')
  }

  return { user, isAuthenticated, login, logout }
}
