// ===================================================
<<<<<<< HEAD
// ProfileSetup.jsx — Pillar 6: Premium SaaS Profile
// حقول احترافية + رفع Avatar عبر Backend API
// المسار: frontend/src/pages/ProfileSetup.jsx
// ===================================================

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import api from '../services/api.js'

const SKILL_GROUPS = [
  { ar:'🎨 الواجهة الأمامية', en:'🎨 Frontend',   skills:['HTML','CSS','JavaScript','TypeScript','React','Vue.js','Next.js','Tailwind CSS','Bootstrap','Responsive Design'] },
  { ar:'⚙️ الخلفية',          en:'⚙️ Backend',    skills:['Node.js','Python','PHP','Laravel','Express.js','Django'] },
  { ar:'📱 الموبايل',         en:'📱 Mobile',     skills:['Flutter','React Native','Dart','Swift','Kotlin'] },
  { ar:'🤖 AI & Data',        en:'🤖 AI & Data',  skills:['Machine Learning','Data Science','TensorFlow','PyTorch','SQL'] },
  { ar:'🔐 الأمن',            en:'🔐 Security',   skills:['Cybersecurity','Pentesting','Linux','Networking'] },
  { ar:'🎮 الألعاب',          en:'🎮 Games',      skills:['Unity','Unreal Engine','C#','C++'] },
  { ar:'🛠 أدوات',            en:'🛠 Tools',      skills:['WordPress','Shopify','Figma','Git','Firebase','MongoDB','MySQL','Docker'] },
]

const EXPERIENCE_OPTIONS = [
  { value: 0, ar: 'أقل من سنة', en: 'Less than 1 year' },
  { value: 1, ar: '١ - ٢ سنة',  en: '1 - 2 years' },
  { value: 3, ar: '٣ - ٥ سنوات', en: '3 - 5 years' },
  { value: 6, ar: '٦ - ١٠ سنوات', en: '6 - 10 years' },
  { value: 11, ar: 'أكثر من ١٠ سنوات', en: '10+ years' },
]

