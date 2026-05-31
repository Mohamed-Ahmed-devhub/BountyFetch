<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../components/layout/Navbar.jsx'
import { supabase } from '../services/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

const QUICK = {
  ar: ['لماذا لا يعمل Flexbox على الموبايل؟','كيف أصلح z-index لا يعمل؟','مشكلة في querySelector','كيف أجعل الصورة Responsive؟'],
  en: ['Why is Flexbox not working on mobile?','How to fix z-index issue?','querySelector returning null','How to make images responsive?'],
}

const WELCOME = {
  ar: '**Code Shield** جاهز 🛡️\n\nأساعدك في:\n• تصحيح أخطاء HTML/CSS/JavaScript\n• إصلاح مشاكل Responsive Design\n• تحسين الكود قبل التسليم للعميل\n\nالصق كودك أو اشرح المشكلة!',
  en: '**Code Shield** ready 🛡️\n\nI help you with:\n• HTML/CSS/JavaScript debugging\n• Responsive Design fixes\n• Code quality before delivery\n\nPaste your code or describe the issue!',
}

function MsgContent({ text }) {
  const parts = text.split(/(```[\s\S]*?```)/g)
  return (
    <div>
      {parts.map((p, i) => {
        if (p.startsWith('```') && p.endsWith('```')) {
          const lines = p.slice(3,-3).split('\n')
          const lang  = lines[0].trim()
          const code  = lines.slice(1).join('\n').trim()
          return (
            <pre key={i} style={{ background:'#1E293B', border:'1px solid #334155', borderRadius:8, padding:'.75rem 1rem', overflow:'auto', fontSize:'.78rem', fontFamily:'JetBrains Mono,monospace', color:'#E2E8F0', margin:'.5rem 0', lineHeight:1.7 }}>
              {lang && <span style={{ color:'#64748B', fontSize:'.62rem', display:'block', marginBottom:'.3rem' }}>{lang}</span>}
              <code>{code || p.slice(3,-3)}</code>
            </pre>
          )
        }
        return (
          <span key={i} style={{ whiteSpace:'pre-wrap' }} dangerouslySetInnerHTML={{ __html: p
            .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
            .replace(/`([^`]+)`/g,'<code style="background:#F1F5F9;padding:1px 5px;border-radius:4px;font-family:monospace;font-size:.85em;color:#002D62">$1</code>')
          }} />
        )
      })}
    </div>
  )
}

export default function CodeShield() {
  const { isRTL, language } = useLanguage()
  const endRef   = useRef(null)
  const textRef  = useRef(null)

  const [msgs, setMsgs]       = useState([{ role:'assistant', content:WELCOME[language]||WELCOME.ar, isWelcome:true }])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, loading])

  const send = async (text = input) => {
    const t = text.trim()
    if (!t || loading) return
    setMsgs(p => [...p, { role:'user', content:t }])
    setInput('')
    if (textRef.current) textRef.current.style.height = 'auto'
    setLoading(true)

    try {
      const history = msgs.filter(m=>!m.isWelcome).map(m=>({ role:m.role, content:m.content }))
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', ...(localStorage.getItem('sb-session') ? { Authorization: `Bearer ${JSON.parse(localStorage.getItem('sb-session'))?.access_token}` } : {}) },
        body: JSON.stringify({ message:t, history }),
      })
      const data = await res.json()
      setMsgs(p => [...p, { role:'assistant', content: data.reply || data.message || (isRTL?'حدث خطأ':'Error occurred') }])
    } catch {
      const fallback = { ar:'⚠️ تعذر الاتصال بالـ AI. تأكد من تشغيل Backend وإضافة GEMINI_API_KEY في .env', en:'⚠️ Could not connect to AI. Make sure Backend is running and GEMINI_API_KEY is set.' }
      setMsgs(p => [...p, { role:'assistant', content:fallback[language]||fallback.en, isError:true }])
    } finally { setLoading(false) }
  }

  return (
    <div style={{ background:'#F4F6F9', minHeight:'100vh', display:'flex', flexDirection:'column', overflowX:'hidden' }} dir={isRTL?'rtl':'ltr'}>
      <Navbar />
      <div style={{ flex:1, maxWidth:860, width:'100%', margin:'0 auto', padding:'1.5rem', display:'flex', flexDirection:'column', height:'calc(100vh - 64px)' }}>
        <div style={{ flex:1, background:'#fff', border:'1px solid #D8DEE9', borderRadius:16, boxShadow:'0 1px 4px rgba(0,45,98,.06)', display:'flex', flexDirection:'column', overflow:'hidden' }}>

          {/* Header */}
          <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid #D8DEE9', display:'flex', alignItems:'center', gap:'.75rem' }}>
            <div style={{ width:38, height:38, borderRadius:9, background:'#002D62', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>🛡️</div>
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:'.95rem', fontWeight:800, color:'#002D62', margin:0 }}>Code Shield</h2>
              <p style={{ fontSize:'.72rem', color:'#5A6478', margin:0 }}>{isRTL?'مساعد برمجي متخصص — BountyFetch':'Specialized coding assistant — BountyFetch'}</p>
            </div>
            <button onClick={()=>setMsgs([{ role:'assistant', content:WELCOME[language]||WELCOME.ar, isWelcome:true }])}
              style={{ fontSize:'.75rem', fontWeight:600, color:'#5A6478', background:'none', border:'1px solid #D8DEE9', borderRadius:7, padding:'.3rem .7rem', cursor:'pointer' }}>
              {isRTL?'🗑 مسح':'🗑 Clear'}
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'.85rem' }}>
            {msgs.map((m,i) => {
              const isUser = m.role==='user'
              return (
                <div key={i} style={{ display:'flex', gap:'.5rem', alignItems:'flex-end', flexDirection:isUser?'row-reverse':'row' }}>
                  {!isUser && <div style={{ width:28, height:28, borderRadius:'50%', background:'#002D62', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.85rem', flexShrink:0 }}>🛡️</div>}
                  <div style={{ maxWidth:'80%', padding:'.8rem 1rem', borderRadius:isUser?'14px 14px 4px 14px':'14px 14px 14px 4px', fontSize:'.875rem', lineHeight:1.7,
                    background:isUser?'#002D62':m.isError?'#FEF2F2':'#F8FAFC',
                    color:isUser?'#fff':m.isError?'#DC3545':'#1A1A2E',
                    border:`1px solid ${isUser?'#002D62':m.isError?'#FECACA':'#E2E8F0'}`,
                  }}>
                    <MsgContent text={m.content} />
                  </div>
                </div>
              )
            })}
            {loading && (
              <div style={{ display:'flex', gap:'.5rem', alignItems:'flex-end' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'#002D62', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.85rem' }}>🛡️</div>
                <div style={{ padding:'.75rem 1rem', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:'14px 14px 14px 4px', display:'flex', gap:'.3rem' }}>
                  {[0,1,2].map(i=><span key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#002D62', display:'inline-block', animation:`dot 1.2s ease-in-out ${i*.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick prompts */}
          {msgs.length <= 1 && (
            <div style={{ padding:'0 1.5rem .75rem', display:'flex', flexWrap:'wrap', gap:'.35rem' }}>
              {(QUICK[language]||QUICK.en).map((q,i) => (
                <button key={i} onClick={()=>send(q)}
                  style={{ fontSize:'.75rem', fontWeight:500, padding:'.3rem .75rem', borderRadius:99, border:'1px solid #D8DEE9', background:'transparent', color:'#5A6478', cursor:'pointer', transition:'all .15s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='#002D62'; e.currentTarget.style.color='#002D62' }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='#D8DEE9'; e.currentTarget.style.color='#5A6478' }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:'1rem 1.5rem', borderTop:'1px solid #D8DEE9', display:'flex', gap:'.6rem', alignItems:'flex-end', background:'rgba(248,250,252,.8)', backdropFilter:'blur(8px)' }}>
            <textarea ref={textRef} value={input}
              onChange={e=>{ setInput(e.target.value); e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,140)+'px' }}
              onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send() } }}
              placeholder={isRTL?'الصق كودك أو اشرح المشكلة... (Enter للإرسال)':'Paste code or describe issue... (Enter to send)'}
              rows={1} disabled={loading}
              style={{ flex:1, padding:'.62rem .9rem', border:'1.5px solid #D8DEE9', borderRadius:10, fontSize:'.875rem', background:'#fff', resize:'none', outline:'none', fontFamily:'inherit', maxHeight:140, transition:'border-color .15s' }}
              onFocus={e=>e.target.style.borderColor='#002D62'} onBlur={e=>e.target.style.borderColor='#D8DEE9'}
            />
            <button onClick={()=>send()} disabled={!input.trim()||loading}
              style={{ width:40, height:40, borderRadius:10, background:'#002D62', color:'#fff', border:'none', cursor:input.trim()&&!loading?'pointer':'not-allowed', opacity:input.trim()&&!loading?1:.45, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s' }}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="17" height="17"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes dot{0%,80%,100%{transform:scale(.6);opacity:.35}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  )
}
=======
// ===================================================
// CodeShield.jsx - صفحة درع الكود (الشات بوت)
// ===================================================
import React from 'react'
import Navbar from '../components/layout/Navbar.jsx'
import ChatWindow from '../components/chatbot/ChatWindow.jsx'

function CodeShield() {
  return (
    <div className="page-container flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
        <ChatWindow />
      </div>
    </div>
  )
}

export default CodeShield
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
