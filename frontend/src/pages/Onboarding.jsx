import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

const ROLES = [
  { id: 'freelancer', icon: '💻', ar: 'مبرمج / فريلانسر', en: 'Developer / Freelancer', desc_ar: 'أبحث عن مشاريع وفرص برمجية', desc_en: 'I hunt coding projects & opportunities' },
  { id: 'client',     icon: '🏢', ar: 'صاحب مشروع / عميل', en: 'Project Owner / Client',  desc_ar: 'أبحث عن مطورين لتنفيذ مشاريعي', desc_en: 'I look for developers to build my projects' },
]

const SPECIALTIES = [
  { id: 'frontend',      icon: '🎨', ar: 'تطوير ويب (فرونتيند)', en: 'Web Frontend' },
  { id: 'backend',       icon: '⚙️', ar: 'تطوير ويب (باكيند)',   en: 'Web Backend' },
  { id: 'fullstack',     icon: '🖥️', ar: 'فول ستاك',            en: 'Full Stack' },
  { id: 'mobile',        icon: '📱', ar: 'تطبيقات موبايل',       en: 'Mobile Apps' },
  { id: 'ui_ux',         icon: '✏️', ar: 'تصميم UI/UX',          en: 'UI/UX Design' },
  { id: 'data_science',  icon: '📊', ar: 'علم البيانات / AI',    en: 'Data Science / AI' },
  { id: 'cybersecurity', icon: '🔐', ar: 'أمن سيبراني',          en: 'Cybersecurity' },
  { id: 'game_dev',      icon: '🎮', ar: 'تطوير الألعاب',        en: 'Game Development' },
  { id: 'devops',        icon: '☁️', ar: 'DevOps / Cloud',       en: 'DevOps / Cloud' },
]

export default function Onboarding() {
  const { user, updateUser } = useAuth()
  const { isRTL }            = useLanguage()
  const navigate             = useNavigate()

  const [step, setStep]           = useState(1)
  const [role, setRole]           = useState('')
  const [specialty, setSpecialty] = useState('')
  const [saving, setSaving]       = useState(false)

  const save = async () => {
    if (!role || !specialty) return
    setSaving(true)
    try {
      await supabase.from('profiles').upsert({
        id:        user.id,
        role,
        specialty,
        onboarded: true,
      }, { onConflict: 'id' })
      updateUser({ role, specialty, onboarded: true })
      navigate('/dashboard')
    } catch { navigate('/dashboard') }
    finally { setSaving(false) }
  }

  const card_style = (selected, color = '#002D62') => ({
    border:     `2px solid ${selected ? color : '#D8DEE9'}`,
    borderRadius: 14,
    padding:    '1.25rem 1.1rem',
    cursor:     'pointer',
    background: selected ? `${color}10` : '#fff',
    transition: 'all .2s',
    textAlign:  'center',
    boxShadow:  selected ? `0 0 0 3px ${color}20` : '0 1px 4px rgba(0,45,98,.06)',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={{ width: '100%', maxWidth: 600, background: '#fff', borderRadius: 20, padding: '2.5rem', boxShadow: '0 8px 40px rgba(0,45,98,.1)', border: '1px solid #D8DEE9' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: '#002D62', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.4rem', margin: '0 auto 1rem' }}>B</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '.4rem', marginBottom: '1rem' }}>
            {[1,2].map(s => (
              <div key={s} style={{ height: 4, width: s === step ? 48 : 24, borderRadius: 99, background: s <= step ? '#002D62' : '#D8DEE9', transition: 'all .3s' }} />
            ))}
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#002D62', margin: '0 0 .4rem' }}>
            {step === 1 ? (isRTL ? '👋 أهلاً بك في BountyFetch' : '👋 Welcome to BountyFetch') : (isRTL ? '🎯 ما هو تخصصك؟' : '🎯 What is your specialty?')}
          </h1>
          <p style={{ fontSize: '.88rem', color: '#5A6478', margin: 0 }}>
            {step === 1
              ? (isRTL ? 'أخبرنا عن نفسك لنُخصص تجربتك على المنصة' : 'Tell us about yourself to personalize your experience')
              : (isRTL ? 'اختر مجالك الرئيسي حتى يعرض لك الرادار أدق الفرص' : 'Choose your main field so the radar shows the most relevant tasks')}
          </p>
        </div>

        {/* Step 1 — Role */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {ROLES.map(r => (
              <div key={r.id} onClick={() => setRole(r.id)} style={card_style(role === r.id)}>
                <div style={{ fontSize: '2.2rem', marginBottom: '.6rem' }}>{r.icon}</div>
                <p style={{ fontWeight: 700, color: '#002D62', margin: '0 0 .3rem', fontSize: '.95rem' }}>{isRTL ? r.ar : r.en}</p>
                <p style={{ fontSize: '.78rem', color: '#5A6478', margin: 0, lineHeight: 1.5 }}>{isRTL ? r.desc_ar : r.desc_en}</p>
                {role === r.id && <div style={{ marginTop: '.6rem', fontSize: '1rem' }}>✅</div>}
              </div>
            ))}
          </div>
        )}

        {/* Step 2 — Specialty */}
        {step === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.75rem', marginBottom: '1.5rem' }}>
            {SPECIALTIES.map(s => (
              <div key={s.id} onClick={() => setSpecialty(s.id)} style={card_style(specialty === s.id, '#002D62')}>
                <div style={{ fontSize: '1.5rem', marginBottom: '.4rem' }}>{s.icon}</div>
                <p style={{ fontWeight: specialty === s.id ? 700 : 500, color: specialty === s.id ? '#002D62' : '#1A1A2E', margin: 0, fontSize: '.78rem', lineHeight: 1.4 }}>{isRTL ? s.ar : s.en}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'space-between' }}>
          {step === 2 && (
            <button onClick={() => setStep(1)} style={{ padding: '.72rem 1.4rem', borderRadius: 10, border: '1.5px solid #D8DEE9', background: 'transparent', color: '#5A6478', fontWeight: 600, cursor: 'pointer', fontSize: '.9rem' }}>
              {isRTL ? '→ رجوع' : '← Back'}
            </button>
          )}
          <button
            onClick={step === 1 ? () => { if (role) setStep(2) } : save}
            disabled={step === 1 ? !role : (!specialty || saving)}
            style={{ flex: 1, padding: '.8rem', borderRadius: 10, background: '#002D62', color: '#fff', fontWeight: 700, border: 'none', cursor: (!role && step===1) || (!specialty && step===2) ? 'not-allowed' : 'pointer', opacity: (!role && step===1) || (!specialty && step===2) ? .45 : 1, fontSize: '.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', transition: 'all .2s' }}
          >
            {saving
              ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />{isRTL ? 'جاري الحفظ...' : 'Saving...'}</>
              : step === 1 ? (isRTL ? 'التالي ←' : '→ Next') : (isRTL ? 'ابدأ الاصطياد 🎯' : '🎯 Start Hunting')}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '.75rem', color: '#94A3B8', marginTop: '1rem', marginBottom: 0 }}>
          {isRTL ? 'يمكنك تعديل هذه البيانات لاحقاً من ملفك الشخصي' : 'You can update this info later from your profile'}
        </p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
