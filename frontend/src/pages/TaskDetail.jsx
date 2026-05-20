// ===================================================
// TaskDetail.jsx — صفحة تفاصيل المهمة الكاملة
// تعرض المهمة + مولد البروبوزال الذكي جنباً لجنب
// المسار: frontend/src/pages/TaskDetail.jsx
// ===================================================

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar.jsx'
import { taskService } from '../services/taskService.js'
import { aiService } from '../services/aiService.js'
import { useLanguage } from '../context/LanguageContext.jsx'

// بيانات تجريبية لعرض الصفحة بدون سيرفر
const DEMO_TASK = {
  id: 'demo-1',
  title: 'إصلاح مشكلة Responsive في صفحة هبوط WordPress',
  description: `الموقع يعمل بشكل جيد على الديسكتوب لكن على الموبايل والتابلت، النصوص في السيكشن الثاني تتداخل مع الصور وبعض الأزرار تخرج عن حدود الشاشة.

المشكلة بالتحديد في الـ CSS لعنصر .hero-content داخل section.about. أحتاج:
1. تعديل الـ Flexbox ليتحول لـ Column على الشاشات الصغيرة
2. إصلاح margin الأزرار
3. تعديل حجم الخطوط على الموبايل

يمكن مراجعة الكود عبر الرابط (سأشاركه مع المبرمج المختار).`,
  skills: ['CSS', 'WordPress', 'Responsive Design', 'HTML'],
  budget: '$30 - $60',
  source: 'telegram',
  postedAt: 'منذ 3 دقائق',
  url: 'https://t.me/example',
  matchScore: 95,
}

const SOURCE_CONFIG = {
  telegram: { color: '#0ea5e9', label: 'Telegram', emoji: '✈️' },
  reddit:   { color: '#f97316', label: 'Reddit',   emoji: '🔴' },
  twitter:  { color: '#60a5fa', label: 'Twitter',  emoji: '🐦' },
  rss:      { color: '#a78bfa', label: 'Sites',    emoji: '📡' },
}

