// ===================================================
// Navbar.jsx — شريط التنقل العلوي لـ BountyFetch
// يحتوي: الشعار، مؤشر Live، تبديل اللغة، روابط التنقل
// يدعم RTL/LTR بشكل كامل وتلقائي
// المسار: frontend/src/components/layout/Navbar.jsx
// ===================================================

import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function Navbar() {
  const { t } = useTranslation()
  const { user, logout }          = useAuth()
  const { language, toggleLanguage, isRTL } = useLanguage()
  const location  = useLocation()
  const navigate  = useNavigate()

  // حالة القائمة على الموبايل
  const [menuOpen, setMenuOpen]   = useState(false)
  // إخفاء الـ Navbar عند التمرير للأسفل
  const [scrolled, setScrolled]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // إغلاق القائمة عند تغيير الصفحة
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // هل هذا الرابط هو الصفحة الحالية؟
  const isActive = (path) => location.pathname === path

  const NAV_LINKS = user ? [
    { to: '/dashboard',   labelAr: 'الرادار',      labelEn: 'Radar' },
    { to: '/code-shield', labelAr: 'درع الكود',    labelEn: 'Code Shield' },
    { to: '/profile',     labelAr: 'ملفي',         labelEn: 'My Profile' },
  ] : []

  return (
    <>
      <header
        className="bf-navbar"
        data-scrolled={scrolled}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bf-navbar-inner">

          {/* ── الشعار ── */}
          <Link to="/" className="bf-nav-logo" aria-label="BountyFetch">
            <span className="bf-nav-logo-icon" aria-hidden="true">◈</span>
            <span className="bf-nav-logo-text">BountyFetch</span>
            <span className="bf-nav-logo-badge">BETA</span>
          </Link>

          {/* ── روابط الوسط (Desktop فقط) ── */}
          {user && (
            <nav className="bf-nav-links" aria-label="Main navigation">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="bf-nav-link"
                  data-active={isActive(link.to)}
                  aria-current={isActive(link.to) ? 'page' : undefined}
                >
                  {isRTL ? link.labelAr : link.labelEn}
                </Link>
              ))}
            </nav>
          )}

          {/* ── أدوات اليمين ── */}
          <div className="bf-nav-actions">

            {/* مؤشر الحالة الحية — يظهر فقط للمستخدمين المسجلين */}
            {user && (
              <div className="bf-nav-live" title={isRTL ? 'الرادار يعمل الآن' : 'Radar is live'}>
                <span className="bf-nav-live-dot" />
                <span className="bf-nav-live-text">
                  {isRTL ? 'مباشر' : 'LIVE'}
                </span>
              </div>
            )}

            {/* زر تبديل اللغة */}
            <button
              className="bf-nav-lang"
              onClick={toggleLanguage}
              aria-label={isRTL ? 'Switch to English' : 'التبديل للعربية'}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12" aria-hidden="true">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm4.93 4.5h-2.14a9.77 9.77 0 00-.74-2.3A5.5 5.5 0 0112.93 5.5zM8 2.56c.54.7 1.02 1.7 1.32 2.94H6.68C6.98 4.26 7.46 3.26 8 2.56zM2.56 8c0-.35.03-.69.08-1.02h2.77A11.2 11.2 0 005.38 8c0 .34.01.68.03 1.02H2.64A5.47 5.47 0 012.56 8zm.51 2.5h2.14c.16.83.41 1.6.74 2.3A5.5 5.5 0 013.07 10.5zM8 13.44c-.54-.7-1.02-1.7-1.32-2.94h2.64C9.02 11.74 8.54 12.74 8 13.44zm1.62-.64c.33-.7.58-1.47.74-2.3h2.14a5.5 5.5 0 01-2.88 2.3zM10.59 9h-5.2A9.8 9.8 0 015.38 8c0-.34.01-.69.04-1.02h5.16A9.8 9.8 0 0110.62 8c0 .34-.01.69-.03 1.02zm.36-2.5H6.68C6.98 5.26 7.46 4.26 8 3.56c.54.7 1.02 1.7 1.32 2.94zm.98 0c.16-.83.41-1.6.74-2.3a5.5 5.5 0 012.88 2.3h-3.62z"/>
              </svg>
              {isRTL ? 'EN' : 'عربي'}
            </button>

            {/* أزرار المستخدم */}
            {user ? (
              <div className="bf-nav-user">
                <div className="bf-nav-avatar" title={user.name}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button className="bf-nav-logout" onClick={handleLogout}>
                  {isRTL ? 'خروج' : 'Logout'}
                </button>
              </div>
            ) : (
              <div className="bf-nav-auth">
                <Link to="/login" className="bf-nav-btn-ghost">
                  {isRTL ? 'دخول' : 'Login'}
                </Link>
                <Link to="/register" className="bf-nav-btn-primary">
                  {isRTL ? 'ابدأ مجاناً' : 'Get Started'}
                </Link>
              </div>
            )}

            {/* زر القائمة — موبايل فقط */}
            <button
              className="bf-nav-hamburger"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={`bf-hamburger-line ${menuOpen ? 'open' : ''}`} />
              <span className={`bf-hamburger-line ${menuOpen ? 'open' : ''}`} />
              <span className={`bf-hamburger-line ${menuOpen ? 'open' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── القائمة على الموبايل ── */}
        <div className={`bf-mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
          {user && NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="bf-mobile-link"
              data-active={isActive(link.to)}
            >
              {isRTL ? link.labelAr : link.labelEn}
            </Link>
          ))}
          {user ? (
            <button className="bf-mobile-logout" onClick={handleLogout}>
              {isRTL ? 'تسجيل الخروج' : 'Logout'}
            </button>
          ) : (
            <>
              <Link to="/login"    className="bf-mobile-link">{isRTL ? 'دخول' : 'Login'}</Link>
              <Link to="/register" className="bf-mobile-link bf-mobile-link-primary">
                {isRTL ? 'ابدأ مجاناً' : 'Get Started Free'}
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── الأنماط ── */}
      <style>{`
        /* المتغيرات */
        .bf-navbar {
          --nb-bg:       rgba(2,6,23,.85);
          --nb-border:   #1e293b;
          --nb-text:     #f1f5f9;
          --nb-muted:    #94a3b8;
          --nb-royal:    #2563eb;
          --nb-royal-lt: #3b82f6;
          --nb-sky:      #0ea5e9;

          position: sticky;
          top: 0; z-index: 200;
          background: var(--nb-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--nb-border);
          transition: box-shadow .3s;
        }
        .bf-navbar[data-scrolled="true"] {
          box-shadow: 0 4px 30px rgba(0,0,0,.4);
        }

        .bf-navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        /* ── الشعار ── */
        .bf-nav-logo {
          display: flex;
          align-items: center;
          gap: .45rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .bf-nav-logo-icon {
          font-size: 1.5rem;
          color: var(--nb-royal-lt);
          line-height: 1;
          filter: drop-shadow(0 0 8px rgba(59,130,246,.6));
        }
        .bf-nav-logo-text {
          font-family: 'Syne', 'Cairo', system-ui, sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--nb-text);
          letter-spacing: -.025em;
        }
        .bf-nav-logo-badge {
          font-size: .52rem;
          font-weight: 800;
          letter-spacing: .1em;
          color: var(--nb-royal-lt);
          border: 1px solid rgba(59,130,246,.4);
          background: rgba(59,130,246,.08);
          border-radius: 5px;
          padding: 2px 5px;
          margin-top: 1px;
        }

        /* ── روابط الوسط ── */
        .bf-nav-links {
          display: flex;
          align-items: center;
          gap: .25rem;
        }
        @media (max-width: 768px) { .bf-nav-links { display: none; } }

        .bf-nav-link {
          font-size: .85rem;
          font-weight: 500;
          color: var(--nb-muted);
          text-decoration: none;
          padding: .4rem .85rem;
          border-radius: 8px;
          border: 1px solid transparent;
          transition: color .2s, background .2s, border-color .2s;
          white-space: nowrap;
        }
        .bf-nav-link:hover {
          color: var(--nb-text);
          background: rgba(255,255,255,.05);
        }
        .bf-nav-link[data-active="true"] {
          color: var(--nb-royal-lt);
          background: rgba(37,99,235,.1);
          border-color: rgba(37,99,235,.25);
        }

        /* ── أدوات اليمين ── */
        .bf-nav-actions {
          display: flex;
          align-items: center;
          gap: .65rem;
          flex-shrink: 0;
        }

        /* مؤشر Live */
        .bf-nav-live {
          display: flex;
          align-items: center;
          gap: .35rem;
          padding: .25rem .7rem;
          border-radius: 99px;
          border: 1px solid rgba(34,197,94,.2);
          background: rgba(34,197,94,.06);
        }
        @media (max-width: 480px) { .bf-nav-live { display: none; } }
        .bf-nav-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
          animation: navPulse 1.6s ease-in-out infinite;
        }
        @keyframes navPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.4); opacity: .6; }
        }
        .bf-nav-live-text {
          font-size: .62rem;
          font-weight: 800;
          letter-spacing: .07em;
          color: #4ade80;
        }

        /* زر اللغة */
        .bf-nav-lang {
          display: flex;
          align-items: center;
          gap: .35rem;
          padding: .38rem .8rem;
          border-radius: 8px;
          border: 1px solid #334155;
          background: transparent;
          color: var(--nb-muted);
          font-size: .78rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color .2s, color .2s, background .2s;
          white-space: nowrap;
        }
        .bf-nav-lang:hover {
          border-color: var(--nb-royal-lt);
          color: var(--nb-text);
          background: rgba(59,130,246,.06);
        }

        /* مستخدم مسجل */
        .bf-nav-user {
          display: flex;
          align-items: center;
          gap: .5rem;
        }
        @media (max-width: 768px) { .bf-nav-user { display: none; } }

        .bf-nav-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--nb-royal), var(--nb-sky));
          color: #fff;
          font-size: .8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          flex-shrink: 0;
        }
        .bf-nav-logout {
          font-size: .78rem;
          font-weight: 500;
          color: var(--nb-muted);
          background: none;
          border: none;
          cursor: pointer;
          padding: .3rem .5rem;
          border-radius: 6px;
          transition: color .2s;
        }
        .bf-nav-logout:hover { color: #f87171; }

        /* أزرار زوار */
        .bf-nav-auth {
          display: flex;
          align-items: center;
          gap: .5rem;
        }
        @media (max-width: 768px) { .bf-nav-auth { display: none; } }

        .bf-nav-btn-ghost {
          font-size: .82rem;
          font-weight: 600;
          color: var(--nb-muted);
          text-decoration: none;
          padding: .42rem .9rem;
          border-radius: 9px;
          border: 1px solid #334155;
          transition: color .2s, border-color .2s;
          white-space: nowrap;
        }
        .bf-nav-btn-ghost:hover {
          color: var(--nb-text);
          border-color: var(--nb-royal-lt);
        }
        .bf-nav-btn-primary {
          font-size: .82rem;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          padding: .45rem 1rem;
          border-radius: 9px;
          background: linear-gradient(135deg, var(--nb-royal), var(--nb-sky));
          transition: transform .2s, box-shadow .2s;
          white-space: nowrap;
        }
        .bf-nav-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37,99,235,.4);
        }

        /* ── همبرغر — موبايل فقط ── */
        .bf-nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px; height: 36px;
          background: none;
          border: 1px solid #334155;
          border-radius: 8px;
          cursor: pointer;
          padding: 0 8px;
          transition: border-color .2s;
        }
        @media (max-width: 768px) { .bf-nav-hamburger { display: flex; } }
        .bf-nav-hamburger:hover { border-color: var(--nb-royal-lt); }

        .bf-hamburger-line {
          width: 100%;
          height: 1.5px;
          background: var(--nb-muted);
          border-radius: 2px;
          transition: transform .3s, opacity .3s;
          transform-origin: center;
        }
        .bf-hamburger-line.open:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .bf-hamburger-line.open:nth-child(2) { opacity: 0; }
        .bf-hamburger-line.open:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── القائمة الموبايل ── */
        .bf-mobile-menu {
          display: none;
          flex-direction: column;
          padding: .75rem 1.5rem 1.25rem;
          border-top: 1px solid var(--nb-border);
          gap: .25rem;
          overflow: hidden;
          max-height: 0;
          transition: max-height .35s ease;
        }
        @media (max-width: 768px) {
          .bf-mobile-menu { display: flex; }
          .bf-mobile-menu.open { max-height: 400px; }
        }
        .bf-mobile-link {
          font-size: .9rem;
          font-weight: 500;
          color: var(--nb-muted);
          text-decoration: none;
          padding: .7rem .85rem;
          border-radius: 10px;
          transition: color .2s, background .2s;
        }
        .bf-mobile-link:hover,
        .bf-mobile-link[data-active="true"] {
          color: var(--nb-text);
          background: rgba(255,255,255,.05);
        }
        .bf-mobile-link-primary {
          background: linear-gradient(135deg, var(--nb-royal), var(--nb-sky));
          color: #fff !important;
          text-align: center;
          margin-top: .5rem;
          font-weight: 700;
        }
        .bf-mobile-logout {
          font-size: .9rem;
          font-weight: 500;
          color: #f87171;
          background: none;
          border: none;
          cursor: pointer;
          padding: .7rem .85rem;
          border-radius: 10px;
          text-align: start;
          transition: background .2s;
        }
        .bf-mobile-logout:hover { background: rgba(248,113,113,.08); }
      `}</style>
    </>
  )
}
