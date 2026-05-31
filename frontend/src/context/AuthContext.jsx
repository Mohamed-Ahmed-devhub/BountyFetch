<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabase.js'
import api from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const buildUser = (sbUser, profile) => ({
    id:        sbUser.id,
    name:      profile?.name  || sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User',
    email:     sbUser.email,
    avatar:    profile?.avatar_url || sbUser.user_metadata?.avatar_url || null,
    bio:       profile?.bio        || '',
    skills:    profile?.skills     || [],
    role:      profile?.role       || 'freelancer',
    specialty: profile?.specialty  || '',
    onboarded: profile?.onboarded  || false,
  })

  const loadProfile = async (sbUser) => {
    try {
      const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', sbUser.id).single()
      return buildUser(sbUser, profile || null)
    } catch (e) {
      console.warn('⚠️ loadProfile fallback:', e.message)
      return buildUser(sbUser, null)
    }
  }

  const syncWithBackend = async (accessToken) => {
    if (!accessToken) return
    try {
      await api.post('/auth/supabase-sync', { access_token: accessToken })
    } catch (e) {
      console.warn('⚠️ Backend sync (non-fatal):', e.message)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session?.user) setUser(await loadProfile(session.user))
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth event:', event)
      setSession(session)
      if (session?.user) {
        if (event === 'SIGNED_IN') await syncWithBackend(session.access_token)
        setUser(await loadProfile(session.user))
      } else {
        setUser(null)
        setSession(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ✅ signUpWithEmail — يدعم الحالتين: مع وبدون email confirmation
  const signUpWithEmail = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        // emailRedirectTo لو أردت تحديد رابط redirect بعد تأكيد الإيميل
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) throw error
    return data
  }

  const signInWithEmail  = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } })
      .then(({ error }) => { if (error) throw error })

  const signInWithGithub = () =>
    supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: `${window.location.origin}/dashboard` } })
      .then(({ error }) => { if (error) throw error })

  const logout     = async () => { await supabase.auth.signOut(); setUser(null); setSession(null) }
  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }))

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGithub, logout, updateUser }}>
      {children}
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
    </AuthContext.Provider>
  )
}

<<<<<<< HEAD
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth requires AuthProvider')
  return ctx
=======
// Hook مخصص لاستخدام الـ Auth في أي مكون بسهولة
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth يجب استخدامه داخل AuthProvider')
  return context
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
}
