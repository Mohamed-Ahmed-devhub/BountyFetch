import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth }     from '../../context/AuthContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import NotificationBell from '../notifications/NotificationBell.jsx'

export default function Navbar() {
  const { user, logout }                    = useAuth()
  const { language, toggleLanguage, isRTL } = useLanguage()
  const location  = useLocation()
  const navigate  = useNavigate()
  const [scrolled, setScrolled]  = useState(false)
  const [menuOpen, setMenuOpen]  = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => setMenuOpen(false), [location.pathname])

  const isActive = p => location.pathname === p

  const links = user ? [
    { to:'/dashboard',        ar:'الرادار',           en:'Radar' },
    { to:'/my-applications',  ar:'طلباتي',            en:'My Apps' },
    { to:'/hub',              ar:'ملتقى المطورين',    en:'Dev Hub' },
    { to:'/code-shield',      ar:'درع الكود',         en:'Code Shield' },
    { to:'/support',          ar:'الدعم',             en:'Support' },
  ] : []

  const handleLogout = async () => { await logout(); navigate('/') }

  const avatarImg    = user?.avatar
  const avatarLetter = (user?.name || '?').charAt(0).toUpperCase()

  return (
    <>
      <header style={{
        position:'sticky', top:0, zIndex:200,
        background:'#fff', borderBottom:'1px solid #D8DEE9',
        boxShadow:scrolled?'0 2px 12px rgba(0,45,98,.08)':'none',
        transition:'box-shadow .2s', maxWidth:'100vw', overflow:'hidden',
      }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 1.5rem', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', gap:'.75rem' }}>

          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:'.45rem', textDecoration:'none', flexShrink:0 }}>
            <div style={{ width:32, height:32, borderRadius:7, background:'#002D62', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'1rem' }}>B</div>
            <span style={{ fontFamily:'Plus Jakarta Sans,Cairo,sans-serif', fontWeight:800, fontSize:'1.05rem', color:'#002D62', letterSpacing:'-.02em' }}>BountyFetch</span>
            <span style={{ fontSize:'.52rem', fontWeight:700, color:'#002D62', border:'1px solid #002D62', borderRadius:4, padding:'1px 5px', opacity:.5 }}>BETA</span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <nav style={{ display:'flex', gap:'.15rem', flex:1, justifyContent:'center' }} className="bf-desk">
              {links.map(l => (
                <Link key={l.to} to={l.to} style={{
                  fontSize:'.82rem', fontWeight:isActive(l.to)?700:500,
                  color:isActive(l.to)?'#002D62':'#5A6478',
                  textDecoration:'none', padding:'.38rem .75rem', borderRadius:8,
                  background:isActive(l.to)?'#E8EEF7':'transparent', transition:'all .15s', whiteSpace:'nowrap',
                }}>{isRTL?l.ar:l.en}</Link>
              ))}
            </nav>
          )}

          {/* Right actions */}
          <div style={{ display:'flex', alignItems:'center', gap:'.5rem', flexShrink:0 }}>
            {user && (
              <div style={{ display:'flex', alignItems:'center', gap:'.3rem', padding:'.2rem .6rem', borderRadius:99, background:'#F0FDF4', border:'1px solid #BBF7D0' }} className="bf-desk">
                <span className="live-dot" />
                <span style={{ fontSize:'.6rem', fontWeight:700, color:'#16A34A', letterSpacing:'.06em' }}>{isRTL?'مباشر':'LIVE'}</span>
              </div>
            )}

            <button onClick={toggleLanguage} style={{ fontSize:'.75rem', fontWeight:600, padding:'.32rem .7rem', border:'1.5px solid #D8DEE9', borderRadius:7, background:'transparent', color:'#5A6478', cursor:'pointer', whiteSpace:'nowrap', transition:'all .15s' }}>
              {language==='ar'?'EN':'عربي'}
            </button>

            {/* Notification bell — only when logged in */}
            {user && <NotificationBell />}

            {user ? (
              <div style={{ display:'flex', alignItems:'center', gap:'.4rem' }} className="bf-desk">
                <Link to="/profile" style={{ textDecoration:'none' }}>
                  {avatarImg
                    ? <img src={avatarImg} alt={user.name} style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover', display:'block' }} />
                    : <div style={{ width:32, height:32, borderRadius:'50%', background:'#002D62', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.82rem', fontWeight:700 }}>{avatarLetter}</div>
                  }
                </Link>
                <button onClick={handleLogout} style={{ fontSize:'.78rem', fontWeight:500, color:'#5A6478', background:'none', border:'none', cursor:'pointer', padding:'.28rem .4rem', borderRadius:6, transition:'color .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='#DC3545'}
                  onMouseLeave={e=>e.currentTarget.style.color='#5A6478'}>
                  {isRTL?'خروج':'Logout'}
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', gap:'.4rem' }} className="bf-desk">
                <Link to="/login"    style={{ fontSize:'.8rem', fontWeight:600, padding:'.38rem .8rem', border:'1.5px solid #D8DEE9', borderRadius:8, color:'#5A6478', textDecoration:'none', whiteSpace:'nowrap' }}>{isRTL?'دخول':'Login'}</Link>
                <Link to="/register" style={{ fontSize:'.8rem', fontWeight:700, padding:'.38rem .9rem', borderRadius:8, background:'#002D62', color:'#fff', textDecoration:'none', whiteSpace:'nowrap' }}>{isRTL?'ابدأ مجاناً':'Get Started'}</Link>
              </div>
            )}

            {/* Hamburger */}
            <button onClick={()=>setMenuOpen(v=>!v)} className="bf-mobile" style={{ background:'none', border:'1.5px solid #D8DEE9', borderRadius:7, padding:'.32rem .45rem', cursor:'pointer', display:'none', flexDirection:'column', gap:4 }}>
              {[1,2,3].map(i=><span key={i} style={{ display:'block', width:18, height:1.5, background:'#5A6478', borderRadius:2 }} />)}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ borderTop:'1px solid #D8DEE9', padding:'.65rem 1.5rem 1rem', background:'#fff', display:'flex', flexDirection:'column', gap:'.2rem' }}>
            {links.map(l=>(
              <Link key={l.to} to={l.to} style={{ padding:'.6rem .8rem', borderRadius:8, color:isActive(l.to)?'#002D62':'#5A6478', fontWeight:isActive(l.to)?700:500, textDecoration:'none', fontSize:'.88rem', background:isActive(l.to)?'#E8EEF7':'transparent' }}>
                {isRTL?l.ar:l.en}
              </Link>
            ))}
            {user
              ? <button onClick={handleLogout} style={{ textAlign:'start', padding:'.6rem .8rem', background:'none', border:'none', color:'#DC3545', fontWeight:500, fontSize:'.88rem', cursor:'pointer', borderRadius:8 }}>{isRTL?'تسجيل الخروج':'Logout'}</button>
              : <>
                  <Link to="/login"    style={{ padding:'.6rem .8rem', color:'#5A6478', textDecoration:'none', fontSize:'.88rem' }}>{isRTL?'دخول':'Login'}</Link>
                  <Link to="/register" style={{ padding:'.6rem .8rem', color:'#002D62', fontWeight:700, textDecoration:'none', fontSize:'.88rem' }}>{isRTL?'ابدأ مجاناً':'Get Started'}</Link>
                </>
            }
          </div>
        )}
      </header>

      <style>{`
        @media(max-width:768px){
          .bf-desk{display:none!important}
          .bf-mobile{display:flex!important}
        }
      `}</style>
    </>
  )
}