export default function ProfileSetup() {
  const { user, updateUser } = useAuth()
  const { isRTL }            = useLanguage()
  const navigate             = useNavigate()
  const fileRef              = useRef(null)

  // Skills
  const [selected, setSelected] = useState([])

  // Profile fields
  const [bio,             setBio]             = useState('')
  const [jobTitle,        setJobTitle]        = useState('')
  const [linkedinUrl,     setLinkedinUrl]     = useState('')
  const [githubUrl,       setGithubUrl]       = useState('')
  const [yearsExperience, setYearsExperience] = useState(null)

  // Avatar
  const [avatarUrl,  setAvatarUrl]  = useState('')
  const [uploading,  setUploading]  = useState(false)
  const [uploadErr,  setUploadErr]  = useState('')

  // Save
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [saveErr, setSaveErr] = useState('')

  const [tab, setTab] = useState('skills')

  // ── تحميل البيانات الحالية ──
  useEffect(() => {
    if (!user?.id) return
    api.get('/auth/profile').then(({ data }) => {
      if (data.skills?.length)     setSelected(data.skills)
      if (data.bio)                setBio(data.bio)
      if (data.jobTitle)           setJobTitle(data.jobTitle)
      if (data.linkedinUrl)        setLinkedinUrl(data.linkedinUrl)
      if (data.githubUrl)          setGithubUrl(data.githubUrl)
      if (data.yearsExperience != null) setYearsExperience(data.yearsExperience)
      if (data.avatar)             setAvatarUrl(data.avatar)
    }).catch(() => {})
  }, [user?.id])

  const toggle = useCallback(s =>
    setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  , [])

  // ── Pillar 6: رفع Avatar عبر Backend API ──
  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadErr('')

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const { data } = await api.post('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      })

      setAvatarUrl(data.avatarUrl)
      updateUser({ avatar: data.avatarUrl })
    } catch (err) {
      const msg = err.response?.data?.message || 'فشل رفع الصورة، حاول مرة أخرى'
      setUploadErr(msg)
      console.error('Avatar upload failed:', err.message)
    } finally {
      setUploading(false)
      e.target.value = '' // reset input
    }
  }

  // ── Pillar 6: حفظ الملف الشخصي عبر Backend API ──
  const save = async () => {
    setSaving(true)
    setSaveErr('')
    try {
      const { data } = await api.put('/auth/profile', {
        skills:          selected,
        bio,
        jobTitle,
        linkedinUrl,
        githubUrl,
        yearsExperience,
      })

      updateUser({
        skills:          data.user.skills,
        bio:             data.user.bio,
        jobTitle:        data.user.jobTitle,
        linkedinUrl:     data.user.linkedinUrl,
        githubUrl:       data.user.githubUrl,
        yearsExperience: data.user.yearsExperience,
        avatar:          avatarUrl,
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setSaveErr(err.response?.data?.message || 'فشل الحفظ، حاول مرة أخرى')
=======
// ProfileSetup.jsx - صفحة إعداد ملف المستخدم ومهاراته
// ===================================================
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import { authService } from '../services/authService.js'

const ALL_SKILLS = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'TypeScript',
  'Node.js', 'Python', 'PHP', 'WordPress', 'Figma', 'Responsive Design',
  'Bootstrap', 'Tailwind CSS', 'MongoDB', 'MySQL', 'Git'
]

function ProfileSetup() {
  const { t } = useTranslation()
  const [selectedSkills, setSelectedSkills] = useState([])
  const [saving, setSaving] = useState(false)

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await authService.updateSkills(selectedSkills)
    } catch (error) {
      console.error('خطأ في الحفظ:', error)
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
    } finally {
      setSaving(false)
    }
  }

<<<<<<< HEAD
  const total = SKILL_GROUPS.reduce((s, g) => s + g.skills.length, 0)
  const pct   = Math.round((selected.length / total) * 100)

  const TAB_STYLE = (active) => ({
    padding: '.55rem 1.25rem', borderRadius: 8, fontWeight: active ? 700 : 500,
    fontSize: '.875rem', border: 'none', cursor: 'pointer', transition: 'all .15s',
    background: active ? '#002D62' : 'transparent',
    color:      active ? '#fff'    : '#5A6478',
  })

  const INP_STYLE = {
    width:'100%', padding:'.7rem .9rem', border:'1.5px solid #D8DEE9',
    borderRadius:10, fontSize:'.875rem', color:'#1A1A2E', background:'#FAFBFC',
    outline:'none', fontFamily:'inherit', transition:'border-color .15s',
    boxSizing:'border-box',
  }

  return (
    <div style={{ background:'#F4F6F9', minHeight:'100vh', overflowX:'hidden' }} dir={isRTL?'rtl':'ltr'}>
      <Navbar />
      <div style={{ maxWidth:860, margin:'0 auto', padding:'2rem 1.5rem 6rem' }}>

        {/* Header */}
        <div style={{ marginBottom:'1.75rem' }}>
          <h1 style={{ fontFamily:'Plus Jakarta Sans,Cairo,sans-serif', fontSize:'clamp(1.35rem,2.5vw,1.75rem)', fontWeight:800, color:'#002D62', marginBottom:'.35rem' }}>
            {isRTL ? '⚙️ ملفي الشخصي' : '⚙️ My Profile'}
          </h1>
          <p style={{ color:'#5A6478', fontSize:'.9rem', margin:0 }}>
            {isRTL ? 'أدر مهاراتك وبياناتك المهنية وصورتك الشخصية' : 'Manage your skills, professional info, and avatar'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'.35rem', background:'#fff', border:'1px solid #D8DEE9', borderRadius:10, padding:'.35rem', width:'fit-content', marginBottom:'1.5rem' }}>
          <button style={TAB_STYLE(tab==='skills')}  onClick={()=>setTab('skills')}>{isRTL?'🛠 المهارات':'🛠 Skills'}</button>
          <button style={TAB_STYLE(tab==='profile')} onClick={()=>setTab('profile')}>{isRTL?'👤 البيانات المهنية':'👤 Professional Info'}</button>
          <button style={TAB_STYLE(tab==='avatar')}  onClick={()=>setTab('avatar')}>{isRTL?'📷 الصورة':'📷 Avatar'}</button>
        </div>

        {/* ── TAB: SKILLS ── */}
        {tab === 'skills' && (
          <>
            <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:12, padding:'1.25rem 1.5rem', marginBottom:'1.25rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.5rem' }}>
                <span style={{ fontSize:'.82rem', fontWeight:600, color:'#5A6478' }}>{selected.length} {isRTL?'مهارة مختارة':'skills selected'}</span>
                <span style={{ fontSize:'.82rem', fontWeight:700, color:'#002D62' }}>{pct}%</span>
              </div>
              <div style={{ height:5, background:'#E2E8F0', borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,#002D62,#0EA5E9)', borderRadius:99, transition:'width .4s ease' }} />
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {SKILL_GROUPS.map((g,gi) => (
                <div key={gi} style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:12, padding:'1.25rem 1.5rem' }}>
                  <h3 style={{ fontSize:'.92rem', fontWeight:700, color:'#002D62', marginBottom:'.85rem', paddingBottom:'.6rem', borderBottom:'1px solid #F1F5F9' }}>
                    {isRTL?g.ar:g.en}
                  </h3>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem' }}>
                    {g.skills.map(s => {
                      const active = selected.includes(s)
                      return (
                        <button key={s} onClick={()=>toggle(s)} style={{
                          fontSize:'.8rem', fontWeight:active?700:500, padding:'.38rem .85rem',
                          borderRadius:99, cursor:'pointer', transition:'all .15s',
                          background:active?'#002D62':'#F4F6F9', color:active?'#fff':'#5A6478',
                          border:`1.5px solid ${active?'#002D62':'#D8DEE9'}`,
                        }}>{active?'✓ ':''}{s}</button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── TAB: PROFILE INFO ── Pillar 6 ── */}
        {tab === 'profile' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

            {/* Job Title */}
            <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:12, padding:'1.5rem' }}>
              <h3 style={{ fontSize:'.92rem', fontWeight:700, color:'#002D62', marginBottom:'1rem' }}>
                💼 {isRTL?'المسمى الوظيفي':'Job Title'}
              </h3>
              <input
                value={jobTitle} onChange={e=>setJobTitle(e.target.value)}
                placeholder={isRTL?'مثال: مطور ويب فول ستاك | Senior Frontend Developer':'e.g. Full Stack Web Developer | Senior Frontend Engineer'}
                style={INP_STYLE}
                onFocus={e=>e.target.style.borderColor='#002D62'}
                onBlur={e=>e.target.style.borderColor='#D8DEE9'}
              />
            </div>

            {/* Years of Experience */}
            <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:12, padding:'1.5rem' }}>
              <h3 style={{ fontSize:'.92rem', fontWeight:700, color:'#002D62', marginBottom:'1rem' }}>
                📊 {isRTL?'سنوات الخبرة':'Years of Experience'}
              </h3>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem' }}>
                {EXPERIENCE_OPTIONS.map(opt => {
                  const active = yearsExperience === opt.value
                  return (
                    <button key={opt.value} onClick={()=>setYearsExperience(opt.value)} style={{
                      padding:'.5rem 1.1rem', borderRadius:99, fontSize:'.82rem', fontWeight:active?700:500, cursor:'pointer', transition:'all .15s',
                      background:active?'#002D62':'#F4F6F9', color:active?'#fff':'#5A6478',
                      border:`1.5px solid ${active?'#002D62':'#D8DEE9'}`,
                    }}>
                      {isRTL?opt.ar:opt.en}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* LinkedIn */}
            <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:12, padding:'1.5rem' }}>
              <h3 style={{ fontSize:'.92rem', fontWeight:700, color:'#002D62', marginBottom:'1rem' }}>
                🔗 LinkedIn
              </h3>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', [isRTL?'right':'left']:'.9rem', top:'50%', transform:'translateY(-50%)', fontSize:'.82rem', color:'#94A3B8', pointerEvents:'none' }}>
                  linkedin.com/in/
                </span>
                <input
                  value={linkedinUrl} onChange={e=>setLinkedinUrl(e.target.value)}
                  placeholder={isRTL?'اسم المستخدم':'your-username'}
                  style={{ ...INP_STYLE, paddingInlineStart:'9.5rem' }}
                  onFocus={e=>e.target.style.borderColor='#0A66C2'}
                  onBlur={e=>e.target.style.borderColor='#D8DEE9'}
                />
              </div>
            </div>

            {/* GitHub */}
            <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:12, padding:'1.5rem' }}>
              <h3 style={{ fontSize:'.92rem', fontWeight:700, color:'#002D62', marginBottom:'1rem' }}>
                🐙 GitHub
              </h3>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', [isRTL?'right':'left']:'.9rem', top:'50%', transform:'translateY(-50%)', fontSize:'.82rem', color:'#94A3B8', pointerEvents:'none' }}>
                  github.com/
                </span>
                <input
                  value={githubUrl} onChange={e=>setGithubUrl(e.target.value)}
                  placeholder={isRTL?'اسم المستخدم':'your-username'}
                  style={{ ...INP_STYLE, paddingInlineStart:'7rem' }}
                  onFocus={e=>e.target.style.borderColor='#1a1a1a'}
                  onBlur={e=>e.target.style.borderColor='#D8DEE9'}
                />
              </div>
            </div>

            {/* Bio */}
            <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:12, padding:'1.5rem' }}>
              <h3 style={{ fontSize:'.92rem', fontWeight:700, color:'#002D62', marginBottom:'.6rem' }}>
                📝 {isRTL?'نبذة مهنية':'Professional Bio'}
              </h3>
              <p style={{ fontSize:'.8rem', color:'#5A6478', marginBottom:'.85rem' }}>
                {isRTL?'تظهر في ملتقى المطورين ومع بروبوزالاتك':'Shown in Dev Hub and next to your proposals'}
              </p>
              <textarea
                value={bio} onChange={e=>setBio(e.target.value)}
                placeholder={isRTL
                  ?'مثال: مطور ويب فرونتيند بخبرة 3 سنوات، متخصص في React وTailwind. أساعد العملاء في بناء واجهات سريعة وجميلة...'
                  :'e.g. Frontend developer with 3+ years specializing in React & Tailwind. I help clients build fast, beautiful interfaces...'}
                rows={5} maxLength={400}
                style={{ ...INP_STYLE, resize:'vertical' }}
                onFocus={e=>e.target.style.borderColor='#002D62'}
                onBlur={e=>e.target.style.borderColor='#D8DEE9'}
              />
              <p style={{ fontSize:'.72rem', color:'#94A3B8', marginTop:'.35rem', textAlign:'end' }}>{bio.length}/400</p>
            </div>
          </div>
        )}

        {/* ── TAB: AVATAR ── */}
        {tab === 'avatar' && (
          <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:12, padding:'2rem' }}>
            <h3 style={{ fontSize:'.92rem', fontWeight:700, color:'#002D62', marginBottom:'1.5rem' }}>
              📷 {isRTL?'الصورة الشخصية':'Profile Picture'}
            </h3>

            {/* Preview */}
            <div style={{ display:'flex', alignItems:'center', gap:'2rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
              <div style={{ position:'relative' }}>
                <div style={{ width:100, height:100, borderRadius:'50%', background:'#E8EEF7', border:'3px solid #D8DEE9', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {avatarUrl
                    ? <img src={avatarUrl} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <span style={{ fontSize:'2.5rem' }}>👤</span>}
                </div>
                {uploading && (
                  <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(0,45,98,.6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ width:22, height:22, border:'2.5px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} />
                  </div>
                )}
              </div>
              <div>
                <p style={{ fontSize:'.85rem', fontWeight:600, color:'#1A1A2E', margin:'0 0 .3rem' }}>
                  {user?.name || '—'}
                </p>
                <p style={{ fontSize:'.78rem', color:'#5A6478', margin:'0 0 .85rem' }}>
                  {jobTitle || (isRTL?'مطور برمجيات':'Software Developer')}
                </p>
                <div style={{ display:'flex', gap:'.6rem', flexWrap:'wrap' }}>
                  <button
                    onClick={()=>fileRef.current?.click()}
                    disabled={uploading}
                    style={{ padding:'.55rem 1.1rem', borderRadius:9, background:'#002D62', color:'#fff', fontWeight:600, fontSize:'.85rem', border:'none', cursor:uploading?'not-allowed':'pointer', opacity:uploading?.5:1 }}
                  >
                    {uploading ? (isRTL?'⏳ جاري الرفع...':'⏳ Uploading...') : (isRTL?'📷 رفع صورة':'📷 Upload Photo')}
                  </button>
                  {avatarUrl && (
                    <button onClick={()=>setAvatarUrl('')} style={{ padding:'.5rem .9rem', borderRadius:8, background:'transparent', border:'1px solid #FECACA', color:'#DC3545', fontSize:'.82rem', cursor:'pointer' }}>
                      {isRTL?'حذف':'Remove'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadAvatar} style={{ display:'none' }} />

            {uploadErr && (
              <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'.65rem .9rem', fontSize:'.83rem', color:'#DC3545', marginBottom:'.75rem' }}>
                ⚠️ {uploadErr}
              </div>
            )}

            <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:9, padding:'1rem', fontSize:'.8rem', color:'#5A6478', lineHeight:1.7 }}>
              <p style={{ margin:0, fontWeight:600, color:'#1A1A2E', marginBottom:'.3rem' }}>
                {isRTL?'ملاحظات:':'Notes:'}
              </p>
              {isRTL
                ? <ul style={{ margin:0, paddingInlineStart:'1.2rem' }}>
                    <li>الحجم الأقصى: 5 ميغابايت</li>
                    <li>الصيغ المدعومة: JPG، PNG، WebP، GIF</li>
                    <li>الأبعاد الموصى بها: 400×400 بكسل أو أكبر</li>
                  </ul>
                : <ul style={{ margin:0, paddingInlineStart:'1.2rem' }}>
                    <li>Max size: 5 MB</li>
                    <li>Supported: JPG, PNG, WebP, GIF</li>
                    <li>Recommended: 400×400px or larger</li>
                  </ul>}
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div style={{ position:'sticky', bottom:0, background:'linear-gradient(to top, #F4F6F9 80%, transparent)', padding:'1.25rem 0 .5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginTop:'1.5rem' }}>
          <button onClick={()=>navigate('/dashboard')} style={{ fontSize:'.83rem', fontWeight:500, color:'#5A6478', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>
            {isRTL?'رجوع للرادار':'Back to Radar'}
          </button>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'.35rem' }}>
            {saveErr && <p style={{ fontSize:'.75rem', color:'#DC3545', margin:0 }}>⚠️ {saveErr}</p>}
            <button onClick={save} disabled={saving || tab==='avatar'} style={{ padding:'.75rem 1.75rem', borderRadius:10, background:saved?'#28A745':'#002D62', color:'#fff', fontWeight:700, fontSize:'.95rem', border:'none', cursor:(saving||tab==='avatar')?'not-allowed':'pointer', opacity:(saving||tab==='avatar')?.6:1, display:'flex', alignItems:'center', gap:'.5rem', transition:'all .3s' }}>
              {saving
                ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} />{isRTL?'جاري الحفظ...':'Saving...'}</>
                : saved ? (isRTL?'✅ تم الحفظ!':'✅ Saved!')
                  : tab==='avatar' ? (isRTL?'الصورة تُحفظ تلقائياً':'Avatar saves automatically')
                  : (isRTL?`💾 حفظ (${selected.length}) مهارة`:`💾 Save (${selected.length}) Skills`)}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
=======
  return (
    <div className="page-container">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <h1 className="text-xl font-black text-brand-cyan mb-2">⚙️ ملفي الشخصي</h1>
          <p className="text-gray-400 text-sm mb-6">
            اختر مهاراتك حتى يرشح الرادار المهام المناسبة لك تحديداً
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {ALL_SKILLS.map(skill => {
              const isSelected = selectedSkills.includes(skill)
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`
                    text-sm px-4 py-2 rounded-full border transition-all
                    ${isSelected
                      ? 'bg-brand-cyan text-brand-dark border-brand-cyan font-bold'
                      : 'border-brand-border text-gray-400 hover:border-brand-cyan hover:text-brand-cyan'
                    }
                  `}
                >
                  {skill}
                </button>
              )
            })}
          </div>

          <Button variant="primary" onClick={handleSave} loading={saving}>
            💾 {t('common.save')} ({selectedSkills.length} مهارة)
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default ProfileSetup
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
