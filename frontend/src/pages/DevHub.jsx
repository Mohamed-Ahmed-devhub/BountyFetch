// ===================================================
// DevHub.jsx — Pillar 1+2: Socket.io Chat + Live Counters
// المسار: frontend/src/pages/DevHub.jsx
// ===================================================

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from '../components/layout/Navbar.jsx'
import { supabase } from '../services/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useSocket } from '../hooks/useSocket.js'

const ROOMS = [
  { id:'general',  icon:'💬', ar:'عام',              en:'General' },
  { id:'web',      icon:'🖥️', ar:'مطوري الويب',      en:'Web Dev' },
  { id:'mobile',   icon:'📱', ar:'تطبيقات موبايل',  en:'Mobile Apps' },
  { id:'ai',       icon:'🤖', ar:'الذكاء الاصطناعي', en:'AI & Data' },
  { id:'security', icon:'🔐', ar:'الأمن السيبراني',  en:'Cybersecurity' },
  { id:'games',    icon:'🎮', ar:'تطوير الألعاب',    en:'Game Dev' },
]

function Avatar({ name, avatarUrl, size = 34 }) {
  if (avatarUrl) return <img src={avatarUrl} alt={name} style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:'#002D62', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*.35, fontWeight:700, flexShrink:0 }}>
      {(name||'?').charAt(0).toUpperCase()}
    </div>
  )
}

