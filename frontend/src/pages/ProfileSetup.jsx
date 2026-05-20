// ===================================================
// ProfileSetup.jsx — صفحة إعداد الملف الشخصي
// يختار المستخدم مهاراته بعد التسجيل مباشرة
// المسار: frontend/src/pages/ProfileSetup.jsx
// ===================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar.jsx'
import { authService } from '../services/authService.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

// ─── مجموعات المهارات ───
const SKILL_GROUPS = [
  {
    groupAr: '🎨 الواجهة الأمامية',
    groupEn: '🎨 Frontend',
    skills: [
      { name: 'HTML',             levelAr: 'أساسي',    levelEn: 'Basic' },
      { name: 'CSS',              levelAr: 'أساسي',    levelEn: 'Basic' },
      { name: 'JavaScript',       levelAr: 'متوسط',    levelEn: 'Intermediate' },
      { name: 'TypeScript',       levelAr: 'متقدم',    levelEn: 'Advanced' },
      { name: 'React',            levelAr: 'متوسط',    levelEn: 'Intermediate' },
      { name: 'Vue.js',           levelAr: 'متوسط',    levelEn: 'Intermediate' },
      { name: 'Next.js',          levelAr: 'متقدم',    levelEn: 'Advanced' },
      { name: 'Tailwind CSS',     levelAr: 'أساسي',    levelEn: 'Basic' },
      { name: 'Bootstrap',        levelAr: 'أساسي',    levelEn: 'Basic' },
      { name: 'Responsive Design',levelAr: 'أساسي',    levelEn: 'Basic' },
    ],
  },
  {
    groupAr: '⚙️ الخلفية',
    groupEn: '⚙️ Backend',
    skills: [
      { name: 'Node.js',    levelAr: 'متوسط', levelEn: 'Intermediate' },
      { name: 'Python',     levelAr: 'متوسط', levelEn: 'Intermediate' },
      { name: 'PHP',        levelAr: 'متوسط', levelEn: 'Intermediate' },
      { name: 'Laravel',    levelAr: 'متقدم', levelEn: 'Advanced' },
      { name: 'Express.js', levelAr: 'متوسط', levelEn: 'Intermediate' },
    ],
  },
  {
    groupAr: '🗄️ قواعد البيانات',
    groupEn: '🗄️ Databases',
    skills: [
      { name: 'MySQL',      levelAr: 'متوسط', levelEn: 'Intermediate' },
      { name: 'PostgreSQL', levelAr: 'متقدم', levelEn: 'Advanced' },
      { name: 'MongoDB',    levelAr: 'متوسط', levelEn: 'Intermediate' },
      { name: 'Firebase',   levelAr: 'أساسي', levelEn: 'Basic' },
    ],
  },
  {
    groupAr: '🛠 أدوات ومنصات',
    groupEn: '🛠 Tools & Platforms',
    skills: [
      { name: 'WordPress', levelAr: 'أساسي', levelEn: 'Basic' },
      { name: 'Shopify',   levelAr: 'أساسي', levelEn: 'Basic' },
      { name: 'Figma',     levelAr: 'أساسي', levelEn: 'Basic' },
      { name: 'Git/GitHub',levelAr: 'أساسي', levelEn: 'Basic' },
      { name: 'Docker',    levelAr: 'متقدم', levelEn: 'Advanced' },
    ],
  },
]

// ألوان المستويات
const LEVEL_COLORS = {
  أساسي:    { bg: 'rgba(34,197,94,.08)',   border: 'rgba(34,197,94,.25)',   text: '#4ade80' },
  متوسط:    { bg: 'rgba(251,191,36,.08)',  border: 'rgba(251,191,36,.25)',  text: '#fbbf24' },
  متقدم:    { bg: 'rgba(59,130,246,.08)',  border: 'rgba(59,130,246,.25)',  text: '#60a5fa' },
  Basic:        { bg: 'rgba(34,197,94,.08)',   border: 'rgba(34,197,94,.25)',   text: '#4ade80' },
  Intermediate: { bg: 'rgba(251,191,36,.08)',  border: 'rgba(251,191,36,.25)',  text: '#fbbf24' },
  Advanced:     { bg: 'rgba(59,130,246,.08)',  border: 'rgba(59,130,246,.25)',  text: '#60a5fa' },
}

