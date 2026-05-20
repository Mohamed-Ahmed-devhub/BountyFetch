// ===================================================
// TaskCard.jsx — بطاقة المهمة في الرادار
// تعرض ملخص المهمة وتتيح الانتقال لصفحة التفاصيل
// المسار: frontend/src/components/radar/TaskCard.jsx
// ===================================================

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── لون ومؤشر كل مصدر ──
const SOURCE_CONFIG = {
  telegram: { color: '#0ea5e9', bgColor: 'rgba(14,165,233,.1)', label: 'Telegram', emoji: '✈️' },
  reddit:   { color: '#f97316', bgColor: 'rgba(249,115,22,.1)',  label: 'Reddit',   emoji: '🔴' },
  twitter:  { color: '#60a5fa', bgColor: 'rgba(96,165,250,.1)', label: 'Twitter',  emoji: '🐦' },
  rss:      { color: '#a78bfa', bgColor: 'rgba(167,139,250,.1)', label: 'Sites',    emoji: '📡' },
}

export default function TaskCard({ task, isNew = false, isRTL = false }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const src = SOURCE_CONFIG[task.source] || SOURCE_CONFIG.rss

  return (
    <article
      className={`tc-card ${isNew ? 'tc-card-new' : ''}`}
      onClick={() => navigate(`/task/${task.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/task/${task.id}`)}
      aria-label={task.title}
    >
      {/* شارة "جديد" */}
      {isNew && (
        <span className="tc-new-badge">
          {isRTL ? '⚡ جديد' : '⚡ NEW'}
        </span>
      )}

      {/* ─── رأس البطاقة ─── */}
      <div className="tc-head">
        {/* مصدر المهمة */}
        <span
          className="tc-source"
          style={{ color: src.color, background: src.bgColor, borderColor: `${src.color}40` }}
        >
          {src.emoji} {src.label}
        </span>

        {/* الوقت + زر الحفظ */}
        <div className="tc-head-right">
          <span className="tc-time">{task.postedAt}</span>
          <button
            className={`tc-save-btn ${saved ? 'saved' : ''}`}
            onClick={e => { e.stopPropagation(); setSaved(v => !v) }}
            aria-label={saved ? 'Unsave task' : 'Save task'}
            title={isRTL ? (saved ? 'إلغاء الحفظ' : 'حفظ') : (saved ? 'Unsave' : 'Save')}
          >
            {saved ? '🔖' : '📌'}
          </button>
        </div>
      </div>

      {/* ─── عنوان المهمة ─── */}
      <h3 className="tc-title" dir={isRTL ? 'rtl' : 'ltr'}>
        {task.title}
      </h3>

      {/* ─── وصف مختصر ─── */}
      <p className="tc-desc" dir={isRTL ? 'rtl' : 'ltr'}>
        {task.description}
      </p>

      {/* ─── المهارات المطلوبة ─── */}
      {task.skills?.length > 0 && (
        <div className="tc-skills">
          {task.skills.map(skill => (
            <span key={skill} className="tc-skill-tag">{skill}</span>
          ))}
        </div>
      )}

      {/* ─── تذييل البطاقة ─── */}
      <div className="tc-footer">
        {/* الميزانية */}
        <span className="tc-budget">
          <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm.75 9.5H7.25v-1H5.5V8h1.75V6H5.5V4.5h1.75V3.5h1.5v1h.75c.83 0 1.5.67 1.5 1.5S10.33 7.5 9.5 7.5H8.5V8h1c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-.75v1z"/>
          </svg>
          {task.budget || (isRTL ? 'غير محدد' : 'Open')}
        </span>

        {/* زر الاصطياد */}
        <button
          className="tc-hunt-btn"
          onClick={e => { e.stopPropagation(); navigate(`/task/${task.id}`) }}
        >
          {isRTL ? 'اصطد ← ' : '→ Hunt'}
        </button>
      </div>

      {/* ─── خط تمييز جانبي ─── */}
      <div className="tc-accent-bar" style={{ background: src.color }} />

      <style>{`
        .tc-card {
          position: relative;
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 14px;
          padding: 1.1rem 1.25rem;
          cursor: pointer;
          transition: border-color .2s, transform .2s, box-shadow .2s;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: .7rem;
        }
        .tc-card:hover {
          border-color: #334155;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,.25);
        }
        .tc-card-new {
          border-color: rgba(34,197,94,.35) !important;
          box-shadow: 0 0 20px rgba(34,197,94,.08) !important;
        }

        /* شارة جديد */
        .tc-new-badge {
          position: absolute;
          top: .75rem;
          inset-inline-end: .75rem;
          font-size: .62rem;
          font-weight: 800;
          letter-spacing: .06em;
          color: #4ade80;
          background: rgba(34,197,94,.1);
          border: 1px solid rgba(34,197,94,.3);
          border-radius: 99px;
          padding: .18rem .55rem;
        }

        /* رأس البطاقة */
        .tc-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: .5rem;
          flex-wrap: wrap;
        }
        .tc-source {
          font-size: .7rem;
          font-weight: 700;
          letter-spacing: .04em;
          padding: .22rem .65rem;
          border-radius: 99px;
          border: 1px solid;
          white-space: nowrap;
        }
        .tc-head-right {
          display: flex;
          align-items: center;
          gap: .5rem;
          margin-inline-start: auto;
        }
        .tc-time {
          font-size: .7rem;
          color: #475569;
        }
        .tc-save-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: .85rem;
          padding: .15rem;
          border-radius: 5px;
          transition: transform .2s;
        }
        .tc-save-btn:hover { transform: scale(1.2); }

        /* عنوان المهمة */
        .tc-title {
          font-family: 'Syne','Cairo',system-ui,sans-serif;
          font-size: .95rem;
          font-weight: 700;
          color: #f1f5f9;
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* الوصف */
        .tc-desc {
          font-size: .82rem;
          line-height: 1.6;
          color: #64748b;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* المهارات */
        .tc-skills {
          display: flex;
          flex-wrap: wrap;
          gap: .35rem;
        }
        .tc-skill-tag {
          font-size: .68rem;
          font-weight: 600;
          padding: .2rem .55rem;
          border-radius: 99px;
          background: rgba(99,102,241,.1);
          border: 1px solid rgba(99,102,241,.25);
          color: #a5b4fc;
        }

        /* التذييل */
        .tc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: .5rem;
          margin-top: .1rem;
        }
        .tc-budget {
          display: flex;
          align-items: center;
          gap: .3rem;
          font-size: .78rem;
          font-weight: 700;
          font-family: 'JetBrains Mono','Fira Code',monospace;
          color: #4ade80;
        }
        .tc-hunt-btn {
          font-size: .78rem;
          font-weight: 700;
          padding: .38rem .85rem;
          border-radius: 8px;
          border: 1px solid rgba(37,99,235,.4);
          background: rgba(37,99,235,.1);
          color: #60a5fa;
          cursor: pointer;
          transition: all .2s;
          white-space: nowrap;
        }
        .tc-hunt-btn:hover {
          background: rgba(37,99,235,.2);
          border-color: #3b82f6;
          color: #fff;
        }

        /* الخط الجانبي */
        .tc-accent-bar {
          position: absolute;
          inset-inline-start: 0;
          top: 20%;
          bottom: 20%;
          width: 3px;
          border-radius: 0 2px 2px 0;
          opacity: .6;
        }
      `}</style>
    </article>
  )
}
