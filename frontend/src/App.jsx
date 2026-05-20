// ===================================================
// App.jsx — الهيكل الجذري للتطبيق والـ Router
// يلف التطبيق بالـ Providers ويحدد مسارات الصفحات
// المسار: frontend/src/App.jsx
// ===================================================

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { LanguageProvider }      from './context/LanguageContext.jsx'

// الصفحات
import LandingPage  from './pages/LandingPage.jsx'
import Dashboard    from './pages/Dashboard.jsx'
import ProfileSetup from './pages/ProfileSetup.jsx'
import TaskDetail   from './pages/TaskDetail.jsx'
import CodeShield   from './pages/CodeShield.jsx'
import Login        from './pages/Auth/Login.jsx'
import Register     from './pages/Auth/Register.jsx'

// إعداد React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:     2,
      staleTime: 2 * 60 * 1000, // دقيقتان
    },
  },
})

// ─── حماية المسارات التي تحتاج تسجيل دخول ───
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return user ? children : <Navigate to="/login" replace />
}

// ─── منع الوصول للصفحات العامة بعد تسجيل الدخول ───
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return user ? <Navigate to="/dashboard" replace /> : children
}

// ─── شاشة التحميل الأولية ───
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#020617',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div style={{
        width: '40px', height: '40px',
        borderRadius: '50%',
        border: '2px solid #1e293b',
        borderTopColor: '#3b82f6',
        animation: 'spin .8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              {/* ── صفحات عامة ── */}
              <Route path="/" element={<LandingPage />} />

              {/* ── صفحات المصادقة (تُحوّل للـ Dashboard إذا مسجّل) ── */}
              <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

              {/* ── صفحات محمية (تحتاج تسجيل دخول) ── */}
              <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile"     element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
              <Route path="/task/:id"    element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
              <Route path="/code-shield" element={<PrivateRoute><CodeShield /></PrivateRoute>} />

              {/* ── مسار غير موجود ── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