export default function ProfileSetup() {
  const { isRTL }          = useLanguage()
  const { user }           = useAuth()
  const navigate           = useNavigate()

  const [selected, setSelected] = useState([])
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [step, setStep]         = useState('skills') // 'skills' | 'done'

  const toggleSkill = (skillName) => {
    setSelected(prev =>
      prev.includes(skillName)
        ? prev.filter(s => s !== skillName)
        : [...prev, skillName]
    )
  }

  const handleSave = async () => {
    if (selected.length === 0) return
    setSaving(true)
    try {
      await authService.updateSkills(selected)
      setSaved(true)
      setStep('done')
    } catch (err) {
      console.error('خطأ في حفظ المهارات:', err)
    } finally {
      setSaving(false)
    }
  }

  const allSkillsCount = SKILL_GROUPS.reduce((sum, g) => sum + g.skills.length, 0)
  const progress = Math.round((selected.length / allSkillsCount) * 100)

  return (
    <div className="ps-root" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <AnimatePresence mode="wait">
        {step === 'skills' ? (
          <motion.div
            key="skills"
            className="ps-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* ─── رأس الصفحة ─── */}
            <div className="ps-head">
              <div className="ps-head-text">
                <h1 className="ps-title">
                  {isRTL ? '⚡ اختر مهاراتك' : '⚡ Select Your Skills'}
                </h1>
                <p className="ps-sub">
                  {isRTL
                    ? 'الرادار سيستخدم هذه المعلومات لإرسال أدق الفرص المناسبة لك فقط'
                    : 'The radar will use this to send you only the most relevant opportunities'}
                </p>
              </div>

              {/* شريط التقدم */}
              <div className="ps-progress-wrap">
                <div className="ps-progress-info">
                  <span className="ps-progress-count">
                    {selected.length} {isRTL ? 'مهارة مختارة' : 'skills selected'}
                  </span>
                  <span className="ps-progress-pct">{progress}%</span>
                </div>
                <div className="ps-progress-bar">
                  <motion.div
                    className="ps-progress-fill"
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>
            </div>

            {/* ─── مجموعات المهارات ─── */}
            <div className="ps-groups">
              {SKILL_GROUPS.map((group, gi) => (
                <div key={gi} className="ps-group">
                  <h2 className="ps-group-title">
                    {isRTL ? group.groupAr : group.groupEn}
                  </h2>
                  <div className="ps-skills-grid">
                    {group.skills.map((skill) => {
                      const isActive = selected.includes(skill.name)
                      const levelKey = isRTL ? skill.levelAr : skill.levelEn
                      const levelStyle = LEVEL_COLORS[levelKey] || LEVEL_COLORS.Basic

                      return (
                        <motion.button
                          key={skill.name}
                          whileTap={{ scale: .96 }}
                          onClick={() => toggleSkill(skill.name)}
                          className={`ps-skill-btn ${isActive ? 'ps-skill-active' : ''}`}
                        >
                          {/* أيقونة الاختيار */}
                          <span className="ps-skill-check">
                            {isActive ? '✓' : ''}
                          </span>

                          <span className="ps-skill-name">{skill.name}</span>

                          {/* مستوى الصعوبة */}
                          <span
                            className="ps-skill-level"
                            style={{
                              background: levelStyle.bg,
                              border:     `1px solid ${levelStyle.border}`,
                              color:      levelStyle.text,
                            }}
                          >
                            {isRTL ? skill.levelAr : skill.levelEn}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* ─── أزرار الإجراء ─── */}
            <div className="ps-actions">
              {selected.length > 0 && (
                <div className="ps-selected-preview">
                  <p className="ps-preview-label">
                    {isRTL ? 'المهارات المختارة:' : 'Selected:'}
                  </p>
                  <div className="ps-preview-tags">
                    {selected.map(s => (
                      <span key={s} className="ps-preview-tag">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="ps-btn-row">
                <button
                  className="ps-skip-btn"
                  onClick={() => navigate('/dashboard')}
                >
                  {isRTL ? 'تخطي الآن، سأكمل لاحقاً' : 'Skip for now, I\'ll do it later'}
                </button>

                <button
                  className="ps-save-btn"
                  onClick={handleSave}
                  disabled={saving || selected.length === 0}
                >
                  {saving ? (
                    <><span className="ps-spinner" /> {isRTL ? 'جاري الحفظ...' : 'Saving...'}</>
                  ) : (
                    <>
                      {isRTL
                        ? `حفظ (${selected.length}) مهارة وابدأ ←`
                        : `→ Save (${selected.length}) skills & Start`}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

        ) : (
          /* ─── شاشة النجاح ─── */
          <motion.div
            key="done"
            className="ps-done"
            initial={{ opacity: 0, scale: .92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="ps-done-icon">🎯</div>
            <h2 className="ps-done-title">
              {isRTL ? 'ملفك جاهز!' : 'Profile Ready!'}
            </h2>
            <p className="ps-done-sub">
              {isRTL
                ? `الرادار الآن معدّل بدقة على ${selected.length} مهارة. ستصلك الفرص المناسبة فور ظهورها.`
                : `The radar is now precisely tuned to ${selected.length} skills. You'll get matching opportunities as soon as they appear.`}
            </p>
            <button
              className="ps-save-btn"
              onClick={() => navigate('/dashboard')}
              style={{ marginTop: '1rem' }}
            >
              {isRTL ? 'افتح الرادار ←' : '→ Open Radar'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .ps-root {
          --ps-bg:      #020617;
          --ps-surface: #0f172a;
          --ps-border:  #1e293b;
          --ps-bl:      #334155;
          --ps-royal:   #2563eb;
          --ps-rlt:     #3b82f6;
          --ps-sky:     #0ea5e9;
          --ps-text:    #f1f5f9;
          --ps-muted:   #94a3b8;
          --ps-subtle:  #475569;

          min-height: 100vh;
          background: var(--ps-bg);
          color: var(--ps-text);
          font-family: 'DM Sans','Tajawal',system-ui,sans-serif;
        }

        .ps-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        @media (max-width: 600px) { .ps-container { padding: 1.5rem .9rem 4rem; } }

        /* رأس الصفحة */
        .ps-head {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .ps-title {
          font-family: 'Syne','Cairo',system-ui,sans-serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800; letter-spacing: -.025em; margin: 0;
        }
        .ps-sub { font-size: .9rem; color: var(--ps-muted); margin: 0; line-height: 1.6; }

        /* شريط التقدم */
        .ps-progress-wrap { display: flex; flex-direction: column; gap: .5rem; }
        .ps-progress-info {
          display: flex; justify-content: space-between;
          font-size: .78rem; color: var(--ps-muted);
        }
        .ps-progress-count { font-weight: 600; }
        .ps-progress-pct { color: var(--ps-rlt); font-weight: 700; }
        .ps-progress-bar {
          height: 4px; background: var(--ps-border);
          border-radius: 99px; overflow: hidden;
        }
        .ps-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--ps-royal), var(--ps-sky));
          border-radius: 99px;
          min-width: 0;
        }

        /* مجموعات المهارات */
        .ps-groups { display: flex; flex-direction: column; gap: 2rem; }
        .ps-group { display: flex; flex-direction: column; gap: 1rem; }
        .ps-group-title {
          font-family: 'Syne','Cairo',system-ui,sans-serif;
          font-size: 1rem; font-weight: 700; margin: 0;
          color: var(--ps-text);
          padding-bottom: .65rem;
          border-bottom: 1px solid var(--ps-border);
        }

        .ps-skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: .6rem;
        }
        @media (max-width: 480px) {
          .ps-skills-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .ps-skill-btn {
          display: flex;
          align-items: center;
          gap: .5rem;
          padding: .65rem .85rem;
          border-radius: 11px;
          border: 1px solid var(--ps-border);
          background: var(--ps-surface);
          cursor: pointer;
          transition: all .2s;
          text-align: start;
          position: relative;
          overflow: hidden;
        }
        .ps-skill-btn:hover {
          border-color: var(--ps-bl);
          background: rgba(255,255,255,.03);
        }
        .ps-skill-active {
          border-color: var(--ps-royal) !important;
          background: rgba(37,99,235,.08) !important;
        }
        .ps-skill-active::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(37,99,235,.06), transparent);
        }

        .ps-skill-check {
          width: 18px; height: 18px;
          border-radius: 5px;
          border: 1px solid var(--ps-border);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          font-size: .7rem; font-weight: 800;
          color: #fff;
          flex-shrink: 0;
          transition: all .2s;
        }
        .ps-skill-active .ps-skill-check {
          background: linear-gradient(135deg, var(--ps-royal), var(--ps-sky));
          border-color: transparent;
        }

        .ps-skill-name {
          font-size: .82rem; font-weight: 600;
          color: var(--ps-muted);
          flex: 1;
          transition: color .2s;
        }
        .ps-skill-active .ps-skill-name { color: var(--ps-text); }

        .ps-skill-level {
          font-size: .6rem; font-weight: 700;
          padding: .15rem .45rem;
          border-radius: 99px;
          letter-spacing: .04em;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* أزرار الإجراء */
        .ps-actions {
          display: flex; flex-direction: column; gap: 1.25rem;
          position: sticky; bottom: 0;
          background: linear-gradient(to top, var(--ps-bg) 80%, transparent);
          padding: 1.5rem 0 .5rem;
          margin-top: -1rem;
        }

        .ps-selected-preview {
          display: flex; flex-direction: column; gap: .5rem;
        }
        .ps-preview-label {
          font-size: .72rem; font-weight: 700;
          color: var(--ps-subtle); margin: 0;
          letter-spacing: .06em; text-transform: uppercase;
        }
        .ps-preview-tags { display: flex; flex-wrap: wrap; gap: .35rem; }
        .ps-preview-tag {
          font-size: .72rem; font-weight: 600;
          padding: .2rem .6rem;
          border-radius: 99px;
          background: rgba(37,99,235,.1);
          border: 1px solid rgba(37,99,235,.25);
          color: var(--ps-rlt);
        }

        .ps-btn-row {
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
        }

        .ps-skip-btn {
          font-size: .82rem; font-weight: 500;
          color: var(--ps-subtle);
          background: none; border: none;
          cursor: pointer; padding: .4rem;
          transition: color .2s;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .ps-skip-btn:hover { color: var(--ps-muted); }

        .ps-save-btn {
          display: flex; align-items: center; gap: .5rem;
          font-size: .95rem; font-weight: 700;
          padding: .8rem 1.75rem;
          border-radius: 12px; border: none;
          background: linear-gradient(135deg, var(--ps-royal), var(--ps-sky));
          color: #fff; cursor: pointer;
          transition: all .2s;
        }
        .ps-save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(37,99,235,.4);
        }
        .ps-save-btn:disabled { opacity: .45; cursor: not-allowed; }

        .ps-spinner {
          width: 16px; height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          animation: psSpin .75s linear infinite;
        }
        @keyframes psSpin { to { transform: rotate(360deg); } }

        /* شاشة النجاح */
        .ps-done {
          max-width: 480px; margin: 0 auto;
          padding: 4rem 1.5rem;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          gap: 1rem;
        }
        .ps-done-icon { font-size: 4rem; }
        .ps-done-title {
          font-family: 'Syne','Cairo',system-ui,sans-serif;
          font-size: 2rem; font-weight: 800; margin: 0;
          background: linear-gradient(135deg, #60a5fa, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ps-done-sub {
          font-size: .95rem; color: var(--ps-muted);
          line-height: 1.7; margin: 0;
        }
      `}</style>
    </div>
  )
}
