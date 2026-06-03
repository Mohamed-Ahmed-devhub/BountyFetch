// Onboarding.jsx — skill selection on first login
import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import api from '../services/api.js'
import { supabase } from '../services/supabase.js'

const SKILL_GROUPS = [
  { ar: '🎨 الواجهة الأمامية', en: '🎨 Frontend',  skills: ['HTML','CSS','JavaScript','TypeScript','React','Vue.js','Next.js','Tailwind CSS','Bootstrap','Responsive Design'] },
  { ar: '⚙️ الخلفية',          en: '⚙️ Backend',   skills: ['Node.js','Python','PHP','Laravel','Express.js','Django'] },
  { ar: '📱 الموبايل',         en: '📱 Mobile',    skills: ['Flutter','React Native','Dart'] },
  { ar: '🛠 أدوات',            en: '🛠 Tools',     skills: ['WordPress','Shopify','Figma','Git','Firebase','MongoDB','MySQL'] },
]

export default function Onboarding() {
  const { user, updateUser } = useAuth()
  const { isRTL } = useLanguage()
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  const toggle = useCallback(s =>
    setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  , [])

  const handleFinish = async () => {
    if (selected.length === 0) {
      setError(isRTL ? 'اختر مهارة واحدة على الأقل' : 'Select at least one skill')
      return
    }
    setSaving(true)
    try {
      // Save skills to backend
      await api.put('/auth/profile', { skills: selected })
      // Mark onboarded in Supabase profiles table
      if (user?.id) {
        await supabase.from('profiles').upsert({ id: user.id, skills: selected, onboarded: true })
      }
      updateUser({ skills: selected, onboarded: true })
      navigate('/dashboard', { replace: true })
    } catch (e) {
      setError(e.response?.data?.message || (isRTL ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred, please retry'))
      setSaving(false)
    }
  }

  const S = { // minimal inline styles — consistent with rest of project
    root:   { minHeight: '100vh', background: '#F4F6F9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem, 5vw, 2rem)', fontFamily: 'Plus Jakarta Sans, Cairo, sans-serif' },
    card:   { background: '#fff', borderRadius: 16, padding: 'clamp(1.25rem, 5vw, 2.5rem)', maxWidth: 680, width: '100%', boxShadow: '0 4px 24px rgba(0,45,98,.08)', border: '1px solid #D8DEE9' },
    h1:     { fontSize: '1.6rem', fontWeight: 800, color: '#002D62', margin: '0 0 .4rem' },
    sub:    { fontSize: '.95rem', color: '#5A6478', margin: '0 0 2rem' },
    group:  { marginBottom: '1.5rem' },
    label:  { fontSize: '.7rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '.5rem', display: 'block' },
    pills:  { display: 'flex', flexWrap: 'wrap', gap: '.35rem' },
    pill:   (active) => ({ fontSize: '.8rem', fontWeight: active ? 700 : 400, padding: '.3rem .75rem', borderRadius: 99, cursor: 'pointer', border: `1.5px solid ${active ? '#002D62' : '#D8DEE9'}`, background: active ? '#002D62' : '#fff', color: active ? '#fff' : '#5A6478', transition: 'all .15s' }),
    btn:    { width: '100%', padding: '.85rem', borderRadius: 10, border: 'none', background: '#002D62', color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: '1.5rem', transition: 'opacity .15s' },
    err:    { color: '#DC3545', fontSize: '.85rem', marginTop: '.75rem', textAlign: 'center' },
    count:  { fontSize: '.8rem', color: '#002D62', fontWeight: 600, textAlign: isRTL ? 'right' : 'left', marginBottom: '1rem' },
  }

  return (
    <div style={S.root} dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={S.card}>
        <h1 style={S.h1}>{isRTL ? '👋 مرحباً بك في BountyFetch' : '👋 Welcome to BountyFetch'}</h1>
        <p style={S.sub}>{isRTL ? 'اختر مهاراتك لنضبط الرادار على الفرص المناسبة لك' : 'Select your skills so we can tune the radar to your opportunities'}</p>
        <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
          {[
            isRTL ? '🎯 مهام مطابقة لمهاراتك' : '🎯 Tasks matched to your skills',
            isRTL ? '🤖 مقترحات AI أدق' : '🤖 More accurate AI proposals',
            isRTL ? '📊 رادار مخصص لك' : '📊 Personalised radar',
          ].map((t,i) => (
            <span key={i} style={{ fontSize:'.75rem', padding:'.3rem .75rem', borderRadius:99, background:'#EFF6FF', color:'#1D4ED8', border:'1px solid #BFDBFE' }}>{t}</span>
          ))}
        </div>
        {selected.length > 0 && (
          <p style={S.count}>✓ {selected.length} {isRTL ? 'مهارة مختارة' : 'skills selected'}</p>
        )}
        {SKILL_GROUPS.map((g, gi) => (
          <div key={gi} style={S.group}>
            <span style={S.label}>{isRTL ? g.ar : g.en}</span>
            <div style={S.pills}>
              {g.skills.map(s => (
                <button key={s} onClick={() => toggle(s)} style={S.pill(selected.includes(s))}>{s}</button>
              ))}
            </div>
          </div>
        ))}
        <button style={{ ...S.btn, opacity: saving ? .6 : 1 }} onClick={handleFinish} disabled={saving}>
          {saving ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'ابدأ الصيد ←' : '← Start Hunting')}
        </button>
        {error && <p style={S.err}>{error}</p>}
        <div style={{ textAlign:'center', marginTop:'.75rem' }}>
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            style={{ background:'none', border:'none', color:'#94A3B8', fontSize:'.82rem', cursor:'pointer', textDecoration:'underline' }}>
            {isRTL ? 'تخطّ الآن — يمكنني الإضافة لاحقاً' : "Skip for now — I'll add later"}
          </button>
        </div>
      </div>
    </div>
  )
}
