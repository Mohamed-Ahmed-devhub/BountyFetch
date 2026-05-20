// ===================================================
// Dashboard.jsx — صفحة الرادار الرئيسية لـ BountyFetch
// القلب النابض للتطبيق: عرض المهام الحية، الفلترة،
// الإشعارات الفورية، والاتصال بالـ WebSocket
// المسار: frontend/src/pages/Dashboard.jsx
// ===================================================

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar.jsx'
import TaskCard from '../components/radar/TaskCard.jsx'
import { taskService } from '../services/taskService.js'
import { useSocket } from '../hooks/useSocket.js'
import { useNotifications } from '../hooks/useNotifications.js'
import { useLanguage } from '../context/LanguageContext.jsx'

// ─── المصادر المتاحة للفلترة ───
const SOURCES = [
  { id: 'all',      labelAr: 'الكل',      labelEn: 'All Sources', icon: '🌐' },
  { id: 'telegram', labelAr: 'تيليجرام',  labelEn: 'Telegram',    icon: '✈️' },
  { id: 'reddit',   labelAr: 'ريديت',     labelEn: 'Reddit',      icon: '🔴' },
  { id: 'twitter',  labelAr: 'تويتر',     labelEn: 'Twitter/X',   icon: '🐦' },
  { id: 'rss',      labelAr: 'مواقع',     labelEn: 'Job Sites',   icon: '📡' },
]

// ─── المهارات للفلترة ───
const SKILL_GROUPS = [
  {
    groupAr: 'الواجهة الأمامية',
    groupEn: 'Frontend',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'TypeScript'],
  },
  {
    groupAr: 'الخلفية',
    groupEn: 'Backend',
    skills: ['Node.js', 'Python', 'PHP', 'Laravel'],
  },
  {
    groupAr: 'أدوات',
    groupEn: 'Tools',
    skills: ['WordPress', 'Figma', 'Responsive', 'Bootstrap', 'Tailwind'],
  },
]

// ─── بيانات تجريبية تظهر قبل اتصال السيرفر الحقيقي ───
const DEMO_TASKS = [
  {
    id: 'demo-1',
    title: 'إصلاح مشكلة Responsive في صفحة هبوط WordPress',
    description: 'الموقع يظهر بشكل صحيح على الديسكتوب لكن على الموبايل النصوص تتداخل مع بعض في السيكشن الثاني. أحتاج إصلاح سريع.',
    skills: ['CSS', 'WordPress', 'Responsive'],
    budget: '$30 - $60',
    source: 'telegram',
    postedAt: 'منذ 3 دقائق',
    url: '#',
  },
  {
    id: 'demo-2',
    title: 'Need React developer for small dashboard component',
    description: 'Looking for someone to build a simple analytics card component in React with Recharts. Should show line chart with weekly data.',
    skills: ['React', 'JavaScript'],
    budget: '$50 - $100',
    source: 'reddit',
    postedAt: '7 minutes ago',
    url: '#',
  },
  {
    id: 'demo-3',
    title: 'تعديل CSS لصفحة منتجات في متجر Shopify',
    description: 'أريد تعديل طريقة عرض بطاقات المنتجات لتصبح Grid بدلاً من List، مع تحسين التباعد والألوان.',
    skills: ['CSS', 'HTML'],
    budget: '$20 - $40',
    source: 'rss',
    postedAt: 'منذ 12 دقيقة',
    url: '#',
  },
  {
    id: 'demo-4',
    title: 'JavaScript form validation + AJAX submission',
    description: 'Need to add client-side validation to a contact form and submit it via AJAX without page reload. Pure JS only, no jQuery.',
    skills: ['JavaScript', 'HTML'],
    budget: '$25 - $45',
    source: 'twitter',
    postedAt: '18 minutes ago',
    url: '#',
  },
  {
    id: 'demo-5',
    title: 'تصميم Landing Page احترافية لمنتج SaaS',
    description: 'أحتاج مصمم يبني صفحة هبوط كاملة لمنتج برمجي جديد، مع أنيميشن بسيط وتوافق مع الموبايل.',
    skills: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    budget: '$80 - $150',
    source: 'telegram',
    postedAt: 'منذ 25 دقيقة',
    url: '#',
  },
]

