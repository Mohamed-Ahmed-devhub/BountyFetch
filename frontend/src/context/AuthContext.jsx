import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabase.js'
import api from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const buildUser = (sbUser, profile) => ({
    id:        sbUser.id,
    name:      profile?.name       || sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User',
    email:     sbUser.email,
    // profile table uses avatar_url; backend response exposes it as both
    avatar:    profile?.avatar_url || profile?.avatarUrl || sbUser.user_metadata?.avatar_url || null,
    avatarUrl: profile?.avatar_url || profile?.avatarUrl || sbUser.user_metadata?.avatar_url || null,
    bio:       profile?.bio        || '',
    skills:    profile?.skills     || [],
    role:      profile?.role       || 'freelancer',
    specialty: profile?.specialty  || '',
    jobTitle:  profile?.job_title  || profile?.jobTitle  || '',
    linkedinUrl: profile?.linkedin_url || profile?.linkedinUrl || '',
    githubUrl:   profile?.github_url   || profile?.githubUrl   || '',
    yearsExperience: profile?.years_experience || profile?.yearsExperience || null,
    // onboarded: true if DB says so, OR if user already has skills (existing users)
    onboarded: profile?.onboarded === true
               ? true
               : ((profile?.skills?.length || 0) > 0),
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
    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session?.user) setUser(await loadProfile(session.user))
      setLoading(false)
    })

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:', event)

        // FIX: Set loading=true while we load the profile after sign-in
        // This prevents PrivateWithOnboarding from seeing user=null momentarily
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setLoading(true)
        }

        setSession(session)

        if (session?.user) {
          if (event === 'SIGNED_IN') {
            await syncWithBackend(session.access_token)
          }
          const profile = await loadProfile(session.user)
          setUser(profile)
        } else {
          setUser(null)
          setSession(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUpWithEmail = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) throw error
    return data
  }

  const signInWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    }).then(({ error }) => { if (error) throw error })

  const signInWithGithub = () =>
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    }).then(({ error }) => { if (error) throw error })

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }))

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      signInWithEmail, signUpWithEmail,
      signInWithGoogle, signInWithGithub,
      logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth requires AuthProvider')
  return ctx
}
