// ===================================================
// Support.jsx — Pillar 5: Functional Ticket System via Backend API
// المسار: frontend/src/pages/Support.jsx
// ===================================================

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import { supabase } from '../services/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import api from '../services/api.js'

const TYPES = [
  { id:'bug',        icon:'🐛', ar:'بلاغ عن خطأ',       en:'Report a Bug' },
  { id:'suggestion', icon:'💡', ar:'اقتراح تحسين',      en:'Feature Suggestion' },
  { id:'report',     icon:'🚩', ar:'الإبلاغ عن مستخدم', en:'Report a User' },
  { id:'other',      icon:'📩', ar:'أخرى',              en:'Other' },
]

export default function Support() {
  const { user }  = useAuth()
  const { isRTL } = useLanguage()
  const navigate  = useNavigate()

  const [form, setForm]           = useState({ type:'', title:'', description:'' })
  const [screenshot, setScreenshot] = useState(null)
  const [uploading, setUploading]   = useState(false)
  const [sending, setSending]       = useState(false)
  const [done, setDone]             = useState(false)
  const [error, setError]           = useState('')

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  // رفع لقطة الشاشة — مباشرةً لـ Supabase Storage (غير حساسة)
  const uploadScreenshot = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const path = `support/${Date.now()}-${file.name}`
      const { error: upErr } = await supabase.storage.from('support-files').upload(path, file)
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('support-files').getPublicUrl(path)
      setScreenshot(publicUrl)
    } catch (err) {
      console.error('Screenshot upload failed:', err.message)
    } finally {
      setUploading(false)
    }
  }

  // Pillar 5: إرسال للـ Backend API
  const submit = async e => {
    e.preventDefault()
    if (!form.type || !form.title || !form.description) {
      setError(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }
    setSending(true); setError('')
    try {
      await api.post('/support', {
        type:        form.type,
        title:       form.title,
        description: form.description,
        screenshot:  screenshot,
      })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSending(false)
    }
  }

  const INP = {
    width:'100%', padding:'.7rem .9rem', border:'1.5px solid #D8DEE9',
    borderRadius:10, fontSize:'.875rem', color:'#1A1A2E', background:'#FAFBFC',
    outline:'none', fontFamily:'inherit', transition:'border-color .15s',
  }

  if (done) return (
    <div style={{ background:'#F4F6F9', minHeight:'100vh' }} dir={isRTL?'rtl':'ltr'}>
      <Navbar />
      <div style={{ maxWidth:520, margin:'4rem auto', padding:'0 1rem', textAlign:'center' }}>
        <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:16, padding:'3rem 2rem', boxShadow:'0 4px 24px rgba(0,45,98,.08)' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>✅</div>
          <h2 style={{ fontFamily:'Plus Jakarta Sans,Cairo,sans-serif', fontSize:'1.4rem', fontWeight:800, color:'#002D62', marginBottom:'.75rem' }}>
            {isRTL ? 'تم استلام تذكرتك!' : 'Ticket Received!'}
          </h2>
          <p style={{ color:'#5A6478', lineHeight:1.7, marginBottom:'1.75rem' }}>
            {isRTL
              ? 'سيتم مراجعة طلبك والرد عليك في أقرب وقت على بريدك الإلكتروني.'
              : 'Your request will be reviewed and we will respond to your email as soon as possible.'}
          </p>
          <button onClick={()=>navigate('/dashboard')} style={{ padding:'.75rem 2rem', borderRadius:10, background:'#002D62', color:'#fff', fontWeight:700, border:'none', cursor:'pointer', fontSize:'.95rem' }}>
            {isRTL ? 'العودة للرادار' : 'Back to Radar'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background:'#F4F6F9', minHeight:'100vh', overflowX:'hidden' }} dir={isRTL?'rtl':'ltr'}>
      <Navbar />
      <div style={{ maxWidth:760, margin:'0 auto', padding:'2rem 1.5rem 4rem' }}>

        <div style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontFamily:'Plus Jakarta Sans,Cairo,sans-serif', fontSize:'clamp(1.35rem,2.5vw,1.75rem)', fontWeight:800, color:'#002D62', marginBottom:'.35rem' }}>
            🎧 {isRTL ? 'مركز الدعم الفني' : 'Support Center'}
          </h1>
          <p style={{ color:'#5A6478', fontSize:'.9rem', margin:0 }}>
            {isRTL ? 'نحن هنا لمساعدتك — أرسل تذكرتك وسنرد عليك في أقرب وقت' : "We're here to help — submit your ticket and we'll respond ASAP"}
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'1.5rem', alignItems:'start' }}>

          <form onSubmit={submit} style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:16, padding:'2rem', boxShadow:'0 1px 4px rgba(0,45,98,.06)' }}>

            {/* نوع التذكرة */}
            <div style={{ marginBottom:'1.5rem' }}>
              <label style={{ fontSize:'.78rem', fontWeight:700, color:'#5A6478', display:'block', marginBottom:'.6rem', letterSpacing:'.04em', textTransform:'uppercase' }}>
                {isRTL ? 'نوع التذكرة *' : 'Ticket Type *'}
              </label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.6rem' }}>
                {TYPES.map(t => (
                  <button type="button" key={t.id} onClick={()=>setForm(p=>({...p,type:t.id}))} style={{
                    display:'flex', alignItems:'center', gap:'.55rem', padding:'.65rem .9rem',
                    borderRadius:10, cursor:'pointer', transition:'all .15s',
                    border:`1.5px solid ${form.type===t.id?'#002D62':'#D8DEE9'}`,
                    background:form.type===t.id?'#E8EEF7':'transparent',
                  }}>
                    <span style={{ fontSize:'1.1rem' }}>{t.icon}</span>
                    <span style={{ fontSize:'.82rem', fontWeight:form.type===t.id?700:500, color:form.type===t.id?'#002D62':'#5A6478' }}>{isRTL?t.ar:t.en}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* العنوان */}
            <div style={{ marginBottom:'1.1rem' }}>
              <label style={{ fontSize:'.78rem', fontWeight:700, color:'#5A6478', display:'block', marginBottom:'.4rem' }}>
                {isRTL ? 'عنوان المشكلة *' : 'Issue Title *'}
              </label>
              <input name="title" value={form.title} onChange={handle}
                placeholder={isRTL?'اكتب عنواناً مختصراً وواضحاً':'Write a short and clear title'}
                style={INP}
                onFocus={e=>e.target.style.borderColor='#002D62'}
                onBlur={e=>e.target.style.borderColor='#D8DEE9'} required />
            </div>

            {/* التفاصيل */}
            <div style={{ marginBottom:'1.1rem' }}>
              <label style={{ fontSize:'.78rem', fontWeight:700, color:'#5A6478', display:'block', marginBottom:'.4rem' }}>
                {isRTL ? 'تفاصيل المشكلة *' : 'Issue Details *'}
              </label>
              <textarea name="description" value={form.description} onChange={handle} rows={6}
                placeholder={isRTL?'اشرح المشكلة بالتفصيل...':'Describe the issue in detail...'}
                style={{ ...INP, resize:'vertical', minHeight:120 }}
                onFocus={e=>e.target.style.borderColor='#002D62'}
                onBlur={e=>e.target.style.borderColor='#D8DEE9'} required />
            </div>

            {/* لقطة شاشة */}
            <div style={{ marginBottom:'1.5rem' }}>
              <label style={{ fontSize:'.78rem', fontWeight:700, color:'#5A6478', display:'block', marginBottom:'.4rem' }}>
                {isRTL ? 'إرفاق لقطة شاشة (اختياري)' : 'Attach Screenshot (Optional)'}
              </label>
              <label style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.65rem .9rem', border:`1.5px dashed ${screenshot?'#28A745':'#D8DEE9'}`, borderRadius:10, cursor:'pointer', background:screenshot?'#F0FDF4':'#FAFBFC', transition:'all .15s' }}>
                <input type="file" accept="image/*" onChange={uploadScreenshot} style={{ display:'none' }} />
                <span style={{ fontSize:'1.1rem' }}>{uploading?'⏳':screenshot?'✅':'📎'}</span>
                <span style={{ fontSize:'.83rem', color:screenshot?'#28A745':'#5A6478', fontWeight:screenshot?600:400 }}>
                  {uploading?(isRTL?'جاري الرفع...':'Uploading...')
                   :screenshot?(isRTL?'تم رفع الصورة':'Screenshot uploaded')
                   :(isRTL?'اضغط لرفع صورة':'Click to upload image')}
                </span>
              </label>
            </div>

            {error && (
              <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'.7rem 1rem', fontSize:'.83rem', color:'#DC3545', marginBottom:'1rem' }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={sending} style={{ width:'100%', padding:'.82rem', borderRadius:11, background:'#002D62', color:'#fff', fontWeight:700, fontSize:'.95rem', border:'none', cursor:sending?'not-allowed':'pointer', opacity:sending?.6:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem' }}>
              {sending
                ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} />{isRTL?'جاري الإرسال...':'Sending...'}</>
                : isRTL ? 'إرسال التذكرة 📩' : '📩 Submit Ticket'}
            </button>
          </form>

          {/* Sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:14, padding:'1.5rem', boxShadow:'0 1px 4px rgba(0,45,98,.06)' }}>
              <h3 style={{ fontSize:'.92rem', fontWeight:700, color:'#002D62', marginBottom:'1rem' }}>📬 {isRTL?'تواصل معنا':'Contact Us'}</h3>
              {[
                { icon:'📧', label:isRTL?'الإيميل الرسمي':'Official Email', value:'support@bountyfetch.com', href:'mailto:support@bountyfetch.com' },
                { icon:'📱', label:isRTL?'تيليجرام':'Telegram', value:'@BountyFetch', href:'https://t.me/BountyFetch' },
                { icon:'🐙', label:'GitHub', value:'github.com/BountyFetch', href:'https://github.com' },
              ].map((c,i) => (
                <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:'.65rem', padding:'.65rem .75rem', borderRadius:9, textDecoration:'none', marginBottom:'.35rem', background:'#F8FAFC', border:'1px solid #E2E8F0', transition:'all .15s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='#002D62'; e.currentTarget.style.background='#E8EEF7' }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.background='#F8FAFC' }}>
                  <span style={{ fontSize:'1rem' }}>{c.icon}</span>
                  <div>
                    <p style={{ fontSize:'.68rem', color:'#94A3B8', margin:0 }}>{c.label}</p>
                    <p style={{ fontSize:'.8rem', fontWeight:600, color:'#002D62', margin:0 }}>{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
            <div style={{ background:'#E8EEF7', border:'1px solid #C5D3E8', borderRadius:12, padding:'1.25rem' }}>
              <p style={{ fontSize:'.82rem', fontWeight:700, color:'#002D62', margin:'0 0 .4rem' }}>⏱ {isRTL?'وقت الاستجابة':'Response Time'}</p>
              <p style={{ fontSize:'.8rem', color:'#5A6478', margin:0, lineHeight:1.6 }}>
                {isRTL ? 'نرد خلال 24-48 ساعة في أيام العمل' : 'We respond within 24-48 hours on business days'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @media(max-width:640px){.sup-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
