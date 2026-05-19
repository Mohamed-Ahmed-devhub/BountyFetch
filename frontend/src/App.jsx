// ===================================================
// App.jsx - الهيكل الرئيسي للتطبيق والـ Router
// يحدد مسارات الصفحات ويلف التطبيق بالـ Context Providers
// ===================================================
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// استيراد الـ Context Providers (إدارة الحالة العامة)
import { AuthProvider } from './context/AuthContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

// استيراد الصفحات
import LandingPage    from './pages/LandingPage.jsx'
import Dashboard      from './pages/Dashboard.jsx'
import ProfileSetup   from './pages/ProfileSetup.jsx'
import TaskDetail     from './pages/TaskDetail.jsx'
import CodeShield     from './pages/CodeShield.jsx'
import Login          from './pages/Auth/Login.jsx'
import Register       from './pages/Auth/Register.jsx'

// إعداد عميل الـ React Query لإدارة الـ API calls
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 2, // البيانات تعتبر قديمة بعد دقيقتين
    },
  },
})

function App() {
  return (
    // ترتيب الـ Providers: الأخارجي يلف الداخلي
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              {/* الصفحة الرئيسية - Landing Page */}
              <Route path="/"             element={<LandingPage />} />
              
              {/* صفحات التسجيل والدخول */}
              <Route path="/login"        element={<Login />} />
              <Route path="/register"     element={<Register />} />
              
              {/* صفحات التطبيق الرئيسية (تحتاج تسجيل دخول) */}
              <Route path="/dashboard"    element={<Dashboard />} />
              <Route path="/profile"      element={<ProfileSetup />} />
              <Route path="/task/:id"     element={<TaskDetail />} />
              <Route path="/code-shield"  element={<CodeShield />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
