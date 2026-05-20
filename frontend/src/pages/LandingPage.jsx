// ===================================================
// LandingPage.jsx — صفحة الهبوط الرئيسية لـ BountyFetch
// البراند التجاري الكامل — slate-950 + Royal Blue
// المسار: frontend/src/pages/LandingPage.jsx
// ===================================================

import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'

const STATS = [
  { value: '12,400+', ar: 'مهمة مرصودة يومياً',   en: 'Tasks Monitored Daily' },
  { value: '340ms',   ar: 'متوسط زمن الاكتشاف',   en: 'Avg. Detection Latency' },
  { value: '97%',     ar: 'دقة الفلترة بالذكاء',  en: 'AI Filtering Accuracy' },
  { value: '18+',     ar: 'مصدر بيانات مرتبط',    en: 'Connected Data Sources' },
]

const FEATURES = [
  {
    icon: '📡',
    ar: 'رادار الرصد الفوري',
    en: 'Real-Time Bounty Radar',
    descAr: 'محرك مراقبة متواصل يفحص آلاف المجتمعات التقنية في الوقت الفعلي ويصفّي الفرص بدقة تتجاوز 97% عبر نماذج ذكاء اصطناعي متخصصة.',
    descEn: 'A continuous monitoring engine that scans thousands of tech communities in real time, filtering opportunities with 97%+ precision via specialized AI models.',
    accent: '#3b82f6',
  },
  {
    icon: '🤖',
    ar: 'مولّد العروض الذكي',
    en: 'AI Proposal Engine',
    descAr: 'يصيغ BountyFetch عروضاً تجارية احترافية مخصصة لكل فرصة معتمداً على سياق مهاراتك وسجل مشاريعك، بالعربية أو الإنجليزية في ثوانٍ.',
    descEn: 'BountyFetch drafts tailored professional proposals for each opportunity, leveraging your skill context and project history — in Arabic or English within seconds.',
    accent: '#0ea5e9',
  },
  {
    icon: '🛡️',
    ar: 'درع الكود البرمجي',
    en: 'Code Shield Assistant',
    descAr: 'مساعد داخلي متخصص يحلل الكود الذي ترفعه، يكتشف الأخطاء، ويقترح إصلاحات دقيقة للـ CSS والـ JavaScript قبل التسليم.',
    descEn: 'A built-in specialist that analyzes your submitted code, detects bugs, and proposes precise CSS/JS fixes before delivery — ensuring zero-defect quality.',
    accent: '#6366f1',
  },
]

const STEPS = [
  {
    n: '01',
    ar: 'أنشئ ملفك المهني',    en: 'Build Your Profile',
    dAr: 'حدّد مهاراتك ومستوى خبرتك. يستخدم BountyFetch هذه البيانات لمعايرة الرادار بدقة عالية.',
    dEn: 'Define your skills and experience level. BountyFetch uses this data to calibrate the radar with high precision.',
  },
  {
    n: '02',
    ar: 'دع الرادار يعمل',     en: 'Let the Radar Work',
    dAr: 'الرادار يعمل على مدار الساعة، يرصد المجتمعات التقنية، ويصلك بإشعار فوري عند ظهور فرصة مطابقة.',
    dEn: 'The radar operates around the clock, monitoring tech communities, alerting you instantly when a matching opportunity appears.',
  },
  {
    n: '03',
    ar: 'احتل الفرصة فوراً',  en: 'Seize the Opportunity',
    dAr: 'بنقرة واحدة تحصل على عرض عمل جاهز ومساعدة في تنفيذ المهمة وتسليمها بجودة لا تُضاهى.',
    dEn: 'One click gets you a ready-to-send proposal, execution assistance, and delivery at unmatched quality.',
  },
]