export default function TaskDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { isRTL }    = useLanguage()

  // حالة البروبوزال
  const [proposal, setProposal]       = useState('')
  const [proposalLang, setProposalLang] = useState(null)
  const [generating, setGenerating]   = useState(false)
  const [copied, setCopied]           = useState(false)
  const [genError, setGenError]       = useState('')

  // جلب المهمة
  const { data, isLoading } = useQuery({
    queryKey:       ['task', id],
    queryFn:        () => taskService.getTaskById(id),
    placeholderData: { data: DEMO_TASK },
    retry: false,
  })

  const task = data?.data || DEMO_TASK
  const src  = SOURCE_CONFIG[task.source] || SOURCE_CONFIG.rss

  // توليد البروبوزال
  const generateProposal = async (lang) => {
    setProposalLang(lang)
    setGenerating(true)
    setProposal('')
    setGenError('')
    try {
      const res = await aiService.generateProposal(id, lang)
      setProposal(res.data.proposal)
    } catch {
      setGenError(isRTL ? 'فشل توليد البروبوزال — تحقق من الاتصال وحاول مجدداً' : 'Failed to generate — check your connection and retry')
    } finally {
      setGenerating(false)
    }
  }

  const copyProposal = () => {
    navigator.clipboard.writeText(proposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (isLoading) return (
    <div className="td-root" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <div className="td-loading">
        <div className="td-spinner" />
        <p>{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
      </div>
      <TdStyles />
    </div>
  )

  return (
    <div className="td-root" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="td-container">

        {/* ─── زر الرجوع ─── */}
        <button className="td-back" onClick={() => navigate('/dashboard')}>
          {isRTL ? '→ العودة للرادار' : '← Back to Radar'}
        </button>

        <div className="td-grid">

          {/* ══════════════════════════════
              العمود الأول — تفاصيل المهمة
          ══════════════════════════════ */}
          <motion.section
            className="td-task-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .35 }}
          >
            {/* المصدر والوقت */}
            <div className="td-meta-row">
              <span className="td-source" style={{ color: src.color, background: `${src.color}15`, borderColor: `${src.color}40` }}>
                {src.emoji} {src.label}
              </span>
              <span className="td-time">{task.postedAt}</span>

              {/* نسبة التطابق */}
              {task.matchScore && (
                <span className="td-match" style={{
                  color: task.matchScore >= 80 ? '#4ade80' : task.matchScore >= 50 ? '#fbbf24' : '#f87171'
                }}>
                  {task.matchScore >= 80 ? '✦' : task.matchScore >= 50 ? '◈' : '○'} {task.matchScore}%{' '}
                  {isRTL ? 'تطابق' : 'match'}
                </span>
              )}
            </div>

            {/* عنوان المهمة */}
            <h1 className="td-title">{task.title}</h1>

            {/* الوصف الكامل */}
            <div className="td-desc-box">
              <p className="td-desc">{task.description}</p>
            </div>

            {/* المهارات */}
            <div className="td-section">
              <p className="td-section-label">
                {isRTL ? '🛠 المهارات المطلوبة' : '🛠 Required Skills'}
              </p>
              <div className="td-skills">
                {task.skills?.map(s => (
                  <span key={s} className="td-skill">{s}</span>
                ))}
              </div>
            </div>

            {/* الميزانية */}
            <div className="td-section">
              <p className="td-section-label">
                {isRTL ? '💰 الميزانية المقترحة' : '💰 Estimated Budget'}
              </p>
              <p className="td-budget">{task.budget || (isRTL ? 'مفتوح للتفاوض' : 'Open for negotiation')}</p>
            </div>

            {/* رابط المصدر */}
            {task.url && task.url !== '#' && (
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="td-source-link"
                onClick={e => e.stopPropagation()}
              >
                {isRTL ? 'عرض المنشور الأصلي ↗' : 'View Original Post ↗'}
              </a>
            )}
          </motion.section>

          {/* ══════════════════════════════
              العمود الثاني — مولد البروبوزال
          ══════════════════════════════ */}
          <motion.section
            className="td-proposal-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .35, delay: .1 }}
          >
            <div className="td-proposal-head">
              <div>
                <h2 className="td-proposal-title">
                  🤖 {isRTL ? 'مولّد العروض الذكي' : 'AI Proposal Engine'}
                </h2>
                <p className="td-proposal-sub">
                  {isRTL
                    ? 'اضغط توليد واحصل على عرض عمل جاهز للإرسال في ثوانٍ'
                    : 'Click generate and get a ready-to-send proposal in seconds'}
                </p>
              </div>
            </div>

            {/* أزرار التوليد */}
            <div className="td-gen-btns">
              <button
                className={`td-gen-btn td-gen-ar ${generating && proposalLang === 'ar' ? 'loading' : ''}`}
                onClick={() => generateProposal('ar')}
                disabled={generating}
              >
                {generating && proposalLang === 'ar' ? (
                  <><span className="td-btn-spinner" />{isRTL ? 'جاري التوليد...' : 'Generating...'}</>
                ) : '✍️ ' + (isRTL ? 'عرض بالعربية' : 'Arabic Proposal')}
              </button>
              <button
                className={`td-gen-btn td-gen-en ${generating && proposalLang === 'en' ? 'loading' : ''}`}
                onClick={() => generateProposal('en')}
                disabled={generating}
              >
                {generating && proposalLang === 'en' ? (
                  <><span className="td-btn-spinner" />Generating...</>
                ) : '✍️ English Proposal'}
              </button>
            </div>

            {/* حالة التوليد */}
            {generating && (
              <div className="td-generating">
                <div className="td-gen-dots">
                  <span /><span /><span />
                </div>
                <p>{isRTL ? 'الذكاء الاصطناعي يصيغ عرضك...' : 'AI is crafting your proposal...'}</p>
              </div>
            )}

            {/* رسالة الخطأ */}
            {genError && !generating && (
              <div className="td-error">{genError}</div>
            )}

            {/* منطقة البروبوزال */}
            {proposal && !generating && (
              <motion.div
                className="td-proposal-output"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: .4 }}
              >
                <div className="td-proposal-toolbar">
                  <span className="td-proposal-lang-badge">
                    {proposalLang === 'ar' ? '🇸🇦 عربي' : '🇺🇸 English'}
                  </span>
                  <button className="td-copy-btn" onClick={copyProposal}>
                    {copied
                      ? (isRTL ? '✅ تم النسخ!' : '✅ Copied!')
                      : (isRTL ? '📋 نسخ' : '📋 Copy')}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={proposal}
                  rows={10}
                  dir={proposalLang === 'ar' ? 'rtl' : 'ltr'}
                  className="td-proposal-text"
                />
              </motion.div>
            )}

            {/* placeholder قبل التوليد */}
            {!proposal && !generating && !genError && (
              <div className="td-proposal-placeholder">
                <div className="td-placeholder-icon">✦</div>
                <p>{isRTL ? 'اضغط أحد الأزرار أعلاه لتوليد عرضك الاحترافي' : 'Press a button above to generate your professional proposal'}</p>
              </div>
            )}
          </motion.section>
        </div>
      </div>

      <TdStyles />
    </div>
  )
}

