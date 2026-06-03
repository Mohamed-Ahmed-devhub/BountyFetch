// LandingPage.jsx — BountyFetch v3 — marketing + live stats
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { taskService } from '../services/taskService.js'
import Footer from '../components/layout/Footer.jsx'

export default function LandingPage() {
  const { isRTL } = useLanguage()
  const navigate  = useNavigate()
  const [stats, setStats] = useState({ totalUsers: '2K+', totalTasks: '10K+', totalProposals: '5K+', onlineNow: 0 })

  useEffect(() => {
    taskService.getStats()
      .then(r => {
        const d = r.data
        setStats({
          totalUsers:      d.totalUsers      > 999  ? `${(d.totalUsers/1000).toFixed(1)}K+`  : String(d.totalUsers),
          totalTasks:      d.totalTasks      > 9999 ? `${(d.totalTasks/1000).toFixed(0)}K+`  : String(d.totalTasks),
          totalProposals:  d.totalProposals  > 999  ? `${(d.totalProposals/1000).toFixed(1)}K+` : String(d.totalProposals),
          onlineNow:       d.onlineNow,
        })
      })
      .catch(() => {})
  }, [])

  // Intersection observer for scroll reveal
  const sectionRefs = useRef([])
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('lp-vis', e.isIntersecting)),
      { threshold: 0.1 }
    )
    sectionRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const ref = (i) => el => { sectionRefs.current[i] = el }

  const FEATURES = isRTL ? [
    { icon: '🎯', title: 'رادار المهام الفوري',   desc: 'تتبع المهام من Reddit وتيليجرام لحظة نشرها مع تصفية ذكية بالمهارات والميزانية.' },
    { icon: '🤖', title: 'مقترحات بالذكاء الاصطناعي', desc: 'اضغط زراً واحداً — يكتب Gemini مقترحاً احترافياً باللغتين العربية والإنجليزية.' },
    { icon: '🛡', title: 'Code Shield',         desc: 'مساعد برمجي متخصص يحلل كودك، يكشف الأخطاء ويقترح الحل مباشرة.' },
    { icon: '💬', title: 'DevHub المجتمع',      desc: 'غرف دردشة حية للمطورين — شارك، اسأل، وتواصل مع مجتمعك.' },
    { icon: '📊', title: 'لوحة الإحصائيات',     desc: 'إحصائيات حية: المستخدمون الفعّالون، الفرص المتاحة، المقترحات المرسلة.' },
    { icon: '🌐', title: 'دعم كامل للعربية',    desc: 'واجهة RTL احترافية بالكامل — بُنيت للمطور العربي أولاً.' },
  ] : [
    { icon: '🎯', title: 'Live Task Radar',       desc: 'Track tasks from Reddit and Telegram the moment they post with smart skill & budget filtering.' },
    { icon: '🤖', title: 'AI Proposals',          desc: 'One click — Gemini writes a professional proposal in both Arabic and English.' },
    { icon: '🛡', title: 'Code Shield',           desc: 'Specialist AI assistant that reads your code, diagnoses bugs and suggests fixes inline.' },
    { icon: '💬', title: 'DevHub Community',      desc: 'Live dev chat rooms — share, ask, and connect with your community.' },
    { icon: '📊', title: 'Live Stats Dashboard',  desc: 'Real-time stats: active users, available opportunities, submitted proposals.' },
    { icon: '🌐', title: 'Full Arabic RTL',       desc: 'A professionally RTL interface — built for the Arabic developer first.' },
  ]

  const STEPS = isRTL ? [
    { n: '01', title: 'سجّل وحدد مهاراتك', desc: 'أضف مهاراتك وفي ثوانٍ يضبط الرادار نفسه لصالحك.' },
    { n: '02', title: 'شاهد المهام تتدفق',  desc: 'الرادار الحي يجلب الفرص كلّ 10 دقائق تلقائياً.' },
    { n: '03', title: 'ولّد مقترحك بضغطة', desc: 'اختر المهمة المناسبة وأرسل مقترحاً احترافياً بثانية.' },
  ] : [
    { n: '01', title: 'Sign up & set your skills',  desc: 'Add your skills and in seconds the radar tunes itself to your profile.' },
    { n: '02', title: 'Watch tasks roll in',        desc: 'The live radar fetches opportunities every 10 minutes automatically.' },
    { n: '03', title: 'Generate your proposal',    desc: 'Pick the right task and send a professional proposal in one click.' },
  ]

  const T = {
    hero_pre:  isRTL ? '◈ الذكاء الاصطناعي في خدمة الفريلانس' : '◈ AI-Powered Freelance Intelligence',
    hero_h1:   isRTL ? 'اصطد الفرص قبل المنافسين' : 'Hunt Opportunities Before Your Competition',
    hero_sub:  isRTL ? 'رادار حي يجمع المهام من عشرات المصادر، ويكتب لك المقترح بالذكاء الاصطناعي في ثانية واحدة.'
                     : 'A live radar pulling tasks from dozens of sources — AI writes your proposal in one second.',
    cta_start: isRTL ? '← ابدأ الصيد مجاناً' : '← Start Hunting Free',
    cta_demo:  isRTL ? 'شاهد كيف يعمل' : 'See How It Works',
    features_h: isRTL ? 'كل ما تحتاجه في منصة واحدة' : 'Everything You Need in One Platform',
    steps_h:   isRTL ? 'ثلاث خطوات للفرصة الأولى' : 'Three Steps to Your First Opportunity',
    stats_h:   isRTL ? 'أرقام حقيقية، تنمو لحظة بلحظة' : 'Real Numbers, Growing Every Minute',
    cta_h:     isRTL ? 'جاهز تصطاد أول فرصة؟' : 'Ready to hunt your first opportunity?',
    cta_sub:   isRTL ? 'انضم الآن — مجاني تماماً' : 'Join now — completely free',
    online:    isRTL ? 'مطوّر أونلاين الآن' : 'developers online now',
  }

  return (
    <div className="lp-root" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="lp-bg"><div className="lp-grid"/><div className="lp-g1"/><div className="lp-g2"/><div className="lp-g3"/></div>

      {/* Nav */}
      <nav className="lp-nav">
        <span className="lp-logo">◈ BountyFetch</span>
        <div className="lp-nav-btns">
          <button className="lp-btn-ghost" onClick={() => navigate('/auth/login')}>{isRTL?'تسجيل دخول':'Sign In'}</button>
          <button className="lp-btn-primary" onClick={() => navigate('/auth/register')}>{isRTL?'ابدأ مجاناً':'Get Started'}</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <span className="lp-badge">{T.hero_pre}</span>
          <h1 className="lp-h1">{T.hero_h1}</h1>
          <p className="lp-sub">{T.hero_sub}</p>
          {stats.onlineNow > 0 && (
            <p className="lp-online"><span className="lp-dot"/> {stats.onlineNow} {T.online}</p>
          )}
          <div className="lp-cta-row">
            <button className="lp-btn-hero" onClick={() => navigate('/auth/register')}>{T.cta_start}</button>
            <button className="lp-btn-ghost lp-btn-lg" onClick={() => navigate('/auth/login')}>{T.cta_demo}</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="lp-stats-section lp-rev" ref={ref(0)}>
        <div className="lp-stats-grid">
          {[
            { n: stats.totalUsers,     l: isRTL?'عضو مسجّل':'Registered Members' },
            { n: stats.totalTasks,     l: isRTL?'مهمة مجمّعة':'Tasks Aggregated' },
            { n: stats.totalProposals, l: isRTL?'مقترح أُرسل':'Proposals Sent' },
            { n: '10+',                l: isRTL?'مصدر متصل':'Sources Connected' },
          ].map((s,i) => (
            <div className="lp-stat-card" key={i}>
              <span className="lp-stat-n">{s.n}</span>
              <span className="lp-stat-l">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="lp-section lp-rev" ref={ref(1)}>
        <h2 className="lp-section-h">{T.features_h}</h2>
        <div className="lp-features-grid">
          {FEATURES.map((f,i) => (
            <div className="lp-feature-card" key={i}>
              <span className="lp-feature-icon">{f.icon}</span>
              <h3 className="lp-feature-title">{f.title}</h3>
              <p className="lp-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="lp-section lp-rev" ref={ref(2)}>
        <h2 className="lp-section-h">{T.steps_h}</h2>
        <div className="lp-steps-grid">
          {STEPS.map((s,i) => (
            <div className="lp-step-card" key={i}>
              <span className="lp-step-n">{s.n}</span>
              <h3 className="lp-step-title">{s.title}</h3>
              <p className="lp-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-section lp-rev" ref={ref(3)}>
        <div className="lp-cta-inner">
          <h2 className="lp-cta-title">{T.cta_h}</h2>
          <p className="lp-cta-sub">{T.cta_sub}</p>
          <div className="lp-cta-row">
            <button className="lp-btn-hero" onClick={() => navigate('/auth/register')}>{T.cta_start}</button>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .lp-root { min-height:100vh; background:#020817; color:#f1f5f9; font-family:'Plus Jakarta Sans','Cairo',system-ui,sans-serif; overflow-x:hidden; }
        .lp-bg { position:fixed; inset:0; pointer-events:none; z-index:0; }
        .lp-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(99,102,241,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.05) 1px,transparent 1px); background-size:64px 64px; }
        .lp-g1 { position:absolute; top:-20%; left:-10%; width:600px; height:600px; background:radial-gradient(circle,rgba(37,99,235,.18) 0%,transparent 70%); border-radius:50%; }
        .lp-g2 { position:absolute; top:40%; right:-5%; width:500px; height:500px; background:radial-gradient(circle,rgba(99,102,241,.14) 0%,transparent 70%); border-radius:50%; }
        .lp-g3 { position:absolute; bottom:-10%; left:30%; width:400px; height:400px; background:radial-gradient(circle,rgba(14,165,233,.12) 0%,transparent 70%); border-radius:50%; }
        .lp-nav { position:sticky; top:0; z-index:100; display:flex; justify-content:space-between; align-items:center; padding:.85rem 2rem; background:rgba(2,8,23,.85); backdrop-filter:blur(12px); border-bottom:1px solid rgba(99,102,241,.12); }
        .lp-logo { font-size:1.2rem; font-weight:800; color:#6366f1; letter-spacing:-.02em; }
        .lp-nav-btns { display:flex; gap:.6rem; }
        .lp-btn-ghost { padding:.5rem 1.1rem; border-radius:8px; border:1px solid rgba(255,255,255,.12); background:transparent; color:#94a3b8; font-size:.875rem; cursor:pointer; transition:all .15s; }
        .lp-btn-ghost:hover { border-color:#6366f1; color:#f1f5f9; }
        .lp-btn-primary { padding:.5rem 1.2rem; border-radius:8px; border:none; background:#6366f1; color:#fff; font-size:.875rem; font-weight:600; cursor:pointer; transition:opacity .15s; }
        .lp-btn-primary:hover { opacity:.9; }
        .lp-hero { position:relative; z-index:1; display:flex; align-items:center; justify-content:center; min-height:85vh; padding:5rem 2rem; text-align:center; }
        .lp-hero-inner { max-width:780px; }
        .lp-badge { display:inline-block; padding:.35rem 1rem; border-radius:99px; background:rgba(99,102,241,.15); border:1px solid rgba(99,102,241,.3); color:#a5b4fc; font-size:.8rem; font-weight:600; margin-bottom:1.5rem; }
        .lp-h1 { font-size:clamp(2.2rem,5vw,3.8rem); font-weight:900; line-height:1.1; background:linear-gradient(135deg,#f1f5f9 0%,#a5b4fc 60%,#38bdf8 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin:0 0 1.2rem; }
        .lp-sub { font-size:clamp(1rem,2vw,1.2rem); color:#94a3b8; line-height:1.7; margin:0 0 1.5rem; max-width:580px; margin-inline:auto; }
        .lp-online { font-size:.85rem; color:#34d399; margin:0 0 1.5rem; display:flex; align-items:center; gap:.45rem; justify-content:center; }
        .lp-dot { width:8px; height:8px; border-radius:50%; background:#34d399; display:inline-block; animation:pulse 2s infinite; }
        .lp-cta-row { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
        .lp-btn-hero { padding:.85rem 2rem; border-radius:10px; border:none; background:linear-gradient(135deg,#6366f1,#4f46e5); color:#fff; font-size:1rem; font-weight:700; cursor:pointer; transition:transform .15s,box-shadow .15s; box-shadow:0 4px 20px rgba(99,102,241,.4); }
        .lp-btn-hero:hover { transform:translateY(-2px); box-shadow:0 6px 24px rgba(99,102,241,.5); }
        .lp-btn-lg { font-size:1rem; padding:.85rem 2rem; }
        .lp-stats-section { position:relative; z-index:1; padding:3rem 2rem; }
        .lp-stats-grid { max-width:900px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; }
        .lp-stat-card { background:rgba(255,255,255,.03); border:1px solid rgba(99,102,241,.15); border-radius:12px; padding:1.5rem; text-align:center; }
        .lp-stat-n { display:block; font-size:2rem; font-weight:900; color:#6366f1; margin-bottom:.3rem; }
        .lp-stat-l { font-size:.8rem; color:#64748b; font-weight:500; }
        .lp-section { position:relative; z-index:1; padding:5rem 2rem; max-width:1100px; margin:0 auto; }
        .lp-section-h { text-align:center; font-size:clamp(1.5rem,3vw,2.2rem); font-weight:800; color:#f1f5f9; margin:0 0 3rem; }
        .lp-features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
        .lp-feature-card { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:14px; padding:1.75rem; transition:border-color .2s,transform .2s; }
        .lp-feature-card:hover { border-color:rgba(99,102,241,.4); transform:translateY(-3px); }
        .lp-feature-icon { font-size:2rem; display:block; margin-bottom:.75rem; }
        .lp-feature-title { font-size:1rem; font-weight:700; color:#e2e8f0; margin:0 0 .5rem; }
        .lp-feature-desc { font-size:.875rem; color:#64748b; line-height:1.6; margin:0; }
        .lp-steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
        .lp-step-card { background:rgba(99,102,241,.06); border:1px solid rgba(99,102,241,.2); border-radius:14px; padding:2rem; text-align:center; }
        .lp-step-n { display:block; font-size:2.5rem; font-weight:900; color:rgba(99,102,241,.4); margin-bottom:.5rem; }
        .lp-step-title { font-size:1rem; font-weight:700; color:#e2e8f0; margin:0 0 .5rem; }
        .lp-step-desc { font-size:.875rem; color:#64748b; line-height:1.6; margin:0; }
        .lp-cta-section { position:relative; z-index:1; padding:6rem 2rem; }
        .lp-cta-inner { max-width:600px; margin:0 auto; text-align:center; background:rgba(99,102,241,.08); border:1px solid rgba(99,102,241,.2); border-radius:20px; padding:3.5rem 2rem; }
        .lp-cta-title { font-size:clamp(1.75rem,3vw,2.5rem); font-weight:800; color:#f1f5f9; margin:0 0 .85rem; }
        .lp-cta-sub { font-size:1rem; color:#94a3b8; margin:0 0 2rem; }
        .lp-rev { opacity:0; transform:translateY(20px); transition:opacity .6s ease, transform .6s ease; }
        .lp-vis { opacity:1; transform:translateY(0); }
        @media(max-width:900px) { .lp-features-grid,.lp-steps-grid { grid-template-columns:1fr; } .lp-stats-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:560px) { .lp-stats-grid { grid-template-columns:1fr 1fr; } .lp-cta-row { flex-direction:column; align-items:center; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  )
}
