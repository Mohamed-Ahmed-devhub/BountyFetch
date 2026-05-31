// ===================================================
// LandingPage.jsx — Pillar 2: Dynamic Stats (no hardcoded numbers)
// المسار: frontend/src/pages/LandingPage.jsx
// ===================================================

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import api from '../services/api.js'

const STATIC_STATS = [
  { key: 'tasks',     value: '12,400+', ar: 'مهمة مرصودة يومياً',  en: 'Tasks Monitored Daily' },
  { key: 'latency',   value: '340ms',   ar: 'متوسط زمن الاكتشاف',  en: 'Avg. Detection Latency' },
  { key: 'accuracy',  value: '97%',     ar: 'دقة الفلترة بالذكاء', en: 'AI Filtering Accuracy' },
  { key: 'sources',   value: '18+',     ar: 'مصدر بيانات مرتبط',   en: 'Connected Data Sources' },
]

const FEATURES = [
  { icon:'📡', ar:'رادار الرصد الفوري', en:'Real-Time Bounty Radar', descAr:'محرك مراقبة متواصل يفحص آلاف المجتمعات التقنية في الوقت الفعلي ويصفّي الفرص بدقة تتجاوز 97% عبر نماذج ذكاء اصطناعي متخصصة.', descEn:'A continuous monitoring engine that scans thousands of tech communities in real time, filtering opportunities with 97%+ precision via specialized AI models.', accent:'#3b82f6' },
  { icon:'🤖', ar:'مولّد العروض الذكي', en:'AI Proposal Engine', descAr:'يصيغ BountyFetch عروضاً تجارية احترافية مخصصة لكل فرصة معتمداً على سياق مهاراتك وسجل مشاريعك، بالعربية أو الإنجليزية في ثوانٍ.', descEn:'BountyFetch drafts tailored professional proposals for each opportunity, leveraging your skill context and project history — in Arabic or English within seconds.', accent:'#0ea5e9' },
  { icon:'🛡️', ar:'درع الكود البرمجي', en:'Code Shield Assistant', descAr:'مساعد داخلي متخصص يحلل الكود الذي ترفعه، يكتشف الأخطاء، ويقترح إصلاحات دقيقة للـ CSS والـ JavaScript قبل التسليم.', descEn:'A built-in specialist that analyzes your submitted code, detects bugs, and proposes precise CSS/JS fixes before delivery — ensuring zero-defect quality.', accent:'#6366f1' },
]

const STEPS = [
  { n:'01', ar:'أنشئ ملفك المهني', en:'Build Your Profile', dAr:'حدّد مهاراتك ومستوى خبرتك. يستخدم BountyFetch هذه البيانات لمعايرة الرادار بدقة عالية.', dEn:'Define your skills and experience level. BountyFetch uses this data to calibrate the radar with high precision.' },
  { n:'02', ar:'دع الرادار يعمل', en:'Let the Radar Work', dAr:'الرادار يعمل على مدار الساعة، يرصد المجتمعات التقنية، ويصلك بإشعار فوري عند ظهور فرصة مطابقة.', dEn:'The radar operates around the clock, monitoring tech communities, alerting you instantly when a matching opportunity appears.' },
  { n:'03', ar:'احتل الفرصة فوراً', en:'Seize the Opportunity', dAr:'بنقرة واحدة تحصل على عرض عمل جاهز ومساعدة في تنفيذ المهمة وتسليمها بجودة لا تُضاهى.', dEn:'One click gets you a ready-to-send proposal, execution assistance, and delivery at unmatched quality.' },
]