// ─── الأنماط ───
function TdStyles() {
  return (
    <style>{`
      .td-root {
        --td-bg:      #020617;
        --td-surface: #0f172a;
        --td-border:  #1e293b;
        --td-bl:      #334155;
        --td-royal:   #2563eb;
        --td-rlt:     #3b82f6;
        --td-sky:     #0ea5e9;
        --td-text:    #f1f5f9;
        --td-muted:   #94a3b8;
        --td-subtle:  #475569;

        min-height: 100vh;
        background: var(--td-bg);
        color: var(--td-text);
        font-family: 'DM Sans','Tajawal',system-ui,sans-serif;
      }

      .td-loading {
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        height: 60vh; gap: 1rem;
        color: var(--td-muted); font-size: .9rem;
      }
      .td-spinner {
        width: 36px; height: 36px;
        border-radius: 50%;
        border: 2px solid var(--td-border);
        border-top-color: var(--td-rlt);
        animation: tdSpin .8s linear infinite;
      }
      @keyframes tdSpin { to { transform: rotate(360deg); } }

      .td-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1.5rem 4rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      @media (max-width: 600px) { .td-container { padding: 1.25rem .85rem 3rem; } }

      .td-back {
        font-size: .82rem;
        font-weight: 600;
        color: var(--td-muted);
        background: none;
        border: 1px solid var(--td-border);
        border-radius: 8px;
        padding: .4rem .9rem;
        cursor: pointer;
        width: fit-content;
        transition: color .2s, border-color .2s;
      }
      .td-back:hover { color: var(--td-text); border-color: var(--td-bl); }

      /* Grid رئيسي */
      .td-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        align-items: start;
      }
      @media (max-width: 900px) { .td-grid { grid-template-columns: 1fr; } }

      /* بطاقة المهمة */
      .td-task-card, .td-proposal-card {
        background: var(--td-surface);
        border: 1px solid var(--td-border);
        border-radius: 18px;
        padding: 1.75rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      /* Meta row */
      .td-meta-row {
        display: flex;
        align-items: center;
        gap: .6rem;
        flex-wrap: wrap;
      }
      .td-source {
        font-size: .72rem; font-weight: 700;
        padding: .2rem .65rem;
        border-radius: 99px; border: 1px solid;
        letter-spacing: .03em;
      }
      .td-time { font-size: .72rem; color: var(--td-subtle); margin-inline-start: auto; }
      .td-match {
        font-size: .72rem; font-weight: 700;
        padding: .2rem .6rem;
        border-radius: 99px;
        background: rgba(0,0,0,.3);
        border: 1px solid currentColor;
        opacity: .8;
      }

      .td-title {
        font-family: 'Syne','Cairo',system-ui,sans-serif;
        font-size: 1.2rem; font-weight: 800;
        line-height: 1.4; margin: 0;
        color: var(--td-text);
      }

      .td-desc-box {
        background: rgba(0,0,0,.2);
        border: 1px solid var(--td-border);
        border-radius: 10px;
        padding: 1rem;
      }
      .td-desc {
        font-size: .875rem; line-height: 1.75;
        color: var(--td-muted); margin: 0;
        white-space: pre-line;
      }

      .td-section { display: flex; flex-direction: column; gap: .55rem; }
      .td-section-label {
        font-size: .72rem; font-weight: 700;
        letter-spacing: .08em; text-transform: uppercase;
        color: var(--td-subtle);
      }
      .td-skills { display: flex; flex-wrap: wrap; gap: .4rem; }
      .td-skill {
        font-size: .73rem; font-weight: 600;
        padding: .25rem .65rem;
        border-radius: 99px;
        background: rgba(99,102,241,.1);
        border: 1px solid rgba(99,102,241,.25);
        color: #a5b4fc;
      }
      .td-budget {
        font-family: 'JetBrains Mono','Fira Code',monospace;
        font-size: 1.1rem; font-weight: 800;
        color: #4ade80; margin: 0;
      }
      .td-source-link {
        font-size: .8rem; color: var(--td-rlt);
        text-decoration: none; font-weight: 600;
        border-bottom: 1px solid rgba(59,130,246,.3);
        width: fit-content;
        padding-bottom: 1px;
        transition: border-color .2s;
      }
      .td-source-link:hover { border-color: var(--td-rlt); }

      /* بطاقة البروبوزال */
      .td-proposal-head { display: flex; flex-direction: column; gap: .3rem; }
      .td-proposal-title {
        font-family: 'Syne','Cairo',system-ui,sans-serif;
        font-size: 1.1rem; font-weight: 800; margin: 0;
        color: var(--td-rlt);
      }
      .td-proposal-sub { font-size: .8rem; color: var(--td-muted); margin: 0; }

      /* أزرار التوليد */
      .td-gen-btns {
        display: flex; gap: .75rem; flex-wrap: wrap;
      }
      .td-gen-btn {
        flex: 1; min-width: 140px;
        display: flex; align-items: center; justify-content: center; gap: .4rem;
        font-size: .85rem; font-weight: 700;
        padding: .65rem 1rem;
        border-radius: 10px;
        cursor: pointer;
        transition: all .2s;
        border: none;
      }
      .td-gen-ar {
        background: linear-gradient(135deg, #2563eb, #0ea5e9);
        color: #fff;
      }
      .td-gen-ar:hover { box-shadow: 0 6px 20px rgba(37,99,235,.4); transform: translateY(-1px); }
      .td-gen-en {
        background: rgba(37,99,235,.1);
        border: 1px solid rgba(37,99,235,.3) !important;
        color: var(--td-rlt);
        border: none;
      }
      .td-gen-en:hover { background: rgba(37,99,235,.18); }
      .td-gen-btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }

      .td-btn-spinner {
        width: 14px; height: 14px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,.3);
        border-top-color: #fff;
        animation: tdSpin .7s linear infinite;
        flex-shrink: 0;
      }

      /* أنيميشن التوليد */
      .td-generating {
        display: flex; flex-direction: column;
        align-items: center; gap: .75rem;
        padding: 2rem;
        color: var(--td-rlt);
        font-size: .85rem;
      }
      .td-gen-dots {
        display: flex; gap: .35rem;
      }
      .td-gen-dots span {
        width: 8px; height: 8px;
        border-radius: 50%;
        background: var(--td-rlt);
        animation: tdDot 1.2s ease-in-out infinite;
      }
      .td-gen-dots span:nth-child(2) { animation-delay: .2s; }
      .td-gen-dots span:nth-child(3) { animation-delay: .4s; }
      @keyframes tdDot {
        0%,80%,100% { transform: scale(.6); opacity: .4; }
        40%          { transform: scale(1); opacity: 1; }
      }

      .td-error {
        background: rgba(248,113,113,.08);
        border: 1px solid rgba(248,113,113,.25);
        border-radius: 10px;
        padding: .85rem 1rem;
        font-size: .82rem;
        color: #fca5a5;
      }

      /* منطقة البروبوزال */
      .td-proposal-output { display: flex; flex-direction: column; gap: .6rem; }
      .td-proposal-toolbar {
        display: flex; align-items: center;
        justify-content: space-between;
      }
      .td-proposal-lang-badge {
        font-size: .72rem; font-weight: 700;
        padding: .2rem .65rem;
        border-radius: 99px;
        background: rgba(37,99,235,.1);
        border: 1px solid rgba(37,99,235,.25);
        color: var(--td-rlt);
      }
      .td-copy-btn {
        font-size: .78rem; font-weight: 700;
        padding: .35rem .8rem;
        border-radius: 8px;
        border: 1px solid var(--td-bl);
        background: transparent;
        color: var(--td-muted);
        cursor: pointer;
        transition: all .2s;
      }
      .td-copy-btn:hover { border-color: var(--td-rlt); color: var(--td-text); }
      .td-proposal-text {
        width: 100%;
        background: rgba(0,0,0,.25);
        border: 1px solid var(--td-border);
        border-radius: 12px;
        padding: 1rem;
        font-size: .85rem;
        line-height: 1.75;
        color: #e2e8f0;
        resize: vertical;
        min-height: 220px;
        font-family: 'DM Sans','Tajawal',system-ui,sans-serif;
        outline: none;
        transition: border-color .2s;
      }
      .td-proposal-text:focus { border-color: var(--td-bl); }

      /* Placeholder */
      .td-proposal-placeholder {
        display: flex; flex-direction: column;
        align-items: center; gap: .75rem;
        padding: 3rem 1rem;
        text-align: center;
        color: var(--td-subtle);
        border: 1px dashed var(--td-border);
        border-radius: 12px;
      }
      .td-placeholder-icon {
        font-size: 2rem;
        color: var(--td-bl);
      }
      .td-proposal-placeholder p { font-size: .85rem; line-height: 1.6; margin: 0; }
    `}</style>
  )
}
