// ===================================================
// Login.jsx - صفحة تسجيل الدخول
// ===================================================
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext.jsx'
import { authService } from '../../services/authService.js'
import Button from '../../components/ui/Button.jsx'
import Navbar from '../../components/layout/Navbar.jsx'

function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await authService.login(form)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="flex items-center justify-center min-h-[85vh] px-4">
        <div className="w-full max-w-sm glass-card p-8">
          <h1 className="text-2xl font-black text-brand-cyan mb-6 text-center">
            {t('auth.login_title')}
          </h1>

          {/* رسالة الخطأ */}
          {error && (
            <p className="text-neon-red text-sm text-center mb-4 p-3 bg-neon-red/10 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">{t('auth.email')}</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">{t('auth.password')}</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
            <Button variant="primary" onClick={handleSubmit} loading={loading} className="w-full justify-center mt-2">
              {t('auth.login_btn')}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="text-brand-cyan hover:underline">
              {t('nav.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
