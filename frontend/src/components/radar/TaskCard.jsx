import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { formatDate } from '../../utils/formatDate.js'

const SOURCE_COLORS = {
  reddit:   { bg: '#FFF1E6', text: '#C05621', border: '#FBD38D' },
  telegram: { bg: '#EBF8FF', text: '#2B6CB0', border: '#BEE3F8' },
  twitter:  { bg: '#EBF8FF', text: '#2C7A7B', border: '#81E6D9' },
  default:  { bg: '#F0FFF4', text: '#276749', border: '#9AE6B4' },
}

const SOURCE_ICONS = {
  reddit:   '🔴',
  telegram: '📨',
  twitter:  '🐦',
  default:  '🌐',
}

const TaskCard = memo(function TaskCard({ task, isNew = false }) {
  const { isRTL, language } = useLanguage()
  const navigate            = useNavigate()

  const src    = task.source?.toLowerCase() || 'default'
  const colors = SOURCE_COLORS[src] || SOURCE_COLORS.default
  const icon   = SOURCE_ICONS[src]  || SOURCE_ICONS.default

  const S = {
    card: {
      background: '#fff',
      border: `1px solid ${isNew ? '#002D62' : '#E2E8F0'}`,
      borderRadius: 12,
      padding: '1rem 1.1rem',
      cursor: 'pointer',
      transition: 'box-shadow .15s, transform .15s',
      position: 'relative',
      direction: isRTL ? 'rtl' : 'ltr',
    },
    top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem', marginBottom: '.55rem' },
    title: { fontSize: '.9rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.4, flex: 1 },
    badge: {
      fontSize: '.65rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 99,
      background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
      whiteSpace: 'nowrap', flexShrink: 0,
    },
    newBadge: {
      position: 'absolute', top: -8, left: isRTL ? 'auto' : 10, right: isRTL ? 10 : 'auto',
      fontSize: '.6rem', fontWeight: 800, padding: '.15rem .5rem', borderRadius: 99,
      background: '#002D62', color: '#fff', letterSpacing: '.05em',
    },
    skills: { display: 'flex', flexWrap: 'wrap', gap: '.25rem', marginBottom: '.6rem' },
    skill: {
      fontSize: '.72rem', padding: '.2rem .55rem', borderRadius: 99,
      background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0',
    },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '.3rem' },
    source: { fontSize: '.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '.3rem' },
    budget: { fontSize: '.78rem', fontWeight: 700, color: '#15803D', background: '#F0FFF4', padding: '.2rem .55rem', borderRadius: 99, border: '1px solid #BBF7D0' },
    date: { fontSize: '.72rem', color: '#94A3B8' },
  }

  return (
    <div
      style={S.card}
      onClick={() => navigate(`/task/${task.id}`)}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,45,98,.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {isNew && <span style={S.newBadge}>● NEW</span>}

      <div style={S.top}>
        <span style={S.title}>{task.title}</span>
        <span style={S.badge}>{icon} {task.source}</span>
      </div>

      {task.skills?.length > 0 && (
        <div style={S.skills}>
          {task.skills.slice(0, 5).map(s => <span key={s} style={S.skill}>{s}</span>)}
          {task.skills.length > 5 && <span style={S.skill}>+{task.skills.length - 5}</span>}
        </div>
      )}

      <div style={S.footer}>
        <span style={S.source}>{icon} {task.source}</span>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          {task.budget && <span style={S.budget}>💰 {task.budget}</span>}
          <span style={S.date}>{formatDate(task.postedAt, language)}</span>
        </div>
      </div>
    </div>
  )
})

export default TaskCard
