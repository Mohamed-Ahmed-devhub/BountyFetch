// ===================================================
<<<<<<< HEAD
// Footer.jsx — تذييل BountyFetch الاحترافي
// براند تجاري 100% — بدون أي إشارات للدراسة
// المسار: frontend/src/components/layout/Footer.jsx
// ===================================================

import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext.jsx'

const LINKS = {
  productAr: 'المنتج',
  productEn: 'Product',
  items: [
    { labelAr: 'رادار القنص',      labelEn: 'Bounty Radar',     to: '/dashboard' },
    { labelAr: 'مولّد العروض',     labelEn: 'Proposal Engine',  to: '/dashboard' },
    { labelAr: 'درع الكود',        labelEn: 'Code Shield',      to: '/code-shield' },
  ],
}

export default function Footer() {
  const { isRTL } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="ft-root" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="ft-inner">

        {/* الشعار والوصف */}
        <div className="ft-brand">
          <Link to="/" className="ft-logo">
            <span className="ft-logo-icon">◈</span>
            <span className="ft-logo-text">BountyFetch</span>
          </Link>
          <p className="ft-tagline">
            {isRTL
              ? 'الرادار الذكي الأسرع لاقتناص الفرص البرمجية في الوقت الفعلي.'
              : 'The fastest intelligent radar for capturing coding opportunities in real time.'}
          </p>
          <div className="ft-status">
            <span className="ft-status-dot" />
            <span className="ft-status-text">
              {isRTL ? 'جميع الأنظمة تعمل' : 'All systems operational'}
            </span>
          </div>
        </div>

        {/* روابط المنتج */}
        <div className="ft-links-col">
          <p className="ft-col-title">
            {isRTL ? LINKS.productAr : LINKS.productEn}
          </p>
          {LINKS.items.map((item, i) => (
            <Link key={i} to={item.to} className="ft-link">
              {isRTL ? item.labelAr : item.labelEn}
            </Link>
          ))}
        </div>

        {/* روابط قانونية */}
        <div className="ft-links-col">
          <p className="ft-col-title">
            {isRTL ? 'الشركة' : 'Company'}
          </p>
          <a href="#" className="ft-link">{isRTL ? 'عن المنصة' : 'About'}</a>
          <a href="#" className="ft-link">{isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}</a>
          <a href="#" className="ft-link">{isRTL ? 'شروط الاستخدام' : 'Terms of Service'}</a>
          <a href="#" className="ft-link">{isRTL ? 'تواصل معنا' : 'Contact Us'}</a>
        </div>
      </div>

      {/* الشريط السفلي */}
      <div className="ft-bottom">
        <p className="ft-copy">
          © {year} BountyFetch.{' '}
          {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </p>
        <div className="ft-bottom-links">
          <a href="#" className="ft-bottom-link">
            {isRTL ? 'الخصوصية' : 'Privacy'}
          </a>
          <span className="ft-sep">·</span>
          <a href="#" className="ft-bottom-link">
            {isRTL ? 'الشروط' : 'Terms'}
          </a>
          <span className="ft-sep">·</span>
          <a href="#" className="ft-bottom-link">
            {isRTL ? 'الدعم' : 'Support'}
          </a>
        </div>
      </div>

      <style>{`
        .ft-root {
          background: #020617;
          border-top: 1px solid #1e293b;
          color: #f1f5f9;
          font-family: 'DM Sans','Tajawal',system-ui,sans-serif;
        }
        .ft-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3.5rem 1.5rem 2.5rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
        }
        @media (max-width: 768px) {
          .ft-inner {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .ft-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .ft-inner { grid-template-columns: 1fr; }
        }

        /* البراند */
        .ft-brand { display: flex; flex-direction: column; gap: .9rem; }
        .ft-logo {
          display: inline-flex; align-items: center; gap: .45rem;
          text-decoration: none;
        }
        .ft-logo-icon { font-size: 1.4rem; color: #3b82f6; }
        .ft-logo-text {
          font-family: 'Syne',system-ui,sans-serif;
          font-size: 1.1rem; font-weight: 800; color: #f1f5f9;
          letter-spacing: -.02em;
        }
        .ft-tagline {
          font-size: .85rem; color: #64748b;
          line-height: 1.7; margin: 0;
          max-width: 300px;
        }
        .ft-status {
          display: inline-flex; align-items: center; gap: .4rem;
          padding: .25rem .75rem;
          border-radius: 99px;
          border: 1px solid rgba(34,197,94,.2);
          background: rgba(34,197,94,.05);
          width: fit-content;
        }
        .ft-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
        }
        .ft-status-text {
          font-size: .68rem; font-weight: 600;
          color: #4ade80; letter-spacing: .04em;
        }

        /* أعمدة الروابط */
        .ft-links-col { display: flex; flex-direction: column; gap: .6rem; }
        .ft-col-title {
          font-size: .7rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: #475569; margin: 0 0 .35rem;
        }
        .ft-link {
          font-size: .83rem; color: #64748b;
          text-decoration: none;
          transition: color .2s;
          width: fit-content;
        }
        .ft-link:hover { color: #94a3b8; }

        /* الشريط السفلي */
        .ft-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.25rem 1.5rem;
          border-top: 1px solid #1e293b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: .75rem;
        }
        .ft-copy { font-size: .75rem; color: #334155; margin: 0; }
        .ft-bottom-links { display: flex; align-items: center; gap: .5rem; }
        .ft-bottom-link {
          font-size: .75rem; color: #334155;
          text-decoration: none; transition: color .2s;
        }
        .ft-bottom-link:hover { color: #64748b; }
        .ft-sep { color: #1e293b; font-size: .7rem; }
      `}</style>
    </footer>
  )
}
=======
// Footer.jsx - تذييل الصفحة البسيط
// ===================================================
import React from 'react'

function Footer() {
  return (
    <footer className="border-t border-brand-border py-6 text-center">
      <p className="text-gray-600 text-sm">
        صُنع بـ ❤️ كمشروع تخرج احترافي — {new Date().getFullYear()}
      </p>
    </footer>
  )
}

export default Footer
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