// ─────────────────────────────────────────────
// المكوّن الرئيسي
// ─────────────────────────────────────────────
export default function Dashboard() {
  const { isRTL } = useLanguage()

  const [activeSource, setActiveSource]       = useState('all')
  const [selectedSkills, setSelectedSkills]   = useState([])
  const [sidebarOpen, setSidebarOpen]         = useState(true)
  const [taskCount, setTaskCount]             = useState(0)
  const [pulseCount, setPulseCount]           = useState(false)

  // الاتصال بالـ WebSocket
  const { isConnected, newTasks, clearNewTasks } = useSocket()
  const { requestPermission, sendNotification }  = useNotifications()

  // طلب إذن الإشعارات
  useEffect(() => { requestPermission() }, [])

  // إرسال إشعار لكل مهمة جديدة
  useEffect(() => {
    if (newTasks.length > 0) {
      newTasks.forEach(t => sendNotification(t))
      // تأثير نبضة على العداد
      setPulseCount(true)
      setTimeout(() => setPulseCount(false), 1000)
    }
  }, [newTasks])

  // جلب المهام من الـ Backend
  const { data, isLoading } = useQuery({
    queryKey:       ['tasks', activeSource, selectedSkills],
    queryFn:        () => taskService.getTasks({ source: activeSource, skills: selectedSkills }),
    refetchInterval: 60_000,
    placeholderData: { data: { tasks: DEMO_TASKS } }, // بيانات تجريبية ريثما يتصل السيرفر
  })

  // دمج المهام الجديدة (WebSocket) مع القديمة (API)
  const apiTasks   = data?.data?.tasks || DEMO_TASKS
  const allTasks   = [...newTasks, ...apiTasks]

  // فلترة المهام حسب المهارات المختارة
  const filtered = selectedSkills.length === 0
    ? allTasks
    : allTasks.filter(t =>
        t.skills?.some(s => selectedSkills.map(x => x.toLowerCase()).includes(s.toLowerCase()))
      )

  // تحديث العداد
  useEffect(() => { setTaskCount(filtered.length) }, [filtered.length])

  const toggleSkill = useCallback((skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }, [])

  return (
    <div className="db-root" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="db-layout">

        {/* ══════════════════════════════
            SIDEBAR — لوحة الفلاتر
        ══════════════════════════════ */}
        <aside className={`db-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>

          {/* رأس الـ Sidebar */}
          <div className="db-sidebar-head">
            <span className="db-sidebar-title">
              {isRTL ? 'فلتر الرادار' : 'Radar Filter'}
            </span>
            <button
              className="db-sidebar-toggle"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Toggle sidebar"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {sidebarOpen && (
            <>
              {/* مجموعات المهارات */}
              {SKILL_GROUPS.map((group, gi) => (
                <div key={gi} className="db-skill-group">
                  <p className="db-skill-group-label">
                    {isRTL ? group.groupAr : group.groupEn}
                  </p>
                  <div className="db-skill-pills">
                    {group.skills.map(skill => {
                      const active = selectedSkills.includes(skill)
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`db-skill-pill ${active ? 'active' : ''}`}
                        >
                          {skill}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* زر مسح الفلاتر */}
              {selectedSkills.length > 0 && (
                <button
                  className="db-clear-btn"
                  onClick={() => setSelectedSkills([])}
                >
                  {isRTL ? `✕ مسح الفلاتر (${selectedSkills.length})` : `✕ Clear Filters (${selectedSkills.length})`}
                </button>
              )}
            </>
          )}
        </aside>

        {/* ══════════════════════════════
            MAIN — منطقة المهام
        ══════════════════════════════ */}
        <main className="db-main">

          {/* ─── رأس الصفحة ─── */}
          <div className="db-header">
            <div className="db-header-left">
              <h1 className="db-title">
                {isRTL ? '📡 رادار القنص' : '📡 Bounty Radar'}
              </h1>
              <div className="db-status-row">
                {/* مؤشر الاتصال */}
                <div className={`db-conn-dot ${isConnected ? 'connected' : 'disconnected'}`} />
                <span className="db-status-text">
                  {isConnected
                    ? (isRTL ? 'متصل — يرصد الآن' : 'Connected — Scanning')
                    : (isRTL ? 'غير متصل' : 'Disconnected')}
                </span>
                <span className="db-sep">·</span>
                {/* عداد المهام */}
                <span className={`db-task-count ${pulseCount ? 'pulse' : ''}`}>
                  {taskCount} {isRTL ? 'مهمة' : 'tasks'}
                </span>
              </div>
            </div>

            {/* إشعار مهام جديدة من الـ WebSocket */}
            <AnimatePresence>
              {newTasks.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: .9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: .9 }}
                  className="db-new-badge"
                  onClick={clearNewTasks}
                >
                  🎯 {newTasks.length} {isRTL ? 'مهمة جديدة — اضغط للعرض' : 'new tasks — click to view'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ─── فلتر المصادر ─── */}
          <div className="db-sources-row">
            {SOURCES.map(src => (
              <button
                key={src.id}
                onClick={() => setActiveSource(src.id)}
                className={`db-source-btn ${activeSource === src.id ? 'active' : ''}`}
              >
                <span className="db-source-icon">{src.icon}</span>
                {isRTL ? src.labelAr : src.labelEn}
              </button>
            ))}
          </div>

          {/* ─── قائمة المهام ─── */}
          <div className="db-feed">
            {isLoading ? (
              /* Skeleton Loading */
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="db-skeleton">
                  <div className="db-sk-line w-1/4" />
                  <div className="db-sk-line w-3/4" style={{ height: '18px' }} />
                  <div className="db-sk-line w-full" />
                  <div className="db-sk-line w-1/3" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              /* حالة فارغة */
              <div className="db-empty">
                <div className="db-empty-icon">📭</div>
                <p className="db-empty-title">
                  {isRTL ? 'لا توجد مهام مطابقة' : 'No matching tasks found'}
                </p>
                <p className="db-empty-desc">
                  {isRTL
                    ? 'جرّب تعديل فلاتر المهارات أو انتظر قليلاً — الرادار يعمل'
                    : 'Try adjusting skill filters or wait — the radar is scanning'}
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.map((task, i) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: .97 }}
                    transition={{ duration: .25, delay: Math.min(i * .04, .3) }}
                  >
                    <TaskCard task={task} isNew={newTasks.some(t => t.id === task.id)} isRTL={isRTL} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>

      {/* ── الأنماط ── */}
      <style>{`
        .db-root {
          --db-bg:      #020617;
          --db-surface: #0f172a;
          --db-border:  #1e293b;
          --db-bl:      #334155;
          --db-royal:   #2563eb;
          --db-rlt:     #3b82f6;
          --db-sky:     #0ea5e9;
          --db-green:   #22c55e;
          --db-red:     #f87171;
          --db-text:    #f1f5f9;
          --db-muted:   #94a3b8;
          --db-subtle:  #475569;

          min-height: 100vh;
          background: var(--db-bg);
          color: var(--db-text);
          font-family: 'DM Sans','Tajawal',system-ui,sans-serif;
        }

        /* ── Layout ── */
        .db-layout {
          display: flex;
          height: calc(100vh - 64px);
          overflow: hidden;
        }

        /* ── SIDEBAR ── */
        .db-sidebar {
          background: var(--db-surface);
          border-inline-end: 1px solid var(--db-border);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.25rem;
          overflow-y: auto;
          transition: width .3s ease, padding .3s ease;
          flex-shrink: 0;
        }
        .db-sidebar.open   { width: 240px; }
        .db-sidebar.closed { width: 52px; padding: 1.25rem .5rem; overflow: hidden; }
        @media (max-width: 768px) {
          .db-sidebar { display: none; }
        }

        .db-sidebar-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 24px;
        }
        .db-sidebar-title {
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--db-subtle);
          white-space: nowrap;
          overflow: hidden;
        }
        .db-sidebar-toggle {
          background: none;
          border: 1px solid var(--db-border);
          border-radius: 7px;
          color: var(--db-muted);
          cursor: pointer;
          padding: .3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color .2s, color .2s;
        }
        .db-sidebar-toggle:hover {
          border-color: var(--db-rlt);
          color: var(--db-text);
        }

        /* مجموعات المهارات */
        .db-skill-group { display: flex; flex-direction: column; gap: .6rem; }
        .db-skill-group-label {
          font-size: .68rem;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--db-subtle);
        }
        .db-skill-pills { display: flex; flex-wrap: wrap; gap: .4rem; }
        .db-skill-pill {
          font-size: .74rem;
          font-weight: 500;
          padding: .28rem .65rem;
          border-radius: 99px;
          border: 1px solid var(--db-border);
          background: transparent;
          color: var(--db-muted);
          cursor: pointer;
          transition: all .2s;
          white-space: nowrap;
        }
        .db-skill-pill:hover { border-color: var(--db-rlt); color: var(--db-text); }
        .db-skill-pill.active {
          background: rgba(37,99,235,.15);
          border-color: var(--db-royal);
          color: var(--db-rlt);
          font-weight: 700;
        }
        .db-clear-btn {
          font-size: .75rem;
          font-weight: 600;
          color: var(--db-red);
          background: rgba(248,113,113,.08);
          border: 1px solid rgba(248,113,113,.2);
          border-radius: 8px;
          padding: .45rem .75rem;
          cursor: pointer;
          transition: background .2s;
          text-align: start;
        }
        .db-clear-btn:hover { background: rgba(248,113,113,.15); }

        /* ── MAIN ── */
        .db-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 1.5rem;
          gap: 1.25rem;
        }
        @media (max-width: 600px) { .db-main { padding: 1rem .85rem; } }

        /* رأس الصفحة */
        .db-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .db-header-left { display: flex; flex-direction: column; gap: .35rem; }
        .db-title {
          font-family: 'Syne','Cairo',system-ui,sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -.025em;
          margin: 0;
        }
        .db-status-row {
          display: flex;
          align-items: center;
          gap: .5rem;
          flex-wrap: wrap;
        }
        .db-conn-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .db-conn-dot.connected {
          background: var(--db-green);
          box-shadow: 0 0 8px var(--db-green);
          animation: navPulse 1.6s ease-in-out infinite;
        }
        .db-conn-dot.disconnected { background: var(--db-red); }
        @keyframes navPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.4); opacity: .6; }
        }
        .db-status-text { font-size: .78rem; color: var(--db-muted); }
        .db-sep { color: var(--db-bl); font-size: .7rem; }
        .db-task-count {
          font-size: .78rem;
          font-weight: 700;
          color: var(--db-rlt);
          transition: transform .3s;
        }
        .db-task-count.pulse { animation: countPulse .4s ease; }
        @keyframes countPulse {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        /* شارة المهام الجديدة */
        .db-new-badge {
          font-size: .8rem;
          font-weight: 700;
          padding: .5rem 1rem;
          border-radius: 99px;
          background: rgba(34,197,94,.1);
          border: 1px solid rgba(34,197,94,.35);
          color: #4ade80;
          cursor: pointer;
          transition: background .2s;
        }
        .db-new-badge:hover { background: rgba(34,197,94,.18); }

        /* فلتر المصادر */
        .db-sources-row {
          display: flex;
          gap: .5rem;
          overflow-x: auto;
          padding-bottom: .25rem;
          flex-shrink: 0;
        }
        .db-sources-row::-webkit-scrollbar { height: 0; }
        .db-source-btn {
          display: flex;
          align-items: center;
          gap: .4rem;
          font-size: .8rem;
          font-weight: 600;
          padding: .42rem .9rem;
          border-radius: 99px;
          border: 1px solid var(--db-border);
          background: transparent;
          color: var(--db-muted);
          cursor: pointer;
          white-space: nowrap;
          transition: all .2s;
        }
        .db-source-btn:hover { border-color: var(--db-rlt); color: var(--db-text); }
        .db-source-btn.active {
          background: linear-gradient(135deg, var(--db-royal), var(--db-sky));
          border-color: transparent;
          color: #fff;
        }
        .db-source-icon { font-size: .9rem; }

        /* قائمة المهام */
        .db-feed {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: .85rem;
          padding-inline-end: .25rem;
        }
        .db-feed::-webkit-scrollbar { width: 4px; }
        .db-feed::-webkit-scrollbar-track { background: transparent; }
        .db-feed::-webkit-scrollbar-thumb {
          background: var(--db-border);
          border-radius: 2px;
        }

        /* Skeleton */
        .db-skeleton {
          background: var(--db-surface);
          border: 1px solid var(--db-border);
          border-radius: 14px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: .7rem;
        }
        .db-sk-line {
          height: 12px;
          border-radius: 6px;
          background: var(--db-border);
          animation: skShimmer 1.4s ease-in-out infinite;
        }
        .db-sk-line.w-1\/4 { width: 25%; }
        .db-sk-line.w-3\/4 { width: 75%; }
        .db-sk-line.w-full  { width: 100%; }
        .db-sk-line.w-1\/3  { width: 33%; }
        @keyframes skShimmer {
          0%,100% { opacity: .5; }
          50%      { opacity: 1; }
        }

        /* حالة فارغة */
        .db-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: .75rem;
          padding: 3rem;
        }
        .db-empty-icon  { font-size: 3rem; }
        .db-empty-title { font-size: 1.05rem; font-weight: 700; color: var(--db-text); margin: 0; }
        .db-empty-desc  { font-size: .85rem; color: var(--db-muted); max-width: 340px; margin: 0; line-height: 1.6; }
      `}</style>
    </div>
  )
}
