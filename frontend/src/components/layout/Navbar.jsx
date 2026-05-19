// ===================================================
// Navbar.jsx - شريط التنقل العلوي
// يحتوي على: اسم التطبيق، روابط التنقل، زر تغيير اللغة
// ===================================================
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import Button from '../ui/Button.jsx'

function Navbar() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { language, toggleLanguage } = useLanguage()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* شعار التطبيق */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <span className="neon-text font-bold text-lg hidden sm:block">
            {t('app.name')}
          </span>
        </Link>

        {/* روابط التنقل + الأدوات */}
        <div className="flex items-center gap-3">
          
          {/* زر تغيير اللغة */}
          <button
            onClick={toggleLanguage}
            className="text-sm px-3 py-1.5 rounded-lg border border-brand-border text-gray-400 hover:text-brand-cyan hover:border-brand-cyan transition-all"
            title="تغيير اللغة / Change Language"
          >
            {language === 'ar' ? 'EN' : 'عربي'}
          </button>

          {user ? (
            <>
              {/* روابط المستخدم المسجل */}
              <Link to="/dashboard" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">
                {t('nav.radar')}
              </Link>
              <Link to="/code-shield" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">
                {t('nav.code_shield')}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              {/* روابط الزوار */}
              <Link to="/login">
                <Button variant="ghost" size="sm">{t('nav.login')}</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">{t('nav.register')}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
