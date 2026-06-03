import React from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function Footer() {
  const { isRTL } = useLanguage()
  const year = new Date().getFullYear()

  const S = {
    footer: {
      background: '#020817', borderTop: '1px solid rgba(99,102,241,.12)',
      padding: '2rem', textAlign: 'center', fontFamily: 'Plus Jakarta Sans, Cairo, sans-serif',
      direction: isRTL ? 'rtl' : 'ltr',
    },
    inner: { maxWidth: 900, margin: '0 auto' },
    logo:  { fontSize: '1.1rem', fontWeight: 800, color: '#6366f1', marginBottom: '.5rem' },
    links: { display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '.75rem' },
    link:  { fontSize: '.825rem', color: '#64748b', textDecoration: 'none', cursor: 'pointer', transition: 'color .15s' },
    copy:  { fontSize: '.8rem', color: '#334155' },
  }

  const LINKS = isRTL
    ? ['الرادار', 'Code Shield', 'DevHub', 'الدعم الفني']
    : ['Radar', 'Code Shield', 'DevHub', 'Support']

  return (
    <footer style={S.footer}>
      <div style={S.inner}>
        <div style={S.logo}>◈ BountyFetch</div>
        <div style={S.links}>
          {LINKS.map(l => (
            <span
              key={l} style={S.link}
              onMouseEnter={e => e.target.style.color = '#a5b4fc'}
              onMouseLeave={e => e.target.style.color = '#64748b'}
            >{l}</span>
          ))}
        </div>
        <p style={S.copy}>
          {isRTL
            ? `© ${year} BountyFetch — اصطد فرصتك`
            : `© ${year} BountyFetch — Hunt Your Opportunity`}
        </p>
      </div>
    </footer>
  )
}
