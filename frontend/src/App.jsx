<<<<<<< HEAD
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { LanguageProvider }      from './context/LanguageContext.jsx'

import LandingPage      from './pages/LandingPage.jsx'
import Dashboard        from './pages/Dashboard.jsx'
import Onboarding       from './pages/Onboarding.jsx'
import ProfileSetup     from './pages/ProfileSetup.jsx'
import TaskDetail       from './pages/TaskDetail.jsx'
import CodeShield       from './pages/CodeShield.jsx'
import DevHub           from './pages/DevHub.jsx'
import MyApplications   from './pages/MyApplications.jsx'
import Support          from './pages/Support.jsx'
import Login            from './pages/Auth/Login.jsx'
import Register         from './pages/Auth/Register.jsx'

const qc = new QueryClient({ defaultOptions:{ queries:{ retry:2, staleTime:120000 } } })

function Loader() {
  return (
    <div style={{ minHeight:'100vh', background:'#F4F6F9', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:38, height:38, border:'2.5px solid #D8DEE9', borderTopColor:'#002D62', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function Private({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

// ✅ FIX: نقل منطق onboarding redirect هنا بشكل صريح ومنفصل
function PrivateWithOnboarding({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  // ✅ FIX: نتحقق من onboarded فقط في الصفحات المحمية — مش في /onboarding نفسها
  if (!user.onboarded) return <Navigate to="/onboarding" replace />
  return children
}

function Public({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return children
  // ✅ FIX: المستخدم المسجل يذهب للـ onboarding إذا لم ينتهِ منه، وإلا للـ dashboard
  return <Navigate to={user.onboarded ? '/dashboard' : '/onboarding'} replace />
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
<<<<<<< HEAD
              <Route path="/"                element={<LandingPage />} />
              <Route path="/login"           element={<Public><Login /></Public>} />
              <Route path="/register"        element={<Public><Register /></Public>} />
              {/* ✅ FIX: /onboarding يحتاج login لكن لا يتحقق من onboarded (لا redirect loop) */}
              <Route path="/onboarding"      element={<Private><Onboarding /></Private>} />
              {/* الصفحات المحمية تتطلب onboarding مكتمل */}
              <Route path="/dashboard"       element={<PrivateWithOnboarding><Dashboard /></PrivateWithOnboarding>} />
              <Route path="/profile"         element={<Private><ProfileSetup /></Private>} />
              <Route path="/task/:id"        element={<PrivateWithOnboarding><TaskDetail /></PrivateWithOnboarding>} />
              <Route path="/code-shield"     element={<PrivateWithOnboarding><CodeShield /></PrivateWithOnboarding>} />
              <Route path="/hub"             element={<PrivateWithOnboarding><DevHub /></PrivateWithOnboarding>} />
              <Route path="/my-applications" element={<PrivateWithOnboarding><MyApplications /></PrivateWithOnboarding>} />
              <Route path="/support"         element={<PrivateWithOnboarding><Support /></PrivateWithOnboarding>} />
              <Route path="*"               element={<Navigate to="/" replace />} />
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
<<<<<<< HEAD
=======

export default App
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