function MsgBubble({ msg, myId, isRTL }) {
  const isMine = msg.userId === myId
  return (
    <div style={{ display:'flex', gap:'.5rem', alignItems:'flex-end', flexDirection:isMine?'row-reverse':'row', marginBottom:'.65rem' }}>
      <Avatar name={msg.userName} avatarUrl={msg.userAvatar} size={30} />
      <div style={{ maxWidth:'72%' }}>
        {!isMine && (
          <span style={{ fontSize:'.7rem', fontWeight:700, color:'#002D62', display:'block', marginBottom:'.2rem' }}>{msg.userName}</span>
        )}
        <div style={{
          padding:'.7rem .95rem', fontSize:'.875rem', lineHeight:1.65,
          borderRadius:isMine?'14px 14px 4px 14px':'14px 14px 14px 4px',
          background:isMine?'#002D62':'#F8FAFC', color:isMine?'#fff':'#1A1A2E',
          border:`1px solid ${isMine?'#002D62':'#E2E8F0'}`,
        }}>{msg.content}</div>
        <span style={{ fontSize:'.62rem', color:'#94A3B8', display:'block', marginTop:'.2rem', textAlign:isMine?'end':'start' }}>
          {new Date(msg.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
        </span>
      </div>
    </div>
  )
}

export default function DevHub() {
  const { user }   = useAuth()
  const { isRTL }  = useLanguage()
  const { isConnected, onlineCount, joinRoom, sendMessage, socket } = useSocket()

  const [activeRoom, setActiveRoom] = useState('general')
  const [messages,   setMessages]   = useState([])
  const [input,      setInput]      = useState('')
  const [sending,    setSending]    = useState(false)
  const [loadingMsgs,setLoading]    = useState(false)
  const endRef  = useRef(null)
  const fileRef = useRef(null)

  const room = ROOMS.find(r => r.id === activeRoom)

  // ── Pillar 1: انضمام للغرفة عند التغيير ──
  useEffect(() => {
    if (!isConnected) return
    joinRoom(activeRoom)
    setMessages([])
  }, [activeRoom, isConnected, joinRoom])

  // ── تحميل آخر 50 رسالة من قاعدة البيانات ──
  useEffect(() => {
    setLoading(true)
    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
    supabase.auth.getSession().then(({ data: { session } }) => {
      const token = session?.access_token || ''
      fetch(`${API}/chat/${activeRoom}?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : { messages: [] })
        .then(d => setMessages(d.messages || []))
        .catch(() => setMessages([]))
        .finally(() => setLoading(false))
    })
  }, [activeRoom])

  // ── Pillar 1: استقبال رسائل Socket.io ──
  useEffect(() => {
    if (!socket) return
    const handler = (msg) => {
      if (msg.room === activeRoom) {
        setMessages(p => {
          // تجنب التكرار
          if (p.some(m => m.id === msg.id)) return p
          return [...p, msg]
        })
      }
    }
    socket.on('new_message', handler)
    return () => socket.off('new_message', handler)
  }, [socket, activeRoom])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  // ── إرسال رسالة ──
  const send = useCallback(() => {
    const t = input.trim()
    if (!t || sending || !isConnected) return
    setSending(true)
    sendMessage(activeRoom, t)
    setInput('')
    setSending(false)
  }, [input, sending, isConnected, sendMessage, activeRoom])

  const uploadFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const path = `chat/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('chat-files').upload(path, file)
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('chat-files').getPublicUrl(path)
      sendMessage(activeRoom, `📎 [مرفق] ${publicUrl}`)
    }
    e.target.value = ''
  }

  return (
    <div style={{ background:'#F4F6F9', minHeight:'100vh', overflowX:'hidden' }} dir={isRTL?'rtl':'ltr'}>
      <Navbar />
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'1.5rem', display:'grid', gridTemplateColumns:'240px 1fr', gap:'1.25rem', height:'calc(100vh - 64px - 3rem)' }}>

        {/* Sidebar الغرف */}
        <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:14, overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid #D8DEE9' }}>
            <h2 style={{ fontSize:'.95rem', fontWeight:800, color:'#002D62', margin:0 }}>💬 {isRTL?'ملتقى المطورين':'Dev Hub'}</h2>
            {/* Pillar 2: عدد المتصلين الحقيقي */}
            <p style={{ fontSize:'.72rem', margin:'.25rem 0 0', display:'flex', alignItems:'center', gap:'.3rem' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background: isConnected ? '#28A745' : '#DC3545', display:'inline-block' }} />
              <span style={{ color: isConnected ? '#28A745' : '#DC3545', fontWeight:600 }}>
                {isConnected ? (onlineCount || 1) : (isRTL ? 'غير متصل' : 'Offline')} {isConnected ? (isRTL?'متصل الآن':'online now') : ''}
              </span>
            </p>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'.5rem' }}>
            {ROOMS.map(r => (
              <button key={r.id} onClick={()=>setActiveRoom(r.id)} style={{
                width:'100%', display:'flex', alignItems:'center', gap:'.65rem', padding:'.7rem .85rem',
                borderRadius:9, border:'none', cursor:'pointer', textAlign:'start', marginBottom:'.2rem',
                background:activeRoom===r.id?'#E8EEF7':'transparent',
              }}>
                <span style={{ fontSize:'1.15rem' }}>{r.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:'.83rem', fontWeight:activeRoom===r.id?700:500, color:activeRoom===r.id?'#002D62':'#1A1A2E', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {isRTL?r.ar:r.en}
                  </p>
                </div>
                {activeRoom===r.id && <div style={{ width:6, height:6, borderRadius:'50%', background:'#28A745', flexShrink:0 }} />}
              </button>
            ))}
          </div>
        </div>

        {/* منطقة الشات */}
        <div style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:14, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* هيدر الغرفة */}
          <div style={{ padding:'.9rem 1.5rem', borderBottom:'1px solid #D8DEE9', display:'flex', alignItems:'center', gap:'.75rem' }}>
            <span style={{ fontSize:'1.35rem' }}>{room?.icon}</span>
            <div>
              <h3 style={{ fontSize:'.95rem', fontWeight:700, color:'#002D62', margin:0 }}>{isRTL?room?.ar:room?.en}</h3>
              <p style={{ fontSize:'.72rem', color:'#5A6478', margin:0, display:'flex', alignItems:'center', gap:'.35rem' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#28A745', display:'inline-block', animation:'pulse 2s infinite' }} />
                {/* Pillar 2: العدد الحقيقي من Socket.io */}
                {onlineCount || 1} {isRTL?'متصل الآن':'online now'}
              </p>
            </div>
          </div>

          {/* الرسائل */}
          <div style={{ flex:1, overflowY:'auto', padding:'1.25rem 1.5rem' }}>
            {loadingMsgs ? (
              <div style={{ textAlign:'center', color:'#94A3B8', padding:'3rem' }}>
                <div style={{ width:24, height:24, border:'2.5px solid #D8DEE9', borderTopColor:'#002D62', borderRadius:'50%', animation:'spin .8s linear infinite', margin:'0 auto .75rem' }} />
                <p style={{ margin:0, fontSize:'.85rem' }}>{isRTL?'تحميل الرسائل...':'Loading messages...'}</p>
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign:'center', padding:'3rem', color:'#94A3B8' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'.5rem' }}>💬</div>
                <p style={{ margin:0, fontSize:'.875rem' }}>{isRTL?'كن أول من يتحدث في هذه الغرفة!':'Be the first to talk in this room!'}</p>
              </div>
            ) : (
              messages.map(msg => (
                <MsgBubble key={msg.id} msg={msg} myId={user?.id} isRTL={isRTL} />
              ))
            )}
            <div ref={endRef} />
          </div>

          {/* مربع الإدخال */}
          <div style={{ padding:'.9rem 1.5rem', borderTop:'1px solid #D8DEE9', display:'flex', gap:'.6rem', alignItems:'flex-end' }}>
            <button onClick={()=>fileRef.current?.click()} style={{ width:38, height:38, borderRadius:9, border:'1.5px solid #D8DEE9', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#5A6478', flexShrink:0 }} title={isRTL?'إرفاق ملف':'Attach file'}>
              📎
            </button>
            <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={uploadFile} style={{ display:'none' }} />
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send() } }}
              placeholder={
                !isConnected
                  ? (isRTL?'⚠️ غير متصل بالسيرفر':'⚠️ Disconnected from server')
                  : (isRTL?'اكتب رسالتك... (Enter للإرسال)':'Type your message... (Enter to send)')
              }
              disabled={!isConnected}
              style={{ flex:1, padding:'.6rem .9rem', border:'1.5px solid #D8DEE9', borderRadius:9, fontSize:'.875rem', background: isConnected ? '#F8FAFC' : '#F4F6F9', outline:'none', fontFamily:'inherit', transition:'border-color .15s', color:'#1A1A2E' }}
              onFocus={e=>e.target.style.borderColor='#002D62'}
              onBlur={e=>e.target.style.borderColor='#D8DEE9'}
            />
            <button
              onClick={send}
              disabled={!input.trim()||sending||!isConnected}
              style={{ width:40, height:40, borderRadius:9, background:'#002D62', color:'#fff', border:'none', cursor:(input.trim()&&!sending&&isConnected)?'pointer':'not-allowed', opacity:(input.trim()&&!sending&&isConnected)?1:.45, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="17" height="17"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @media(max-width:768px){.hub-grid{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  )
}
