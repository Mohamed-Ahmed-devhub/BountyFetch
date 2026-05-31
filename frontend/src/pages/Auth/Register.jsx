import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import Navbar from '../../components/layout/Navbar.jsx'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.216.69.825.573C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

function StrengthBar({ pw }) {
  const score = [pw.length >= 6, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length
  const colors = ['#DC3545', '#FFC107', '#28A745', '#002D62']
  return (
    <div style={{ marginTop: '.3rem', display: 'flex', gap: '.25rem' }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= score ? colors[score-1] : '#D8DEE9', transition: 'background .3s' }} />
      ))}
    </div>
  )
}

export default function Register() {
  const { signUpWithEmail, signInWithGoogle, signInWithGithub } = useAuth()
  const { isRTL } = useLanguage()
  const navigate = useNavigate()

  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading]   = useState(false)
  const [oauthLoad, setOauth]   = useState('')
  const [error, setError]       = useState('')
  const [showPass, setShowPass] = useState(false)
  const [step, setStep]         = useState('form') // 'form' | 'confirm'

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submitEmail = async e => {
    e.preventDefault()
    setError('')

    if (!form.name.trim())        { setError(isRTL ? 'الاسم مطلوب' : 'Name is required'); return }
    if (!form.email.trim())       { setError(isRTL ? 'البريد مطلوب' : 'Email is required'); return }
    if (form.password.length < 6) { setError(isRTL ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be 6+ chars'); return }
    if (form.password !== form.confirm) { setError(isRTL ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'); return }

    setLoading(true)
    try {
      const data = await signUpWithEmail(form.email, form.password, form.name)
      console.log('✅ signUp data:', JSON.stringify({ user: data?.user?.id, session: !!data?.session, identities: data?.user?.identities?.length }))

      // بريد مكرر
      if (data?.user?.identities?.length === 0) {
        setError(isRTL ? 'هذا البريد مسجّل بالفعل — سجّل دخولك' : 'Email already registered — sign in instead')
        return
      }

      if (data?.session) {
        // ✅ Email confirmation معطّل — دخل مباشرة
        navigate('/onboarding')
      } else {
        // ✅ Email confirmation مفعّل — اعرض شاشة الانتظار
        setStep('confirm')
      }
    } catch (err) {
      console.error('❌ signUp error:', err)
      const msg = err.message || ''
      if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError(isRTL ? 'هذا البريد مسجّل بالفعل' : 'Email already registered')
      } else if (msg.includes('Invalid email')) {
        setError(isRTL ? 'بريد إلكتروني غير صالح' : 'Invalid email')
      } else if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
        setError(isRTL ? 'تم إرسال رسالة مؤخراً — انتظر دقيقة ثم حاول مجدداً' : 'Email recently sent — wait a minute and try again')
      } else {
        setError(msg || (isRTL ? 'فشل التسجيل' : 'Registration failed'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setOauth('google'); setError('')
    try { await signInWithGoogle() }
    catch { setError(isRTL ? 'فشل Google' : 'Google sign-in failed'); setOauth('') }
  }

  const handleGithub = async () => {
    setOauth('github'); setError('')
    try { await signInWithGithub() }
    catch { setError(isRTL ? 'فشل GitHub' : 'GitHub sign-in failed'); setOauth('') }
  }

  const inp = {
    background: '#FAFBFC', border: '1.5px solid #D8DEE9', borderRadius: 9,
    padding: '.62rem .9rem', fontSize: '.875rem', color: '#1A1A2E',
    width: '100%', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  // ── شاشة تأكيد البريد ──
  if (step === 'confirm') {
    return (
      <div style={{ background: '#F4F6F9', minHeight: '100vh' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
          <div style={{ width: '100%', maxWidth: 440, background: '#fff', border: '1px solid #D8DEE9', borderRadius: 16, padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,45,98,.08)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#002D62', margin: '0 0 .75rem' }}>
              {isRTL ? 'تحقق من بريدك الإلكتروني' : 'Check your email'}
            </h2>
            <p style={{ color: '#5A6478', fontSize: '.9rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
              {isRTL
                ? <>أرسلنا رابط تأكيد إلى<br /><strong style={{ color: '#002D62' }}>{form.email}</strong><br />اضغط على الرابط لتفعيل حسابك والدخول</>
                : <>We sent a confirmation link to<br /><strong style={{ color: '#002D62' }}>{form.email}</strong><br />Click it to activate your account</>
              }
            </p>

            {/* ── تعليمات Supabase ── */}
            <div style={{ background: '#FFF9EC', border: '1px solid #FDE68A', borderRadius: 10, padding: '1rem', fontSize: '.8rem', color: '#78350F', textAlign: isRTL ? 'right' : 'left', marginBottom: '1.25rem' }}>
              <strong>⚠️ {isRTL ? 'الإيميل مش وصل؟' : "Email not arriving?"}</strong>
              <ul style={{ margin: '.5rem 0 0', paddingInlineStart: '1.2rem', lineHeight: 1.8 }}>
                <li>{isRTL ? 'تحقق من مجلد Spam / Junk' : 'Check Spam / Junk folder'}</li>
                <li>{isRTL ? 'قد يتأخر 1–2 دقيقة' : 'May take 1–2 minutes'}</li>
                <li>
                  {isRTL
                    ? <>أو <strong>عطّل Email Confirmation</strong> من Supabase Dashboard ← Authentication ← Providers ← Email ← <em>"Confirm email"</em> ← أوقفه</>
                    : <>Or <strong>disable Email Confirmation</strong> in Supabase Dashboard → Authentication → Providers → Email → uncheck <em>"Confirm email"</em></>
                  }
                </li>
              </ul>
            </div>

            <button onClick={() => setStep('form')} style={{
              background: 'none', border: '1.5px solid #D8DEE9', borderRadius: 9, padding: '.6rem 1.5rem',
              fontSize: '.85rem', color: '#5A6478', cursor: 'pointer', fontWeight: 600,
            }}>
              {isRTL ? '← رجوع للتسجيل' : '← Back to Register'}
            </button>

            <p style={{ marginTop: '1rem', fontSize: '.8rem', color: '#94A3B8' }}>
              {isRTL ? 'لديك حساب؟' : 'Have an account?'}{' '}
              <Link to="/login" style={{ color: '#002D62', fontWeight: 700 }}>{isRTL ? 'سجّل دخولك' : 'Sign in'}</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── شاشة الفورم ──
  return (
    <div style={{ background: '#F4F6F9', minHeight: '100vh', overflowX: 'hidden' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 440, background: '#fff', border: '1px solid #D8DEE9', borderRadius: 16, padding: '2.25rem', boxShadow: '0 4px 24px rgba(0,45,98,.08)' }}>

          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#002D62', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.2rem', margin: '0 auto .75rem' }}>B</div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#002D62', margin: 0 }}>
              {isRTL ? 'انضم إلى الصيادين 🎯' : 'Join the Hunters 🎯'}
            </h1>
            <p style={{ fontSize: '.85rem', color: '#5A6478', margin: '.3rem 0 0' }}>
              {isRTL ? 'أنشئ حسابك المجاني الآن' : 'Create your free account now'}
            </p>
          </div>

          {/* OAuth */}
          <div style={{ display: 'flex', gap: '.65rem', marginBottom: '1.25rem' }}>
            {[
              { id: 'google', label: 'Google', icon: <GoogleIcon />, color: '#4285F4', fn: handleGoogle },
              { id: 'github', label: 'GitHub', icon: <GithubIcon />, color: '#1A1A2E', fn: handleGithub },
            ].map(btn => (
              <button key={btn.id} onClick={btn.fn} disabled={!!oauthLoad || loading} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
                padding: '.62rem', borderRadius: 9, border: '1.5px solid #D8DEE9', background: '#fff',
                fontSize: '.85rem', fontWeight: 600, color: '#1A1A2E',
                cursor: (oauthLoad || loading) ? 'not-allowed' : 'pointer',
                opacity: (oauthLoad && oauthLoad !== btn.id) ? .5 : 1,
              }}>
                {oauthLoad === btn.id
                  ? <span style={{ width: 16, height: 16, border: `2px solid #eee`, borderTopColor: btn.color, borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
                  : btn.icon}
                {btn.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            <span style={{ fontSize: '.75rem', color: '#94A3B8' }}>{isRTL ? 'أو بالبريد' : 'or with email'}</span>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '.7rem 1rem', fontSize: '.83rem', color: '#DC3545', marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submitEmail} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
            {[
              { name: 'name',     type: 'text',                          ar: 'الاسم الكامل',      en: 'Full Name',       ph: isRTL ? 'محمد أحمد' : 'John Doe' },
              { name: 'email',    type: 'email',                         ar: 'البريد الإلكتروني', en: 'Email',           ph: 'you@example.com' },
              { name: 'password', type: showPass ? 'text' : 'password',  ar: 'كلمة المرور',       en: 'Password',        ph: '6+ chars', toggle: true, strength: true },
              { name: 'confirm',  type: showPass ? 'text' : 'password',  ar: 'تأكيد كلمة المرور', en: 'Confirm Password', ph: '••••••••' },
            ].map(f => (
              <div key={f.name}>
                <label style={{ fontSize: '.75rem', fontWeight: 600, color: '#5A6478', display: 'block', marginBottom: '.3rem' }}>
                  {isRTL ? f.ar : f.en}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={f.type} name={f.name} value={form[f.name]} onChange={handle}
                    placeholder={f.ph} style={inp}
                    autoComplete={f.name === 'password' || f.name === 'confirm' ? 'new-password' : f.name}
                    onFocus={e => e.target.style.borderColor = '#002D62'}
                    onBlur={e => e.target.style.borderColor = '#D8DEE9'}
                  />
                  {f.toggle && (
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      style={{ position: 'absolute', insetInlineEnd: '.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', opacity: .5 }}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  )}
                </div>
                {f.strength && form.password && <StrengthBar pw={form.password} />}
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              padding: '.8rem', borderRadius: 10, background: loading ? '#6B7280' : '#002D62',
              color: '#fff', fontWeight: 700, fontSize: '.95rem', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
            }}>
              {loading
                ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />{isRTL ? 'جاري التسجيل...' : 'Creating...'}</>
                : isRTL ? '← إنشاء الحساب' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '.82rem', color: '#5A6478', marginTop: '1.4rem', marginBottom: 0 }}>
            {isRTL ? 'لديك حساب؟' : 'Already have an account?'}{' '}
            <Link to="/login" style={{ color: '#002D62', fontWeight: 700, textDecoration: 'none' }}>
              {isRTL ? 'سجّل دخولك' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
