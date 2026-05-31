import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import { supabase } from '../services/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

const STATUS_CONFIG = {
  active:      { ar:'نشط',        en:'Active',      color:'#28A745', bg:'#F0FDF4', border:'#BBF7D0' },
  in_progress: { ar:'قيد التواصل',en:'In Progress', color:'#F59E0B', bg:'#FFFBEB', border:'#FDE68A' },
  completed:   { ar:'مكتمل',      en:'Completed',   color:'#002D62', bg:'#E8EEF7', border:'#C5D3E8' },
}

const SOURCE_CONFIG = {
  telegram:   { emoji:'✈️', color:'#0088CC' },
  reddit:     { emoji:'🔴', color:'#FF4500' },
  twitter:    { emoji:'🐦', color:'#1DA1F2' },
  facebook:   { emoji:'👥', color:'#1877F2' },
  linkedin:   { emoji:'💼', color:'#0A66C2' },
  upwork:     { emoji:'💚', color:'#14A800' },
  mostaql:    { emoji:'🧡', color:'#FF6B35' },
  khamsat:    { emoji:'⭐', color:'#E8B84B' },
  rss:        { emoji:'📡', color:'#6B7280' },
}

export default function MyApplications() {
  const { user }   = useAuth()
  const { isRTL }  = useLanguage()
  const navigate   = useNavigate()

  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    if (!user?.id) return
    supabase.from('saved_tasks').select('*').eq('user_id', user.id).order('saved_at', { ascending: false })
      .then(({ data }) => { setTasks(data || []); setLoading(false) })
  }, [user?.id])

  const updateStatus = async (id, status) => {
    await supabase.from('saved_tasks').update({ status }).eq('id', id)
    setTasks(p => p.map(t => t.id === id ? { ...t, status } : t))
  }

  const deleteTask = async (id) => {
    await supabase.from('saved_tasks').delete().eq('id', id)
    setTasks(p => p.filter(t => t.id !== id))
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  const FILTERS = [
    { id:'all',         ar:`الكل (${tasks.length})`,   en:`All (${tasks.length})` },
    { id:'active',      ar:'نشط',                      en:'Active' },
    { id:'in_progress', ar:'قيد التواصل',              en:'In Progress' },
    { id:'completed',   ar:'مكتمل',                    en:'Completed' },
  ]

  return (
    <div style={{ background:'#F4F6F9', minHeight:'100vh', overflowX:'hidden' }} dir={isRTL?'rtl':'ltr'}>
      <Navbar />
      <div style={{ maxWidth:900, margin:'0 auto', padding:'2rem 1.5rem 4rem' }}>

        <div style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontFamily:'Plus Jakarta Sans,Cairo,sans-serif', fontSize:'clamp(1.35rem,2.5vw,1.75rem)', fontWeight:800, color:'#002D62', marginBottom:'.35rem' }}>
            📋 {isRTL ? 'طلباتي وعروضي' : 'My Applications'}
          </h1>
          <p style={{ color:'#5A6478', fontSize:'.9rem', margin:0 }}>
            {isRTL ? 'تابع الفرص البرمجية التي قنصتها من الرادار' : 'Track the coding opportunities you hunted from the radar'}
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:'.4rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{
              padding:'.42rem .95rem', borderRadius:99, fontSize:'.82rem', fontWeight:filter===f.id?700:500, cursor:'pointer', transition:'all .15s', border:'none',
              background:filter===f.id?'#002D62':'#fff', color:filter===f.id?'#fff':'#5A6478',
              boxShadow:filter===f.id?'0 2px 8px rgba(0,45,98,.2)':'0 1px 3px rgba(0,45,98,.06)',
            }}>{isRTL?f.ar:f.en}</button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          Array.from({length:3}).map((_,i) => (
            <div key={i} style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:12, padding:'1.25rem', marginBottom:'.85rem' }}>
              <div className="skeleton" style={{ height:14, width:'60%', marginBottom:'.75rem' }} />
              <div className="skeleton" style={{ height:10, width:'40%', marginBottom:'.5rem' }} />
              <div className="skeleton" style={{ height:10, width:'30%' }} />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem 1rem', background:'#fff', border:'1px solid #D8DEE9', borderRadius:16 }}>
            <div style={{ fontSize:'3rem', marginBottom:'.75rem' }}>🎯</div>
            <p style={{ fontWeight:700, color:'#1A1A2E', margin:'0 0 .5rem', fontSize:'1rem' }}>
              {isRTL ? 'لم تقنص أي فرصة بعد' : 'No hunted opportunities yet'}
            </p>
            <p style={{ fontSize:'.875rem', color:'#5A6478', margin:'0 0 1.5rem' }}>
              {isRTL ? 'افتح الرادار واصطد أول مهمة لك' : 'Open the radar and hunt your first task'}
            </p>
            <button onClick={()=>navigate('/dashboard')} style={{ padding:'.7rem 1.5rem', borderRadius:10, background:'#002D62', color:'#fff', fontWeight:700, border:'none', cursor:'pointer', fontSize:'.9rem' }}>
              {isRTL ? '📡 افتح الرادار' : '📡 Open Radar'}
            </button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'.85rem' }}>
            {filtered.map(task => {
              const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.active
              const src    = SOURCE_CONFIG[task.source] || SOURCE_CONFIG.rss
              return (
                <div key={task.id} style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:14, padding:'1.25rem 1.5rem', boxShadow:'0 1px 4px rgba(0,45,98,.06)', transition:'box-shadow .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 16px rgba(0,45,98,.1)'}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow='0 1px 4px rgba(0,45,98,.06)'}
                >
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
                    {/* Task info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.5rem', flexWrap:'wrap' }}>
                        <span style={{ fontSize:'.72rem', fontWeight:700, padding:'.18rem .6rem', borderRadius:99, color:src.color, background:`${src.color}15`, border:`1px solid ${src.color}30` }}>
                          {src.emoji} {task.source}
                        </span>
                        <span style={{ fontSize:'.68rem', fontWeight:700, padding:'.18rem .55rem', borderRadius:99, color:status.color, background:status.bg, border:`1px solid ${status.border}` }}>
                          {isRTL?status.ar:status.en}
                        </span>
                        <span style={{ fontSize:'.7rem', color:'#94A3B8', marginInlineStart:'auto' }}>
                          {new Date(task.saved_at).toLocaleDateString(isRTL?'ar-EG':'en-US')}
                        </span>
                      </div>
                      <h3 style={{ fontSize:'.95rem', fontWeight:700, color:'#1A1A2E', margin:'0 0 .35rem', lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        {task.task_title || (isRTL?'مهمة محفوظة':'Saved Task')}
                      </h3>
                      {task.budget && (
                        <p style={{ fontSize:'.82rem', fontWeight:700, color:'#28A745', fontFamily:'JetBrains Mono,monospace', margin:0 }}>
                          {task.budget}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display:'flex', flexDirection:'column', gap:'.4rem', flexShrink:0 }}>
                      <select value={task.status} onChange={e=>updateStatus(task.id, e.target.value)}
                        style={{ padding:'.38rem .65rem', border:'1.5px solid #D8DEE9', borderRadius:8, fontSize:'.78rem', color:'#1A1A2E', background:'#fff', cursor:'pointer', outline:'none', fontFamily:'inherit' }}>
                        <option value="active">{isRTL?'نشط':'Active'}</option>
                        <option value="in_progress">{isRTL?'قيد التواصل':'In Progress'}</option>
                        <option value="completed">{isRTL?'مكتمل':'Completed'}</option>
                      </select>
                      <button onClick={()=>deleteTask(task.id)} style={{ padding:'.35rem .65rem', borderRadius:8, border:'1px solid #FECACA', background:'transparent', color:'#DC3545', fontSize:'.75rem', cursor:'pointer', transition:'all .15s' }}
                        onMouseEnter={e=>{ e.currentTarget.style.background='#FEF2F2' }}
                        onMouseLeave={e=>{ e.currentTarget.style.background='transparent' }}>
                        {isRTL?'حذف':'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
