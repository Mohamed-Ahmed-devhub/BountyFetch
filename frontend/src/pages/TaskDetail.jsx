// ===================================================
// TaskDetail.jsx — Pillar 3+4: Gemini JSON Proposal + Source URL
// المسار: frontend/src/pages/TaskDetail.jsx
// ===================================================

import React, { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { MOCK_TASKS, SOURCE_CONFIG } from '../data/mockTasks.js'
import api from '../services/api.js'

export default function TaskDetail() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const { isRTL } = useLanguage()

  const task = MOCK_TASKS.find(t => t.id === id) || MOCK_TASKS[0]
  const src  = SOURCE_CONFIG[task?.source] || SOURCE_CONFIG.rss

  // Pillar 3: proposal هو الآن { ar, en, highlights }
  const [proposal,    setProposal]    = useState(null)
  const [propLang,    setPropLang]    = useState('ar')
  const [generating,  setGenerating]  = useState(false)
  const [copied,      setCopied]      = useState(false)
  const [activeView,  setActiveView]  = useState('ar') // ar | en

  const generate = useCallback(async (lang) => {
    setPropLang(lang); setGenerating(true); setProposal(null); setActiveView(lang)
    try {
      const { data } = await api.post('/ai/proposal', { taskId: task?.id, language: lang })
      if (data?.proposal) setProposal(data.proposal)
      else throw new Error('no proposal')
    } catch {
      // fallback
      setProposal({
        ar: `لقد اطلعت على طلبك بخصوص "${task?.title}" ولدي خبرة قوية في ${task?.skills?.slice(0,2).join(' و')}. سأبدأ العمل فور الاتفاق وأسلّم بجودة عالية في الوقت المحدد.`,
        en: `I reviewed your request for "${task?.title}" and I have strong experience in ${task?.skills?.slice(0,2).join(' & ')}. I'll start immediately upon agreement and deliver high-quality work on time.`,
        highlights: [isRTL?'تسليم سريع':'Fast Delivery', isRTL?'جودة عالية':'High Quality', isRTL?'تواصل مستمر':'Constant Communication'],
      })
    } finally { setGenerating(false) }
  }, [task, isRTL])

  const copy = () => {
    const txt = proposal ? (activeView === 'ar' ? proposal.ar : proposal.en) : ''
    navigator.clipboard.writeText(txt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // Pillar 4: الرابط من قاعدة البيانات
  const srcUrl = task?.url || task?.sourceUrl

  return (
    <div style={{ background:'#F4F6F9', minHeight:'100vh', overflowX:'hidden' }} dir={isRTL?'rtl':'ltr'}>
      <Navbar />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2rem 1.5rem 4rem' }}>

        <button onClick={()=>navigate('/dashboard')} style={{ background:'none', border:'1px solid #D8DEE9', borderRadius:8, padding:'.38rem .85rem', fontSize:'.82rem', color:'#5A6478', cursor:'pointer', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'.35rem', transition:'all .15s' }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor='#002D62'; e.currentTarget.style.color='#002D62' }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor='#D8DEE9'; e.currentTarget.style.color='#5A6478' }}>
          {isRTL?'→ الرادار':'← Radar'}
        </button>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', alignItems:'start' }}>

          {/* تفاصيل المهمة */}
          <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:16, padding:'1.75rem', boxShadow:'0 1px 4px rgba(0,45,98,.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
              <span style={{ fontSize:'.72rem', fontWeight:700, padding:'.22rem .65rem', borderRadius:99, color:src.color, background:`${src.color}15`, border:`1px solid ${src.color}30` }}>{src.emoji} {src.label}</span>
              <span style={{ fontSize:'.72rem', color:'#94A3B8', marginInlineStart:'auto' }}>{task?.postedAt}</span>
            </div>

            <h1 style={{ fontSize:'1.15rem', fontWeight:800, color:'#002D62', marginBottom:'1rem', lineHeight:1.4 }}>{task?.title}</h1>

            <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:10, padding:'1rem 1.1rem', marginBottom:'1.25rem' }}>
              <p style={{ fontSize:'.875rem', color:'#5A6478', lineHeight:1.8, margin:0, whiteSpace:'pre-line' }}>{task?.description}</p>
            </div>

            <div style={{ marginBottom:'1.25rem' }}>
              <p style={{ fontSize:'.7rem', fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'#94A3B8', marginBottom:'.5rem' }}>{isRTL?'المهارات المطلوبة':'Required Skills'}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'.35rem' }}>
                {task?.skills?.map(s => <span key={s} style={{ fontSize:'.75rem', fontWeight:600, padding:'.25rem .65rem', borderRadius:99, background:'#E8EEF7', border:'1px solid #C5D3E8', color:'#002D62' }}>{s}</span>)}
              </div>
            </div>

            <div style={{ paddingTop:'1rem', borderTop:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'.75rem' }}>
              <div>
                <p style={{ fontSize:'.7rem', fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'#94A3B8', margin:'0 0 .25rem' }}>{isRTL?'الميزانية':'Budget'}</p>
                <p style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'1.1rem', fontWeight:800, color:'#28A745', margin:0 }}>{task?.budget||(isRTL?'مفتوح':'Open')}</p>
              </div>
              {/* Pillar 4: رابط المصدر الحقيقي */}
              {srcUrl && srcUrl !== '#' && (
                <a href={srcUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', fontSize:'.82rem', fontWeight:700, padding:'.42rem .95rem', borderRadius:8, background:'#E8EEF7', border:'1px solid #C5D3E8', color:'#002D62', textDecoration:'none', transition:'all .15s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='#002D62'; e.currentTarget.style.color='#fff' }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='#E8EEF7'; e.currentTarget.style.color='#002D62' }}>
                  🔗 {isRTL?'المصدر الأصلي':'Original Source'} ↗
                </a>
              )}
            </div>
          </div>

          {/* مولّد البروبوزال */}
          <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:16, padding:'1.75rem', boxShadow:'0 1px 4px rgba(0,45,98,.06)' }}>
            <h2 style={{ fontSize:'1rem', fontWeight:800, color:'#002D62', marginBottom:'.35rem' }}>🤖 {isRTL?'مولّد العروض بالذكاء الاصطناعي':'AI Proposal Engine'}</h2>
            <p style={{ fontSize:'.82rem', color:'#5A6478', marginBottom:'1.25rem', lineHeight:1.6 }}>
              {isRTL?'يولّد عرضاً احترافياً بالعربية والإنجليزية معاً في ثوانٍ':'Generates a professional proposal in both Arabic & English in seconds'}
            </p>

            <div style={{ display:'flex', gap:'.65rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
              <button onClick={()=>generate('ar')} disabled={generating}
                style={{ flex:1, minWidth:130, padding:'.65rem 1rem', borderRadius:9, background:'#002D62', color:'#fff', fontWeight:700, fontSize:'.85rem', border:'none', cursor:generating?'not-allowed':'pointer', opacity:generating&&propLang==='ar'?.6:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'.4rem' }}>
                {generating&&propLang==='ar'?<><Spinner/>جاري...</>:'✍️ عرض بالعربية'}
              </button>
              <button onClick={()=>generate('en')} disabled={generating}
                style={{ flex:1, minWidth:130, padding:'.65rem 1rem', borderRadius:9, background:'transparent', color:'#002D62', fontWeight:700, fontSize:'.85rem', border:'1.5px solid #002D62', cursor:generating?'not-allowed':'pointer', opacity:generating&&propLang==='en'?.6:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'.4rem' }}>
                {generating&&propLang==='en'?<><Spinner color="#002D62"/>Generating...</>:'✍️ English Proposal'}
              </button>
            </div>

            {generating && (
              <div style={{ textAlign:'center', padding:'2.5rem 1rem', color:'#002D62' }}>
                <div style={{ display:'flex', gap:'.3rem', justifyContent:'center', marginBottom:'.75rem' }}>
                  {[0,1,2].map(i=><span key={i} style={{ width:8, height:8, borderRadius:'50%', background:'#002D62', display:'inline-block', animation:`dot 1.2s ease-in-out ${i*.2}s infinite` }} />)}
                </div>
                <p style={{ fontSize:'.85rem', margin:0 }}>{isRTL?'Gemini يصيغ عرضك المخصص...':'Gemini is crafting your custom proposal...'}</p>
              </div>
            )}

            {proposal && !generating && (
              <div>
                {/* Highlights */}
                {proposal.highlights?.length > 0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1rem' }}>
                    {proposal.highlights.map((h,i) => (
                      <span key={i} style={{ fontSize:'.72rem', fontWeight:700, padding:'.22rem .65rem', borderRadius:99, background:'#E8EEF7', border:'1px solid #C5D3E8', color:'#002D62' }}>✦ {h}</span>
                    ))}
                  </div>
                )}

                {/* Language tabs */}
                <div style={{ display:'flex', gap:'.35rem', marginBottom:'.75rem' }}>
                  {['ar','en'].map(l => (
                    <button key={l} onClick={()=>setActiveView(l)} style={{ padding:'.35rem .9rem', borderRadius:7, fontSize:'.78rem', fontWeight:activeView===l?700:500, border:'none', cursor:'pointer', background:activeView===l?'#002D62':'#F4F6F9', color:activeView===l?'#fff':'#5A6478', transition:'all .15s' }}>
                      {l==='ar'?'🇸🇦 عربي':'🇺🇸 English'}
                    </button>
                  ))}
                  <button onClick={copy} style={{ marginInlineStart:'auto', fontSize:'.75rem', fontWeight:700, padding:'.3rem .75rem', border:'1px solid #D8DEE9', borderRadius:7, background:copied?'#F0FDF4':'transparent', color:copied?'#28A745':'#5A6478', cursor:'pointer', transition:'all .2s' }}>
                    {copied?(isRTL?'✅ تم النسخ':'✅ Copied'):(isRTL?'📋 نسخ':'📋 Copy')}
                  </button>
                </div>

                <textarea readOnly value={activeView==='ar'?proposal.ar:proposal.en} rows={10}
                  dir={activeView==='ar'?'rtl':'ltr'}
                  style={{ width:'100%', background:'#F8FAFC', border:'1px solid #D8DEE9', borderRadius:10, padding:'.9rem', fontSize:'.875rem', color:'#1A1A2E', lineHeight:1.8, resize:'vertical', outline:'none', fontFamily:'inherit', minHeight:200, boxSizing:'border-box' }} />
              </div>
            )}

            {!proposal && !generating && (
              <div style={{ border:'1.5px dashed #D8DEE9', borderRadius:10, padding:'3rem 1rem', textAlign:'center', color:'#94A3B8' }}>
                <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>✦</div>
                <p style={{ fontSize:'.85rem', margin:0 }}>{isRTL?'اضغط أحد الأزرار أعلاه للتوليد':'Press a button above to generate'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes dot{0%,80%,100%{transform:scale(.6);opacity:.35}40%{transform:scale(1);opacity:1}}
        @media(max-width:900px){.td-grid{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  )
}

function Spinner({ color='#fff' }) {
  return <span style={{ width:14, height:14, border:`2px solid ${color}40`, borderTopColor:color, borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block', flexShrink:0 }} />
}