export default function LandingPage() {
  const { isRTL, language } = useLanguage()

  // تأثير الظهور عند التمرير
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
      {/* خلفية */}
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
            <span className="lp-h1-sub">{isRTL ? 'الرادار الذكي الأسرع' : 'The Fastest Intelligent Radar'}</span><br />
            <span className="lp-h1-acc">{isRTL ? 'لاقتناص الفرص البرمجية' : 'to Capture Coding Opportunities'}</span><br />
            <span className="lp-h1-dim">{isRTL ? 'في الوقت الفعلي' : 'In Real Time'}</span>
          </h1>
          <p className="lp-hero-desc lp-rev">
            {isRTL
              ? 'منصة BountyFetch ترصد وتصفّي وترتّب المهام الحرة والمشاريع البرمجية من عشرات المصادر في آنٍ واحد، وتوصلها إليك مع عرض عمل جاهز قبل أن يفعل المنافسون.'
              : 'BountyFetch monitors, filters, and ranks freelance tasks from dozens of sources simultaneously — delivering them to you with a ready proposal before your competitors even notice.'}
          </p>
          <div className="lp-ctas lp-rev">
            <Link to="/register" className="lp-btn-primary">
              {isRTL ? 'ابدأ الاصطياد مجاناً ←' : '→ Start Hunting Free'}
            </Link>
            <a href="#how" className="lp-btn-outline">
              {isRTL ? 'كيف يعمل؟' : 'How It Works?'}
            </a>
          </div>
          <p className="lp-trust lp-rev">
            {isRTL
              ? 'لا يلزم بطاقة ائتمانية — الوصول الفوري — يعمل مع جميع المنصات'
              : 'No credit card required · Instant access · Works across all platforms'}
          </p>
        </div>

        {/* رسم الرادار التزييني */}
        <div className="lp-hero-vis lp-rev" aria-hidden="true">
          <RadarArt isRTL={isRTL} />
        </div>
      </section>

      {/* ══ STATS ══ */}
      <div className="lp-stats-strip">
        <div className="lp-stats-inner">
          {STATS.map((s, i) => (
            <div key={i} className="lp-stat lp-rev">
              <span className="lp-stat-val">{s.value}</span>
              <span className="lp-stat-lbl">{isRTL ? s.ar : s.en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FEATURES ══ */}
      <section className="lp-sec">
        <div className="lp-sec-inner">
          <div className="lp-sec-hd lp-rev">
            <span className="lp-sec-tag">{isRTL ? 'الأدوات الأساسية' : 'Core Capabilities'}</span>
            <h2 className="lp-sec-title">
              {isRTL ? 'كل ما تحتاجه للفوز بالمهام — في مكان واحد' : 'Everything You Need to Win Tasks — In One Place'}
            </h2>
            <p className="lp-sec-sub">
              {isRTL
                ? 'صُمّمت BountyFetch لتكون سلاحك الكامل: من الاكتشاف الآلي حتى التسليم المتقن.'
                : 'BountyFetch is engineered to be your complete arsenal: from automated discovery to polished delivery.'}
            </p>
          </div>
          <div className="lp-feat-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="lp-feat-card lp-rev" style={{ '--ac': f.accent }}>
                <div className="lp-feat-icon" style={{ color: f.accent }}>{f.icon}</div>
                <h3 className="lp-feat-title">{isRTL ? f.ar : f.en}</h3>
                <p className="lp-feat-desc">{isRTL ? f.descAr : f.descEn}</p>
                <div className="lp-feat-line" style={{ background: f.accent }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="lp-sec lp-sec-alt" id="how">
        <div className="lp-sec-inner">
          <div className="lp-sec-hd lp-rev">
            <span className="lp-sec-tag">{isRTL ? 'آلية العمل' : 'How It Works'}</span>
            <h2 className="lp-sec-title">
              {isRTL ? 'ثلاث خطوات تغيّر مسارك' : 'Three Steps That Change Your Trajectory'}
            </h2>
          </div>
          <div className="lp-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="lp-step lp-rev">
                <span className="lp-step-n">{s.n}</span>
                <h3 className="lp-step-title">{isRTL ? s.ar : s.en}</h3>
                <p className="lp-step-desc">{isRTL ? s.dAr : s.dEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="lp-cta-sec">
        <div className="lp-cta-box lp-rev">
          <h2 className="lp-cta-title">
            {isRTL ? 'الفرصة القادمة لا تنتظر — BountyFetch ينتظرها عنك' : "The Next Opportunity Won't Wait — BountyFetch Waits For You"}
          </h2>
          <p className="lp-cta-sub">
            {isRTL
              ? 'انضم إلى المطورين الذين يستخدمون الذكاء الاصطناعي كميزة تنافسية حقيقية.'
              : 'Join the developers who use artificial intelligence as a genuine competitive edge.'}
          </p>
          <Link to="/register" className="lp-btn-primary lp-btn-xl">
            {isRTL ? 'أنشئ حسابك الآن مجاناً ←' : '→ Create Your Free Account'}
          </Link>
        </div>
      </section>

      <Footer />

      <style>{`
        .lp-root {
          --c-bg:   #020617; --c-sf:  #0f172a; --c-bd:  #1e293b;
          --c-blt:  #334155; --c-rl:  #2563eb; --c-rlt: #3b82f6;
          --c-sky:  #0ea5e9; --c-ind: #6366f1;
          --c-txt:  #f1f5f9; --c-mt:  #94a3b8; --c-sb:  #475569;
          --ff-d: 'Syne','Cairo',system-ui,sans-serif;
          --ff-b: 'DM Sans','Tajawal',system-ui,sans-serif;
          min-height:100vh; background:var(--c-bg); color:var(--c-txt);
          font-family:var(--ff-b); overflow-x:hidden; position:relative;
        }
        .lp-bg { position:fixed; inset:0; pointer-events:none; z-index:0; }
        .lp-grid {
          position:absolute; inset:0;
          background-image:linear-gradient(rgba(37,99,235,.055) 1px,transparent 1px),
            linear-gradient(90deg,rgba(37,99,235,.055) 1px,transparent 1px);
          background-size:48px 48px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);
        }
        .lp-g1,.lp-g2,.lp-g3 { position:absolute; border-radius:50%; filter:blur(120px); }
        .lp-g1 { width:600px;height:600px; background:var(--c-rl); top:-150px; left:-150px; opacity:.14; }
        .lp-g2 { width:500px;height:500px; background:var(--c-sky); bottom:10%; right:-100px; opacity:.10; }
        .lp-g3 { width:400px;height:400px; background:var(--c-ind); top:40%; left:40%; opacity:.08; }

        /* reveal */
        .lp-rev { opacity:0; transform:translateY(26px); transition:opacity .55s ease,transform .55s ease; }
        .lp-vis { opacity:1; transform:translateY(0); }
        .lp-rev:nth-child(2){transition-delay:.1s} .lp-rev:nth-child(3){transition-delay:.2s} .lp-rev:nth-child(4){transition-delay:.3s}

        /* hero */
        .lp-hero {
          position:relative;z-index:1;
          max-width:1200px; margin:0 auto;
          padding:6rem 1.5rem 4rem;
          display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:center;
        }
        @media(max-width:900px){.lp-hero{grid-template-columns:1fr;padding:4rem 1.25rem 3rem;text-align:center;}}
        .lp-hero-content { display:flex; flex-direction:column; gap:1.5rem; }

        .lp-tag {
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.35rem 1rem; border-radius:99px;
          border:1px solid rgba(37,99,235,.35); background:rgba(37,99,235,.08);
          font-size:.78rem; font-weight:600; color:var(--c-rlt); width:fit-content;
        }
        @media(max-width:900px){.lp-tag{margin:0 auto;}}
        .lp-dot { width:6px;height:6px;border-radius:50%;background:var(--c-rlt); }

        .lp-h1 {
          font-family:var(--ff-d); font-size:clamp(2.2rem,4.5vw,3.8rem);
          font-weight:800; line-height:1.13; letter-spacing:-.03em; margin:0;
        }
        .lp-brand {
          background:linear-gradient(135deg,#60a5fa,#38bdf8);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .lp-h1-sub  { color:var(--c-txt); }
        .lp-h1-acc  { color:var(--c-rlt); }
        .lp-h1-dim  { color:var(--c-mt); font-weight:400; font-size:82%; }

        .lp-hero-desc { font-size:1rem; line-height:1.75; color:var(--c-mt); max-width:520px; margin:0; }
        @media(max-width:900px){.lp-hero-desc{max-width:100%;}}

        .lp-ctas { display:flex; gap:1rem; flex-wrap:wrap; }
        @media(max-width:900px){.lp-ctas{justify-content:center;}}

        .lp-btn-primary {
          display:inline-flex; align-items:center; justify-content:center;
          font-size:.9rem; font-weight:700; padding:.72rem 1.5rem;
          border-radius:11px; border:none; text-decoration:none;
          background:linear-gradient(135deg,var(--c-rl),var(--c-sky)); color:#fff;
          cursor:pointer; transition:all .2s; white-space:nowrap;
        }
        .lp-btn-primary:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(37,99,235,.45); }
        .lp-btn-xl { font-size:1rem; padding:.88rem 2rem; border-radius:13px; }

        .lp-btn-outline {
          display:inline-flex; align-items:center; justify-content:center;
          font-size:.9rem; font-weight:700; padding:.72rem 1.4rem;
          border-radius:11px; border:1px solid var(--c-rl);
          color:var(--c-rlt); text-decoration:none; background:transparent;
          transition:all .2s; white-space:nowrap;
        }
        .lp-btn-outline:hover { background:rgba(37,99,235,.1); }

        .lp-trust { font-size:.75rem; color:var(--c-sb); margin:0; }
        .lp-hero-vis { display:flex; align-items:center; justify-content:center; }
        @media(max-width:900px){.lp-hero-vis{display:none;}}

        /* stats */
        .lp-stats-strip {
          position:relative;z-index:1;
          border-top:1px solid var(--c-bd); border-bottom:1px solid var(--c-bd);
          background:rgba(15,23,42,.6); backdrop-filter:blur(10px);
        }
        .lp-stats-inner {
          max-width:1200px; margin:0 auto; padding:2rem 1.5rem;
          display:grid; grid-template-columns:repeat(4,1fr); gap:1rem;
        }
        @media(max-width:700px){.lp-stats-inner{grid-template-columns:repeat(2,1fr);}}
        .lp-stat {
          display:flex; flex-direction:column; align-items:center; gap:.4rem;
          padding:1rem; border-radius:12px; border:1px solid var(--c-bd);
          background:rgba(37,99,235,.04); text-align:center;
        }
        .lp-stat-val {
          font-family:var(--ff-d); font-size:1.75rem; font-weight:800;
          background:linear-gradient(135deg,var(--c-rlt),var(--c-sky));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          letter-spacing:-.03em;
        }
        .lp-stat-lbl { font-size:.73rem; color:var(--c-mt); font-weight:500; }

        /* sections */
        .lp-sec { position:relative;z-index:1; padding:6rem 1.5rem; }
        .lp-sec-alt { background:linear-gradient(180deg,rgba(15,23,42,0),rgba(15,23,42,.5),rgba(15,23,42,0)); }
        .lp-sec-inner { max-width:1200px; margin:0 auto; }
        .lp-sec-hd {
          text-align:center; margin-bottom:3.5rem;
          display:flex; flex-direction:column; align-items:center; gap:1rem;
        }
        .lp-sec-tag {
          font-size:.7rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
          color:var(--c-rlt); border:1px solid rgba(37,99,235,.3);
          background:rgba(37,99,235,.07); padding:.28rem .9rem; border-radius:99px;
        }
        .lp-sec-title {
          font-family:var(--ff-d); font-size:clamp(1.5rem,2.8vw,2.2rem);
          font-weight:800; letter-spacing:-.025em; margin:0; max-width:620px; line-height:1.2;
        }
        .lp-sec-sub { font-size:.9rem; color:var(--c-mt); max-width:540px; margin:0; line-height:1.7; }

        /* features */
        .lp-feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
        @media(max-width:900px){.lp-feat-grid{grid-template-columns:1fr;}}
        .lp-feat-card {
          position:relative; padding:2rem 1.75rem; border-radius:16px;
          border:1px solid var(--c-bd); background:rgba(15,23,42,.7);
          display:flex; flex-direction:column; gap:.85rem; overflow:hidden;
          transition:border-color .25s,transform .25s,box-shadow .25s;
        }
        .lp-feat-card:hover { border-color:var(--ac); transform:translateY(-3px); box-shadow:0 0 30px rgba(0,0,0,.3); }
        .lp-feat-card::before {
          content:''; position:absolute; inset:0;
          background:radial-gradient(ellipse 60% 50% at 50% 0%,var(--ac),transparent);
          opacity:.06; pointer-events:none;
        }
        .lp-feat-icon {
          font-size:1.75rem; width:52px; height:52px; border-radius:12px;
          background:rgba(255,255,255,.04); border:1px solid var(--c-bd);
          display:flex; align-items:center; justify-content:center;
        }
        .lp-feat-title { font-family:var(--ff-d); font-size:1rem; font-weight:700; margin:0; }
        .lp-feat-desc  { font-size:.858rem; line-height:1.7; color:var(--c-mt); margin:0; flex:1; }
        .lp-feat-line  { height:2px; border-radius:99px; width:38px; opacity:.6; }

        /* steps */
        .lp-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
        @media(max-width:768px){.lp-steps{grid-template-columns:1fr;}}
        .lp-step {
          display:flex; flex-direction:column; gap:.9rem; padding:2.25rem 1.75rem;
          border-radius:16px; border:1px solid var(--c-bd); background:rgba(15,23,42,.5);
          transition:border-color .25s;
        }
        .lp-step:hover { border-color:var(--c-rl); }
        .lp-step-n {
          font-family:'JetBrains Mono',monospace; font-size:.72rem; font-weight:700;
          letter-spacing:.06em; color:var(--c-rlt);
          background:rgba(37,99,235,.1); border:1px solid rgba(37,99,235,.25);
          border-radius:7px; padding:.22rem .6rem; width:fit-content;
        }
        .lp-step-title { font-family:var(--ff-d); font-size:1.05rem; font-weight:700; margin:0; }
        .lp-step-desc  { font-size:.858rem; line-height:1.7; color:var(--c-mt); margin:0; }

        /* cta */
        .lp-cta-sec { position:relative;z-index:1; padding:5rem 1.5rem; }
        .lp-cta-box {
          position:relative; max-width:720px; margin:0 auto; text-align:center;
          display:flex; flex-direction:column; align-items:center; gap:1.5rem;
          padding:4rem 2rem; border-radius:22px;
          border:1px solid rgba(37,99,235,.3); background:rgba(15,23,42,.8);
          backdrop-filter:blur(20px);
        }
        .lp-cta-box::before {
          content:''; position:absolute; inset:-2px; border-radius:22px;
          background:linear-gradient(135deg,var(--c-rl),var(--c-sky),var(--c-ind));
          opacity:.1; filter:blur(20px); z-index:-1;
        }
        .lp-cta-title {
          font-family:var(--ff-d); font-size:clamp(1.4rem,2.8vw,2.1rem);
          font-weight:800; letter-spacing:-.025em; margin:0; line-height:1.2;
        }
        .lp-cta-sub { font-size:.95rem; color:var(--c-mt); margin:0; max-width:460px; line-height:1.7; }

        @media(max-width:500px){
          .lp-btn-primary,.lp-btn-outline { width:100%; }
          .lp-cta-box { padding:2.5rem 1.25rem; }
        }
      `}</style>
    </div>
  )
}

// ─── رسم الرادار التزييني ───
function RadarArt({ isRTL }) {
  const cards = [
    { top:'6%',   side: isRTL ? 'left:4%'  : 'right:4%',  label: isRTL ? 'تعديل CSS — Telegram' : 'CSS Fix — Telegram',           c:'#3b82f6', d:'0s'  },
    { top:'38%',  side: isRTL ? 'left:-2%' : 'right:-2%', label: isRTL ? 'React Component — Reddit' : 'React Component — Reddit', c:'#0ea5e9', d:'.45s' },
    { top:'68%',  side: isRTL ? 'left:5%'  : 'right:5%',  label: isRTL ? 'WordPress Fix — RSS' : 'WordPress Fix — RSS',           c:'#6366f1', d:'.9s'  },
  ]
  return (
    <div style={{ position:'relative', width:'400px', height:'400px' }}>
      {[1,2,3].map(i=>(
        <div key={i} style={{
          position:'absolute', inset:`${(i-1)*17}%`, borderRadius:'50%',
          border:`1px solid rgba(37,99,235,${.24-i*.06})`,
          animation:`ra ${2+i*.4}s ease-in-out infinite alternate`,
        }}/>
      ))}
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:'60px', height:'60px', borderRadius:'50%',
        background:'linear-gradient(135deg,#2563eb,#0ea5e9)',
        boxShadow:'0 0 40px rgba(37,99,235,.6)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'1.5rem', zIndex:2,
      }}>◈</div>
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        width:'50%', height:'1px',
        transformOrigin:'0 50%',
        background:'linear-gradient(90deg,rgba(37,99,235,.7),transparent)',
        animation:'sw 3s linear infinite',
      }}/>
      {cards.map((c,i)=>(
        <div key={i} style={{
          position:'absolute', top:c.top, ...(Object.fromEntries([c.side.split(':').map((v,j)=>j===1?v.trim():v)])),
          background:'rgba(15,23,42,.95)', border:`1px solid ${c.c}55`,
          borderRadius:'10px', padding:'.45rem .8rem',
          fontSize:'.7rem', fontWeight:600, color:'#e2e8f0',
          whiteSpace:'nowrap', boxShadow:`0 0 16px ${c.c}28`,
          animation:`fl 3s ease-in-out ${c.d} infinite alternate`, zIndex:3,
        }}>
          <span style={{ display:'inline-block', width:'5px', height:'5px', borderRadius:'50%', background:c.c, boxShadow:`0 0 6px ${c.c}`, marginInlineEnd:'6px', verticalAlign:'middle'}}/>
          {c.label}
        </div>
      ))}
      <style>{`
        @keyframes ra { from{opacity:.4;transform:scale(.96)} to{opacity:1;transform:scale(1.02)} }
        @keyframes sw { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fl { from{transform:translateY(0)} to{transform:translateY(-8px)} }
      `}</style>
    </div>
  )
}
