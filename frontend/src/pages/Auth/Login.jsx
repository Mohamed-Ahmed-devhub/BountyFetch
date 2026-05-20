// ===================================================
// Login.jsx — صفحة تسجيل الدخول
// تصميم داكن احترافي متوافق مع البراند الكامل
// المسار: frontend/src/pages/Auth/Login.jsx
// ===================================================

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { authService } from '../../services/authService.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import Navbar from '../../components/layout/Navbar.jsx'

export default function Login() {
  const { login }            = useAuth()
  const { isRTL, toggleLanguage, language } = useLanguage()
  const navigate             = useNavigate()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill all fields')
      return
    }
    setLoading(true); setError('')
    try {
      const res = await authService.login(form)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || (isRTL ? 'بيانات غير صحيحة' : 'Invalid credentials'))
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-root" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="auth-page">
        {/* توهج خلفي */}
        <div className="auth-glow" aria-hidden="true" />

        <div className="auth-card">

          {/* رأس البطاقة */}
          <div className="auth-head">
            <Link to="/" className="auth-logo">
              <span style={{ color: '#3b82f6', fontSize: '1.5rem' }}>◈</span>
              <span>BountyFetch</span>
            </Link>
            <h1 className="auth-title">
              {isRTL ? 'أهلاً بعودتك 👋' : 'Welcome Back 👋'}
            </h1>
            <p className="auth-sub">
              {isRTL ? 'سجّل دخولك لمتابعة الاصطياد' : 'Sign in to continue hunting'}
            </p>
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* النموذج */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label">
                {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange}
                  placeholder={isRTL ? 'example@email.com' : 'you@example.com'}
                  className="auth-input"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">
                {isRTL ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="auth-input"
                  autoComplete="current-password"
                  required
                />
                <button type="button" className="auth-eye" onClick={() => setShowPass(v => !v)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <><span className="auth-spinner" /> {isRTL ? 'جاري الدخول...' : 'Signing in...'}</>
              ) : (
                isRTL ? 'دخول ←' : '→ Sign In'
              )}
            </button>
          </form>

          {/* رابط التسجيل */}
          <p className="auth-switch">
            {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
            <Link to="/register" className="auth-link">
              {isRTL ? 'أنشئ حساباً مجاناً' : 'Create free account'}
            </Link>
          </p>
        </div>
      </div>

      <AuthStyles />
    </div>
  )
}

// ─── الأنماط المشتركة ───
export function AuthStyles() {
  return (
    <style>{`
      .auth-root {
        min-height: 100vh;
        background: #020617;
        color: #f1f5f9;
        font-family: 'DM Sans','Tajawal',system-ui,sans-serif;
      }
      .auth-page {
        min-height: calc(100vh - 64px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 1rem;
        position: relative;
      }
      .auth-glow {
        position: absolute;
        width: 500px; height: 500px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(37,99,235,.15), transparent 70%);
        top: 50%; left: 50%;
        transform: translate(-50%,-50%);
        pointer-events: none;
      }
      .auth-card {
        position: relative;
        width: 100%;
        max-width: 420px;
        background: #0f172a;
        border: 1px solid #1e293b;
        border-radius: 20px;
        padding: 2.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      @media (max-width: 480px) { .auth-card { padding: 1.75rem 1.25rem; } }

      .auth-head { display: flex; flex-direction: column; gap: .55rem; }
      .auth-logo {
        display: flex; align-items: center; gap: .4rem;
        text-decoration: none;
        font-family: 'Syne',system-ui,sans-serif;
        font-size: .9rem; font-weight: 800; color: #f1f5f9;
        margin-bottom: .5rem;
      }
      .auth-title {
        font-family: 'Syne',system-ui,sans-serif;
        font-size: 1.5rem; font-weight: 800;
        letter-spacing: -.025em; margin: 0;
      }
      .auth-sub { font-size: .875rem; color: #64748b; margin: 0; }

      .auth-error {
        background: rgba(248,113,113,.08);
        border: 1px solid rgba(248,113,113,.25);
        border-radius: 10px;
        padding: .75rem 1rem;
        font-size: .82rem;
        color: #fca5a5;
        display: flex; align-items: center; gap: .4rem;
      }

      .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
      .auth-field { display: flex; flex-direction: column; gap: .45rem; }
      .auth-label {
        font-size: .75rem; font-weight: 600;
        letter-spacing: .04em;
        color: #94a3b8;
      }
      .auth-input-wrap {
        position: relative;
        display: flex; align-items: center;
      }
      .auth-input-icon {
        position: absolute;
        inset-inline-start: .9rem;
        color: #475569;
        pointer-events: none;
        flex-shrink: 0;
      }
      .auth-input {
        width: 100%;
        background: #020617;
        border: 1px solid #1e293b;
        border-radius: 11px;
        padding: .7rem .9rem .7rem 2.65rem;
        color: #f1f5f9;
        font-size: .875rem;
        font-family: inherit;
        outline: none;
        transition: border-color .2s, box-shadow .2s;
      }
      [dir="rtl"] .auth-input { padding: .7rem 2.65rem .7rem .9rem; }
      .auth-input:focus {
        border-color: rgba(59,130,246,.5);
        box-shadow: 0 0 0 3px rgba(59,130,246,.08);
      }
      .auth-input::placeholder { color: #334155; }
      .auth-eye {
        position: absolute;
        inset-inline-end: .75rem;
        background: none; border: none;
        cursor: pointer; font-size: .9rem;
        padding: .2rem;
        opacity: .6;
        transition: opacity .2s;
      }
      .auth-eye:hover { opacity: 1; }

      .auth-submit {
        width: 100%;
        padding: .85rem;
        border-radius: 12px;
        border: none;
        background: linear-gradient(135deg, #2563eb, #0ea5e9);
        color: #fff;
        font-size: .95rem;
        font-weight: 700;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center; gap: .5rem;
        transition: all .2s;
        margin-top: .25rem;
      }
      .auth-submit:hover:not(:disabled) {
        box-shadow: 0 8px 25px rgba(37,99,235,.45);
        transform: translateY(-1px);
      }
      .auth-submit:disabled { opacity: .55; cursor: not-allowed; }

      .auth-spinner {
        width: 16px; height: 16px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,.35);
        border-top-color: #fff;
        animation: authSpin .75s linear infinite;
        flex-shrink: 0;
      }
      @keyframes authSpin { to { transform: rotate(360deg); } }

      .auth-switch {
        text-align: center;
        font-size: .82rem;
        color: #64748b;
        margin: 0;
      }
      .auth-link {
        color: #3b82f6;
        text-decoration: none;
        font-weight: 600;
        transition: color .2s;
      }
      .auth-link:hover { color: #60a5fa; }
    `}</style>
  )
}
