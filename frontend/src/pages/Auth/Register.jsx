// ===================================================
// Register.jsx — صفحة التسجيل الجديد
// المسار: frontend/src/pages/Auth/Register.jsx
// ===================================================

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { authService } from '../../services/authService.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import Navbar from '../../components/layout/Navbar.jsx'
import { AuthStyles } from './Login.jsx'

export default function Register() {
  const { login }         = useAuth()
  const { isRTL }         = useLanguage()
  const navigate          = useNavigate()

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    // تحقق من تطابق كلمة المرور
    if (form.password !== form.confirm) {
      setError(isRTL ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const res = await authService.register({
        name:     form.name,
        email:    form.email,
        password: form.password,
      })
      login(res.data.user, res.data.token)
      navigate('/profile') // بعد التسجيل يذهب لصفحة اختيار المهارات
    } catch (err) {
      setError(err.response?.data?.message || (isRTL ? 'فشل التسجيل — حاول مجدداً' : 'Registration failed — please try again'))
    } finally { setLoading(false) }
  }

  const fields = [
    {
      name: 'name', type: 'text',
      labelAr: 'الاسم الكامل', labelEn: 'Full Name',
      placeholderAr: 'اسمك الكامل', placeholderEn: 'Your full name',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'email', type: 'email',
      labelAr: 'البريد الإلكتروني', labelEn: 'Email Address',
      placeholderAr: 'example@email.com', placeholderEn: 'you@example.com',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
    },
    {
      name: 'password', type: showPass ? 'text' : 'password',
      labelAr: 'كلمة المرور', labelEn: 'Password',
      placeholderAr: '٦ أحرف على الأقل', placeholderEn: 'At least 6 characters',
      hasToggle: true,
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'confirm', type: showPass ? 'text' : 'password',
      labelAr: 'تأكيد كلمة المرور', labelEn: 'Confirm Password',
      placeholderAr: 'أعد كتابة كلمة المرور', placeholderEn: 'Re-enter your password',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
  ]

  return (
    <div className="auth-root" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="auth-page">
        <div className="auth-glow" aria-hidden="true" />

        <div className="auth-card" style={{ maxWidth: '460px' }}>

          {/* رأس البطاقة */}
          <div className="auth-head">
            <Link to="/" className="auth-logo">
              <span style={{ color: '#3b82f6', fontSize: '1.5rem' }}>◈</span>
              <span>BountyFetch</span>
            </Link>
            <h1 className="auth-title">
              {isRTL ? 'انضم إلى الصيادين 🎯' : 'Join the Hunters 🎯'}
            </h1>
            <p className="auth-sub">
              {isRTL ? 'أنشئ حسابك المجاني وابدأ الاصطياد الآن' : 'Create your free account and start hunting now'}
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
            {fields.map(field => (
              <div className="auth-field" key={field.name}>
                <label className="auth-label">
                  {isRTL ? field.labelAr : field.labelEn}
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">{field.icon}</span>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={isRTL ? field.placeholderAr : field.placeholderEn}
                    className="auth-input"
                    required
                    autoComplete={
                      field.name === 'name'     ? 'name' :
                      field.name === 'email'    ? 'email' :
                      field.name === 'password' ? 'new-password' : 'new-password'
                    }
                  />
                  {field.hasToggle && (
                    <button type="button" className="auth-eye" onClick={() => setShowPass(v => !v)}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* مؤشر قوة كلمة المرور */}
            {form.password && (
              <PasswordStrength password={form.password} isRTL={isRTL} />
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <><span className="auth-spinner" /> {isRTL ? 'جاري التسجيل...' : 'Creating account...'}</>
              ) : (
                isRTL ? 'إنشاء الحساب ←' : '→ Create Account'
              )}
            </button>
          </form>

          {/* رابط الدخول */}
          <p className="auth-switch">
            {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
            <Link to="/login" className="auth-link">
              {isRTL ? 'سجّل دخولك' : 'Sign in'}
            </Link>
          </p>

          {/* ملاحظة الخصوصية */}
          <p style={{
            fontSize: '.7rem', color: '#334155',
            textAlign: 'center', margin: 0, lineHeight: 1.6,
          }}>
            {isRTL
              ? 'بالتسجيل، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بـ BountyFetch'
              : 'By signing up, you agree to BountyFetch Terms of Service and Privacy Policy'}
          </p>
        </div>
      </div>

      <AuthStyles />
    </div>
  )
}

// ─── مكوّن مؤشر قوة كلمة المرور ───
function PasswordStrength({ password, isRTL }) {
  const checks = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score   = checks.filter(Boolean).length
  const colors  = ['#f87171', '#fbbf24', '#34d399', '#3b82f6']
  const labelsAr = ['ضعيفة', 'مقبولة', 'جيدة', 'قوية جداً']
  const labelsEn = ['Weak', 'Fair', 'Good', 'Strong']
  const color    = colors[score - 1] || '#334155'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
      <div style={{ display: 'flex', gap: '.3rem' }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: '3px', borderRadius: '99px',
            background: i <= score ? color : '#1e293b',
            transition: 'background .3s',
          }} />
        ))}
      </div>
      <p style={{ fontSize: '.68rem', color, margin: 0, fontWeight: 600 }}>
        {score > 0 ? (isRTL ? labelsAr[score-1] : labelsEn[score-1]) : ''}
      </p>
    </div>
  )
}