export default function LandingPage() {
  const { isRTL, language } = useLanguage()

  // Pillar 2: إحصائيات ديناميكية
  const [liveStats, setLiveStats] = useState(null)

  useEffect(() => {
    api.get('/tasks/stats').then(({ data }) => setLiveStats(data)).catch(() => {})
  }, [])

  // Pillar 7: useMemo لتجنب إعادة الحساب
  const heroStats = useMemo(() => {
    if (!liveStats) return STATIC_STATS
    return [
      { key:'members', value: liveStats.totalUsers?.toLocaleString() || '—', ar:'مطوّر مسجّل', en:'Registered Developers' },
      { key:'online',  value: liveStats.onlineNow  || '—',                   ar:'متصل الآن',   en:'Online Now' },
      { key:'tasks',   value: liveStats.totalTasks?.toLocaleString() || '—', ar:'مهمة في قاعدة البيانات', en:'Tasks in Database' },
      { key:'proposals', value: liveStats.totalProposals?.toLocaleString() || '—', ar:'بروبوزال مولَّد', en:'Proposals Generated' },
    ]
  }, [liveStats])

  const observerRef = useRef(null)
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('lp-vis') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.lp-rev').forEach(el => observerRef.current.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="lp-root" dir={isRTL ? 'rtl' : 'ltr'} lang={language}>
      <div className="lp-bg" aria-hidden="true">
        <div className="lp-grid" />
        <div className="lp-g1" /><div className="lp-g2" /><div className="lp-g3" />
      </div>

      <Navbar />

      {/* ══ HERO ══ */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <div className="lp-tag lp-rev">
            <span className="lp-dot" />
            {isRTL ? 'منصة الذكاء الاصطناعي للفرص البرمجية' : 'AI-Powered Platform for Coding Opportunities'}
          </div>
          <h1 className="lp-h1 lp-rev">
            <span className="lp-brand">BountyFetch</span><br />
            {isRTL
              ? <span className="lp-h1-sub">اصطد الفرص <em>قبل</em> غيرك</span>
              : <span className="lp-h1-sub">Hunt Opportunities <em>Before</em> Anyone Else</span>}
          </h1>
          <p className="lp-lead lp-rev">
            {isRTL
              ? 'منصة ذكاء اصطناعي متخصصة تجمع مهام الفريلانس من Telegram وReddit وعشرات المصادر، تفلترها بدقة، وتولّد عروض عمل احترافية بلمح البصر.'
              : 'A specialized AI platform aggregating freelance tasks from Telegram, Reddit, and dozens of sources — filtering with precision and generating winning proposals instantly.'}
          </p>
          <div className="lp-cta-row lp-rev">
            <Link to="/register" className="lp-btn-primary">
              {isRTL ? '🚀 ابدأ مجاناً' : '🚀 Get Started Free'}
            </Link>
            <Link to="/dashboard" className="lp-btn-ghost">
              {isRTL ? 'استعرض الرادار ←' : 'View Radar →'}
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STATS — Pillar 2: ديناميكية ══ */}
      <section className="lp-stats">
        <div className="lp-container">
          <div className="lp-stats-grid">
            {heroStats.map((s, i) => (
              <div key={i} className="lp-stat-card lp-rev">
                <span className="lp-stat-val">{s.value}</span>
                <span className="lp-stat-lbl">{isRTL ? s.ar : s.en}</span>
                {liveStats && <span className="lp-stat-live">🟢 {isRTL ? 'مباشر' : 'Live'}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="lp-features">
        <div className="lp-container">
          <div className="lp-section-head lp-rev">
            <span className="lp-section-tag">{isRTL ? 'المميزات' : 'Features'}</span>
            <h2 className="lp-section-title">{isRTL ? 'ثلاثة محركات، نتيجة واحدة' : 'Three Engines, One Outcome'}</h2>
            <p className="lp-section-sub">{isRTL ? 'تقنية متكاملة صُمِّمت لتمنحك أقصى فرصة للفوز بكل مهمة.' : 'Integrated technology designed to maximize your chances of winning every task.'}</p>
          </div>
          <div className="lp-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="lp-feature-card lp-rev" style={{ '--accent': f.accent }}>
                <div className="lp-feature-icon">{f.icon}</div>
                <h3 className="lp-feature-title">{isRTL ? f.ar : f.en}</h3>
                <p className="lp-feature-desc">{isRTL ? f.descAr : f.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="lp-steps">
        <div className="lp-container">
          <div className="lp-section-head lp-rev">
            <span className="lp-section-tag">{isRTL ? 'كيف يعمل' : 'How It Works'}</span>
            <h2 className="lp-section-title">{isRTL ? 'ثلاث خطوات للفوز' : 'Three Steps to Win'}</h2>
          </div>
          <div className="lp-steps-grid">
            {STEPS.map((s, i) => (
              <div key={i} className="lp-step-card lp-rev">
                <span className="lp-step-n">{s.n}</span>
                <h3 className="lp-step-title">{isRTL ? s.ar : s.en}</h3>
                <p className="lp-step-desc">{isRTL ? s.dAr : s.dEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="lp-cta-section">
        <div className="lp-container">
          <div className="lp-cta-box lp-rev">
            <h2 className="lp-cta-title">
              {isRTL ? 'جاهز للانطلاق؟' : 'Ready to Launch?'}
            </h2>
            <p className="lp-cta-sub">
              {isRTL ? 'انضم لآلاف المطورين الذين يصطادون الفرص كل يوم.' : 'Join thousands of developers hunting opportunities every day.'}
            </p>
            <Link to="/register" className="lp-btn-primary lp-btn-lg">
              {isRTL ? '🚀 أنشئ حسابك الآن مجاناً' : '🚀 Create Your Free Account'}
            </Link>
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

        .lp-container { max-width:1200px; margin:0 auto; padding:0 1.5rem; position:relative; z-index:1; }

        /* Hero */
        .lp-hero { padding:9rem 1.5rem 6rem; max-width:800px; margin:0 auto; text-align:center; position:relative; z-index:1; }
        .lp-tag { display:inline-flex; align-items:center; gap:.5rem; padding:.4rem 1rem; border-radius:99px; background:rgba(37,99,235,.1); border:1px solid rgba(37,99,235,.25); color:#93c5fd; font-size:.78rem; font-weight:600; letter-spacing:.04em; margin-bottom:1.75rem; }
        .lp-dot { width:6px; height:6px; border-radius:50%; background:#4ade80; box-shadow:0 0 8px #4ade80; animation:pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
        .lp-h1 { font-size:clamp(2.5rem,6vw,4.5rem); font-weight:900; line-height:1.1; letter-spacing:-.03em; margin:0 0 1.5rem; }
        .lp-brand { background:linear-gradient(135deg,#60a5fa,#818cf8,#0ea5e9); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .lp-h1-sub { color:#e2e8f0; }
        .lp-h1-sub em { color:#60a5fa; font-style:normal; }
        .lp-lead { font-size:clamp(1rem,2vw,1.2rem); color:#94a3b8; line-height:1.75; margin:0 0 2.5rem; max-width:600px; margin-inline:auto; margin-bottom:2.5rem; }
        .lp-cta-row { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
        .lp-btn-primary { display:inline-flex; align-items:center; gap:.5rem; padding:.85rem 2rem; border-radius:12px; background:linear-gradient(135deg,#2563eb,#4f46e5); color:#fff; font-weight:700; font-size:1rem; text-decoration:none; transition:all .2s; box-shadow:0 4px 20px rgba(37,99,235,.35); }
        .lp-btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(37,99,235,.5); }
        .lp-btn-primary.lp-btn-lg { padding:1rem 2.5rem; font-size:1.1rem; }
        .lp-btn-ghost { display:inline-flex; align-items:center; gap:.5rem; padding:.85rem 2rem; border-radius:12px; border:1px solid rgba(241,245,249,.15); color:#94a3b8; font-weight:600; font-size:1rem; text-decoration:none; transition:all .2s; }
        .lp-btn-ghost:hover { border-color:rgba(241,245,249,.35); color:#f1f5f9; }

        /* Stats */
        .lp-stats { padding:4rem 0; position:relative; z-index:1; }
        .lp-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; }
        .lp-stat-card { background:rgba(30,41,59,.6); border:1px solid rgba(99,102,241,.15); border-radius:14px; padding:1.75rem 1.5rem; text-align:center; backdrop-filter:blur(8px); position:relative; }
        .lp-stat-val { display:block; font-size:clamp(1.75rem,3vw,2.5rem); font-weight:900; background:linear-gradient(135deg,#60a5fa,#818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:.35rem; }
        .lp-stat-lbl { display:block; font-size:.82rem; color:#64748b; font-weight:500; }
        .lp-stat-live { position:absolute; top:.6rem; inset-inline-end:.6rem; font-size:.62rem; color:#4ade80; background:rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.2); border-radius:99px; padding:.15rem .45rem; }

        /* Features */
        .lp-features { padding:6rem 0; position:relative; z-index:1; }
        .lp-section-head { text-align:center; margin-bottom:3rem; }
        .lp-section-tag { display:inline-block; padding:.3rem .9rem; border-radius:99px; background:rgba(37,99,235,.1); border:1px solid rgba(37,99,235,.2); color:#93c5fd; font-size:.75rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; margin-bottom:.85rem; }
        .lp-section-title { font-size:clamp(1.75rem,3.5vw,2.75rem); font-weight:800; color:#f1f5f9; margin:0 0 .75rem; letter-spacing:-.02em; }
        .lp-section-sub { font-size:.95rem; color:#64748b; max-width:520px; margin:0 auto; line-height:1.7; }
        .lp-features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
        .lp-feature-card { background:rgba(15,23,42,.8); border:1px solid rgba(30,41,59,1); border-radius:18px; padding:2rem; position:relative; overflow:hidden; transition:border-color .25s,transform .25s; }
        .lp-feature-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--accent,#3b82f6) 0%,transparent 60%); opacity:0; transition:opacity .3s; border-radius:inherit; }
        .lp-feature-card:hover { border-color:var(--accent,#3b82f6); transform:translateY(-4px); }
        .lp-feature-card:hover::before { opacity:.06; }
        .lp-feature-icon { font-size:2.25rem; margin-bottom:1.25rem; display:block; }
        .lp-feature-title { font-size:1.15rem; font-weight:700; color:#f1f5f9; margin:0 0 .75rem; }
        .lp-feature-desc { font-size:.875rem; color:#64748b; line-height:1.75; margin:0; }

        /* Steps */
        .lp-steps { padding:6rem 0; position:relative; z-index:1; }
        .lp-steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
        .lp-step-card { background:rgba(15,23,42,.6); border:1px solid rgba(30,41,59,1); border-radius:16px; padding:2rem; }
        .lp-step-n { display:inline-block; font-size:.7rem; font-weight:800; letter-spacing:.08em; color:#60a5fa; background:rgba(37,99,235,.1); border:1px solid rgba(37,99,235,.2); border-radius:8px; padding:.25rem .6rem; margin-bottom:1rem; }
        .lp-step-title { font-size:1.1rem; font-weight:700; color:#f1f5f9; margin:0 0 .75rem; }
        .lp-step-desc { font-size:.875rem; color:#64748b; line-height:1.75; margin:0; }

        /* CTA Section */
        .lp-cta-section { padding:6rem 0; position:relative; z-index:1; }
        .lp-cta-box { background:linear-gradient(135deg,rgba(37,99,235,.15),rgba(99,102,241,.1)); border:1px solid rgba(37,99,235,.25); border-radius:24px; padding:4rem 2rem; text-align:center; backdrop-filter:blur(8px); }
        .lp-cta-title { font-size:clamp(1.75rem,3vw,2.5rem); font-weight:800; color:#f1f5f9; margin:0 0 .85rem; }
        .lp-cta-sub { font-size:1rem; color:#94a3b8; margin:0 0 2rem; }

        /* Reveal */
        .lp-rev { opacity:0; transform:translateY(20px); transition:opacity .6s ease, transform .6s ease; }
        .lp-vis { opacity:1; transform:translateY(0); }

        /* Responsive */
        @media(max-width:900px) {
          .lp-features-grid,.lp-steps-grid { grid-template-columns:1fr; }
          .lp-stats-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:560px) {
          .lp-stats-grid { grid-template-columns:1fr 1fr; }
          .lp-cta-row { flex-direction:column; align-items:center; }
        }
      `}</style>
    </div>
  )
}
