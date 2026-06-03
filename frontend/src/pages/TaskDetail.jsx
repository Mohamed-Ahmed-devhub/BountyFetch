// TaskDetail.jsx — full task view with AI proposal generation
import React, { useState, useEffect } from 'react'
import ErrorBoundary from '../components/ui/ErrorBoundary.jsx'
import { useParams, useNavigate }      from 'react-router-dom'
import { useAuth }                     from '../context/AuthContext.jsx'
import { useLanguage }                 from '../context/LanguageContext.jsx'
import { taskService }                 from '../services/taskService.js'
import { aiService }                   from '../services/aiService.js'
import { formatDate }                  from '../utils/formatDate.js'

export default function TaskDetail() {
  const { id }             = useParams()
  const { user }           = useAuth()
  const { isRTL, language } = useLanguage()
  const navigate           = useNavigate()

  const [task,     setTask]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [proposal, setProposal] = useState(null)
  const [propLang, setPropLang] = useState(language || 'ar')
  const [genLoading, setGenLoading] = useState(false)
  const [copied,   setCopied]   = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => {
    setLoading(true)
    taskService.getTaskById(id)
      .then(r => setTask(r.data))
      .catch(() => setError(isRTL ? 'لم يتم العثور على المهمة' : 'Task not found'))
      .finally(() => setLoading(false))
  }, [id])

  const generateProposal = async () => {
    setGenLoading(true)
    setError('')
    try {
      const r = await aiService.generateProposal(id, propLang)
      setProposal(r.data.proposal)
    } catch (e) {
      setError(e.response?.data?.message || (isRTL ? 'فشل توليد المقترح' : 'Proposal generation failed'))
    } finally {
      setGenLoading(false)
    }
  }

  const copyProposal = () => {
    const text = proposal
      ? (typeof proposal === 'object' ? (proposal[propLang] || proposal.ar) : proposal)
      : ''
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const S = {
    root:    { minHeight: '100vh', background: '#F4F6F9', padding: 'clamp(.75rem, 4vw, 2rem)', fontFamily: 'Plus Jakarta Sans, Cairo, sans-serif', direction: isRTL ? 'rtl' : 'ltr' },
    inner:   { maxWidth: 760, margin: '0 auto' },
    back:    { fontSize: '.85rem', color: '#5A6478', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '.35rem', marginBottom: '1.25rem', background: 'none', border: 'none', padding: 0 },
    card:    { background: '#fff', borderRadius: 14, padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,45,98,.07)', border: '1px solid #E2E8F0', marginBottom: '1.25rem' },
    title:   { fontSize: '1.35rem', fontWeight: 800, color: '#1E293B', margin: '0 0 .6rem' },
    meta:    { display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '1rem', alignItems: 'center' },
    badge:   (bg, c, b) => ({ fontSize: '.75rem', fontWeight: 600, padding: '.25rem .65rem', borderRadius: 99, background: bg, color: c, border: `1px solid ${b}` }),
    desc:    { fontSize: '.9rem', color: '#334155', lineHeight: 1.7, margin: '1rem 0', whiteSpace: 'pre-wrap' },
    skills:  { display: 'flex', flexWrap: 'wrap', gap: '.35rem', margin: '1rem 0' },
    skill:   { fontSize: '.8rem', padding: '.25rem .65rem', borderRadius: 99, background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' },
    link:    { display: 'inline-flex', alignItems: 'center', gap: '.3rem', fontSize: '.85rem', color: '#2563EB', textDecoration: 'none', fontWeight: 600, marginTop: '.5rem' },
    aiCard:  { background: '#fff', borderRadius: 14, padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,45,98,.07)', border: '1px solid #E2E8F0' },
    aiTitle: { fontSize: '1rem', fontWeight: 800, color: '#002D62', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '.4rem' },
    langRow: { display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' },
    langBtn: (a) => ({ padding: '.4rem 1rem', borderRadius: 7, border: `1.5px solid ${a ? '#002D62' : '#D8DEE9'}`, background: a ? '#002D62' : '#fff', color: a ? '#fff' : '#5A6478', fontWeight: a ? 700 : 500, fontSize: '.85rem', cursor: 'pointer' }),
    genBtn:  { width: '100%', padding: '.85rem', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#002D62,#1D4ED8)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'opacity .15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' },
    propBox: { background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '1.25rem', marginTop: '1rem', fontSize: '.9rem', color: '#1E293B', lineHeight: 1.75, whiteSpace: 'pre-wrap' },
    copyBtn: { marginTop: '.75rem', padding: '.55rem 1.25rem', borderRadius: 8, border: '1.5px solid #002D62', background: 'transparent', color: '#002D62', fontWeight: 600, fontSize: '.85rem', cursor: 'pointer' },
    highlight: { display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginTop: '.75rem' },
    hTag:    { fontSize: '.78rem', padding: '.2rem .6rem', borderRadius: 99, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' },
    err:     { color: '#DC2626', fontSize: '.85rem', marginTop: '.75rem', textAlign: 'center' },
  }

  if (loading) return (
    <div style={S.root}>
      <div style={S.inner}>
        <div style={{ width:80, height:14, background:'#E2E8F0', borderRadius:6, marginBottom:'1.5rem', animation:'shimmer 1.4s infinite'}}/>
        <div style={{ background:'#fff', borderRadius:14, padding:'1.75rem', border:'1px solid #E2E8F0', marginBottom:'1.25rem' }}>
          <div style={{ background:'#E2E8F0', height:22, width:'70%', borderRadius:6, marginBottom:12, animation:'shimmer 1.4s infinite'}}/>
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {[60,80,100].map(w=><div key={w} style={{ background:'#E2E8F0', height:24, width:w, borderRadius:99, animation:'shimmer 1.4s infinite'}}/>)}
          </div>
          {[100,85,90,60].map((w,i)=><div key={i} style={{ background:'#E2E8F0', height:12, width:w+'%', borderRadius:6, marginBottom:8, animation:'shimmer 1.4s infinite'}}/>)}
        </div>
        <div style={{ background:'#fff', borderRadius:14, padding:'1.75rem', border:'1px solid #E2E8F0', height:160, animation:'shimmer 1.4s infinite'}}/>
      </div>
      <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:.5}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!task) return (
    <div style={S.root}>
      <div style={S.inner}>
        <p style={{ color: '#DC2626', textAlign: 'center' }}>{error || (isRTL ? 'المهمة غير موجودة' : 'Task not found')}</p>
        <button style={S.back} onClick={() => navigate('/dashboard')}>← {isRTL ? 'الرادار' : 'Radar'}</button>
      </div>
    </div>
  )

  const proposalText = proposal
    ? (typeof proposal === 'object' ? (proposal[propLang] || proposal.ar || '') : proposal)
    : ''

  return (
    <div style={S.root}>
      <div style={S.inner}>
        <button style={S.back} onClick={() => navigate('/dashboard')}>
          ← {isRTL ? 'العودة للرادار' : 'Back to Radar'}
        </button>

        {/* Task card */}
        <div style={S.card}>
          <h1 style={S.title}>{task.title}</h1>
          <div style={S.meta}>
            <span style={S.badge('#EBF8FF','#2B6CB0','#BEE3F8')}>{task.source}</span>
            {task.budget && <span style={S.badge('#F0FFF4','#276749','#9AE6B4')}>💰 {task.budget}</span>}
            <span style={S.badge('#F1F5F9','#475569','#E2E8F0')}>{formatDate(task.postedAt, language)}</span>
          </div>
          {task.description && <p style={S.desc}>{task.description}</p>}
          {task.skills?.length > 0 && (
            <div style={S.skills}>
              {task.skills.map(s => <span key={s} style={S.skill}>{s}</span>)}
            </div>
          )}
          {task.url && (
            <a href={task.url} target="_blank" rel="noopener noreferrer" style={S.link}>
              🔗 {isRTL ? 'عرض المهمة الأصلية' : 'View Original Task'} ↗
            </a>
          )}
        </div>

        {/* AI Proposal */}
        <div style={S.aiCard}>
          <h2 style={S.aiTitle}>🤖 {isRTL ? 'مولّد المقترح الذكي' : 'AI Proposal Generator'}</h2>

          <div style={S.langRow}>
            <button style={S.langBtn(propLang === 'ar')} onClick={() => setPropLang('ar')}>🇸🇦 عربي</button>
            <button style={S.langBtn(propLang === 'en')} onClick={() => setPropLang('en')}>🇬🇧 English</button>
          </div>

          <button
            style={{ ...S.genBtn, opacity: genLoading ? .6 : 1 }}
            onClick={generateProposal}
            disabled={genLoading}
          >
            {genLoading
              ? <><Spinner/> {isRTL ? 'يُولّد Gemini مقترحك...' : 'Gemini is writing your proposal...'}</>
              : `🚀 ${isRTL ? 'ولّد مقترحاً احترافياً' : 'Generate Professional Proposal'}`}
          </button>

          {error && <p style={S.err}>{error}</p>}

          {proposal && (
            <>
              <div style={S.propBox} dir={propLang === 'ar' ? 'rtl' : 'ltr'}>{proposalText}</div>
              {typeof proposal === 'object' && proposal.highlights?.length > 0 && (
                <div style={S.highlight}>
                  {proposal.highlights.map((h, i) => <span key={i} style={S.hTag}>✓ {h}</span>)}
                </div>
              )}
              <button style={S.copyBtn} onClick={copyProposal}>
                {copied ? '✅ ' + (isRTL ? 'تم النسخ' : 'Copied!') : '📋 ' + (isRTL ? 'نسخ المقترح' : 'Copy Proposal')}
              </button>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function Spinner({ color = '#fff' }) {
  return <span style={{ width: 14, height: 14, border: `2px solid ${color}40`, borderTopColor: color, borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block', flexShrink: 0 }} />
}
