// ProfileSetup.jsx — Professional profile editing with avatar upload
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate }   from 'react-router-dom'
import { useAuth }       from '../context/AuthContext.jsx'
import { useLanguage }   from '../context/LanguageContext.jsx'
import { authService }   from '../services/authService.js'

const SKILL_GROUPS = [
  { ar: '🎨 الواجهة الأمامية', en: '🎨 Frontend',
    skills: ['HTML','CSS','JavaScript','TypeScript','React','Vue.js','Next.js','Tailwind CSS','Bootstrap','Responsive Design'] },
  { ar: '⚙️ الخلفية',          en: '⚙️ Backend',
    skills: ['Node.js','Python','PHP','Laravel','Express.js','Django','MySQL','MongoDB','PostgreSQL','Firebase'] },
  { ar: '📱 الموبايل',         en: '📱 Mobile',
    skills: ['Flutter','React Native','Dart','Swift','Kotlin'] },
  { ar: '🛠 أدوات وأخرى',     en: '🛠 Tools & Other',
    skills: ['WordPress','Shopify','Figma','Git','Docker','AWS','Linux','GraphQL','REST APIs'] },
]

export default function ProfileSetup() {
  const { user, updateUser } = useAuth()
  const { isRTL }            = useLanguage()
  const navigate             = useNavigate()

  const [tab,      setTab]      = useState('skills')
  const [selected, setSelected] = useState(user?.skills || [])
  const [bio,      setBio]      = useState(user?.bio || '')
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || '')
  const [linkedin, setLinkedin] = useState(user?.linkedinUrl || '')
  const [github,   setGithub]   = useState(user?.githubUrl || '')
  const [years,    setYears]    = useState(user?.yearsExperience || '')
  const [avatar,   setAvatar]   = useState(user?.avatar || null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState({ text: '', type: '' })

  useEffect(() => { setSelected(user?.skills || []) }, [user])

  const toggle = useCallback(s =>
    setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]), [])

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      // Upload avatar first if changed
      if (avatar && typeof avatar !== 'string') {
        const avatarRes = await authService.uploadAvatar(avatar)
        updateUser({ avatar: avatarRes.data.avatarUrl })
      }
      // Save profile fields
      const res = await authService.updateProfile({
        skills: selected, bio, jobTitle,
        linkedinUrl: linkedin, githubUrl: github,
        yearsExperience: years ? Number(years) : null,
      })
      updateUser(res.data.user)
      setMsg({ text: isRTL ? '✅ تم الحفظ بنجاح' : '✅ Profile saved successfully', type: 'ok' })
    } catch (e) {
      setMsg({ text: e.response?.data?.message || (isRTL ? 'حدث خطأ' : 'Save failed'), type: 'err' })
    } finally {
      setSaving(false)
    }
  }

  const total = SKILL_GROUPS.reduce((s, g) => s + g.skills.length, 0)
  const pct   = Math.round((selected.length / total) * 100)

  const TAB_STYLE = (active) => ({
    padding: '.55rem 1.25rem', borderRadius: 8, fontWeight: active ? 700 : 500,
    fontSize: '.875rem', border: 'none', cursor: 'pointer', transition: 'all .15s',
    background: active ? '#002D62' : 'transparent',
    color:      active ? '#fff'    : '#5A6478',
  })

  const INP_STYLE = {
    width: '100%', padding: '.65rem .9rem', borderRadius: 8,
    border: '1.5px solid #D8DEE9', background: '#F8FAFC',
    fontSize: '.9rem', color: '#1E293B', outline: 'none',
    fontFamily: 'Plus Jakarta Sans, Cairo, sans-serif',
    boxSizing: 'border-box',
  }

  const S = {
    root:   { minHeight: '100vh', background: '#F4F6F9', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem', fontFamily: 'Plus Jakarta Sans, Cairo, sans-serif' },
    card:   { background: '#fff', borderRadius: 16, padding: '2rem', maxWidth: 700, width: '100%', boxShadow: '0 4px 24px rgba(0,45,98,.07)', border: '1px solid #D8DEE9' },
    h1:     { fontSize: '1.4rem', fontWeight: 800, color: '#002D62', margin: '0 0 .25rem' },
    sub:    { fontSize: '.875rem', color: '#5A6478', margin: '0 0 1.5rem' },
    tabs:   { display: 'flex', gap: '.25rem', marginBottom: '1.5rem', background: '#F4F6F9', borderRadius: 10, padding: '.3rem' },
    label:  { display: 'block', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '.4rem' },
    pills:  { display: 'flex', flexWrap: 'wrap', gap: '.35rem', marginBottom: '1rem' },
    pill:   (a) => ({ fontSize: '.8rem', fontWeight: a ? 700 : 400, padding: '.3rem .75rem', borderRadius: 99, cursor: 'pointer', border: `1.5px solid ${a ? '#002D62' : '#D8DEE9'}`, background: a ? '#002D62' : '#F8FAFC', color: a ? '#fff' : '#5A6478', transition: 'all .15s' }),
    avatarWrap: { display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' },
    avatar: { width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #D8DEE9' },
    avatarPlaceholder: { width: 72, height: 72, borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', color: '#94A3B8' },
    progressBar: { background: '#E2E8F0', borderRadius: 99, height: 6, marginBottom: '1.25rem', overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#002D62,#3B82F6)', transition: 'width .4s', width: `${pct}%` },
    row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
    fieldGroup: { marginBottom: '1rem' },
    btnRow: { display: 'flex', gap: '.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' },
    btnSave: { padding: '.7rem 1.75rem', borderRadius: 9, border: 'none', background: '#002D62', color: '#fff', fontWeight: 700, fontSize: '.9rem', cursor: 'pointer', opacity: saving ? .6 : 1 },
    btnBack: { padding: '.7rem 1.25rem', borderRadius: 9, border: '1.5px solid #D8DEE9', background: 'transparent', color: '#5A6478', fontWeight: 600, fontSize: '.9rem', cursor: 'pointer' },
    msg:    (t) => ({ fontSize: '.85rem', padding: '.55rem .9rem', borderRadius: 7, marginTop: '1rem', background: t === 'ok' ? '#DCFCE7' : '#FEE2E2', color: t === 'ok' ? '#15803D' : '#DC2626', textAlign: 'center' }),
  }

  return (
    <div style={S.root} dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={S.card}>
        <h1 style={S.h1}>{isRTL ? 'إعداد الملف الشخصي' : 'Profile Setup'}</h1>
        <p style={S.sub}>{isRTL ? 'أكمل ملفك لتحسين مطابقة المهام واقتراحات الـ AI' : 'Complete your profile to improve task matching and AI proposals'}</p>

        {/* Tabs */}
        <div style={S.tabs}>
          {[
            { id: 'skills',  ar: '🎯 المهارات',     en: '🎯 Skills' },
            { id: 'profile', ar: '👤 المعلومات',    en: '👤 Info' },
            { id: 'avatar',  ar: '🖼 الصورة',       en: '🖼 Avatar' },
          ].map(t => (
            <button key={t.id} style={TAB_STYLE(tab === t.id)} onClick={() => setTab(t.id)}>
              {isRTL ? t.ar : t.en}
            </button>
          ))}
        </div>

        {/* Skills tab */}
        {tab === 'skills' && (
          <div>
            <div style={S.progressBar}><div style={S.progressFill}/></div>
            <p style={{ fontSize: '.8rem', color: '#002D62', fontWeight: 600, marginBottom: '1rem' }}>
              ✓ {selected.length} {isRTL ? 'مهارة مختارة' : 'skills selected'} ({pct}%)
            </p>
            {SKILL_GROUPS.map((g, gi) => (
              <div key={gi}>
                <span style={S.label}>{isRTL ? g.ar : g.en}</span>
                <div style={S.pills}>
                  {g.skills.map(s => (
                    <button key={s} style={S.pill(selected.includes(s))} onClick={() => toggle(s)}>{s}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile info tab */}
        {tab === 'profile' && (
          <div>
            <div style={{ ...S.fieldGroup }}>
              <label style={S.label}>{isRTL ? 'المسمى الوظيفي' : 'Job Title'}</label>
              <input style={INP_STYLE} value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder={isRTL ? 'مثال: Full Stack Developer' : 'e.g. Full Stack Developer'} />
            </div>
            <div style={S.fieldGroup}>
              <label style={S.label}>{isRTL ? 'سنوات الخبرة' : 'Years of Experience'}</label>
              <input style={INP_STYLE} type="number" min="0" max="30" value={years} onChange={e => setYears(e.target.value)} placeholder="0" />
            </div>
            <div style={S.fieldGroup}>
              <label style={S.label}>{isRTL ? 'نبذة شخصية' : 'Bio'}</label>
              <textarea style={{ ...INP_STYLE, minHeight: 90, resize: 'vertical' }} value={bio} onChange={e => setBio(e.target.value)} placeholder={isRTL ? 'اكتب نبذة مختصرة عن نفسك...' : 'Write a short bio...'} maxLength={600} />
              <span style={{ fontSize: '.75rem', color: '#94A3B8' }}>{bio.length}/600</span>
            </div>
            <div style={S.row2}>
              <div>
                <label style={S.label}>LinkedIn URL</label>
                <input style={INP_STYLE} value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label style={S.label}>GitHub URL</label>
                <input style={INP_STYLE} value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/..." />
              </div>
            </div>
          </div>
        )}

        {/* Avatar tab */}
        {tab === 'avatar' && (
          <div>
            <div style={S.avatarWrap}>
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={S.avatar} />
                : <div style={S.avatarPlaceholder}>👤</div>
              }
              <div>
                <label style={{ ...S.btnSave, padding: '.6rem 1.25rem', cursor: 'pointer', display: 'inline-block', opacity: 1 }}>
                  {isRTL ? 'اختر صورة' : 'Choose Image'}
                  <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                </label>
                <p style={{ fontSize: '.8rem', color: '#94A3B8', marginTop: '.5rem' }}>{isRTL ? 'JPG, PNG, WebP — حتى 5 MB' : 'JPG, PNG, WebP — up to 5 MB'}</p>
              </div>
            </div>
          </div>
        )}

        {msg.text && <div style={S.msg(msg.type)}>{msg.text}</div>}

        <div style={S.btnRow}>
          <button style={S.btnBack} onClick={() => navigate('/dashboard')}>{isRTL ? '← الرادار' : '← Radar'}</button>
          <button style={S.btnSave} onClick={handleSave} disabled={saving}>
            {saving ? (isRTL ? 'جاري الحفظ...' : 'Saving...')
              : tab === 'avatar' ? (isRTL ? 'الصورة تُحفظ تلقائياً' : 'Avatar saves automatically')
              : (isRTL ? `💾 حفظ (${selected.length}) مهارة` : `💾 Save (${selected.length}) Skills`)}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
