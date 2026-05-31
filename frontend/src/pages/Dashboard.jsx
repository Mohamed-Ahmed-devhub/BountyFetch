// ===================================================
<<<<<<< HEAD
// Dashboard.jsx — Pillar 2+7: Live Stats + Performance Optimized
// المسار: frontend/src/pages/Dashboard.jsx
// ===================================================

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useSocket } from '../hooks/useSocket.js'
import { MOCK_TASKS, DOMAINS, SOURCES, SOURCE_CONFIG } from '../data/mockTasks.js'
import api from '../services/api.js'

const SKILL_GROUPS = [
  { ar:'الواجهة الأمامية', en:'Frontend',  skills:['HTML','CSS','JavaScript','React','Vue.js','TypeScript','Next.js','Tailwind CSS','Bootstrap','Responsive'] },
  { ar:'الخلفية',          en:'Backend',   skills:['Node.js','Python','PHP','Laravel','Express.js'] },
  { ar:'موبايل',           en:'Mobile',    skills:['Flutter','React Native','Dart'] },
  { ar:'أدوات',            en:'Tools',     skills:['WordPress','Shopify','Figma','Git','Firebase','MongoDB','MySQL'] },
]

export default function Dashboard() {
  const { user }   = useAuth()
  const { isRTL }  = useLanguage()
  const navigate   = useNavigate()
  const { isConnected, newTasks, onlineCount } = useSocket()

  const [activeDomain,   setActiveDomain]   = useState('all')
  const [activeSource,   setActiveSource]   = useState('all')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [search,         setSearch]         = useState('')
  const [savedIds,       setSavedIds]       = useState([])
  const [tasks,          setTasks]          = useState(MOCK_TASKS)
  const [isRefreshing,   setIsRefreshing]   = useState(false)
  const [lastUpdated,    setLastUpdated]    = useState(new Date())
  const [sidebarOpen,    setSidebarOpen]    = useState(true)
  const [showSaved,      setShowSaved]      = useState(false)
  // Pillar 2: live stats
  const [stats,          setStats]          = useState(null)
  const statsLoadedRef = useRef(false)

  // Pillar 2: جلب الإحصائيات مرة واحدة
  useEffect(() => {
    if (statsLoadedRef.current) return
    statsLoadedRef.current = true
    api.get('/tasks/stats').then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  // إضافة مهام جديدة من Socket.io
  useEffect(() => {
    if (!newTasks.length) return
    setTasks(p => {
      const ids = new Set(p.map(t => t.id))
      const fresh = newTasks.filter(t => !ids.has(t.id)).map(t => ({ ...t, _isNew: true }))
      return fresh.length ? [...fresh, ...p].slice(0, 60) : p
    })
    setLastUpdated(new Date())
  }, [newTasks])

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    api.get('/tasks').then(({ data }) => {
      if (data.tasks?.length) setTasks(data.tasks)
      else setTasks([...MOCK_TASKS].sort(() => Math.random() - .5))
    }).catch(() => {
      setTasks([...MOCK_TASKS].sort(() => Math.random() - .5))
    }).finally(() => {
      setLastUpdated(new Date())
      setIsRefreshing(false)
    })
  }, [])

  const toggleSkill = useCallback(s => {
    setSelectedSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  }, [])

  // Pillar 7: useMemo لتجنب إعادة الفلترة في كل render
  const filtered = useMemo(() => tasks.filter(t => {
    if (showSaved && !savedIds.includes(t.id)) return false
    if (activeDomain !== 'all' && t.domain !== activeDomain) return false
    if (activeSource !== 'all' && t.source !== activeSource) return false
    if (selectedSkills.length > 0 && !t.skills?.some(s => selectedSkills.map(x => x.toLowerCase()).includes(s.toLowerCase()))) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [tasks, showSaved, savedIds, activeDomain, activeSource, selectedSkills, search])

  const fmt = useCallback(d => d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), [])

  const BTN = useCallback((active) => ({
    fontSize:'.8rem', fontWeight:active?700:500, padding:'.4rem .9rem', borderRadius:99, cursor:'pointer',
    whiteSpace:'nowrap', transition:'all .15s', border:'none',
    background:active?'#002D62':'#fff', color:active?'#fff':'#5A6478',
    boxShadow:active?'0 2px 8px rgba(0,45,98,.2)':'0 1px 3px rgba(0,45,98,.06)',
  }), [])

  return (
    <div style={{ background:'#F4F6F9', minHeight:'100vh', overflowX:'hidden' }} dir={isRTL?'rtl':'ltr'}>
      <Navbar />
      <div style={{ display:'flex', height:'calc(100vh - 64px)', overflow:'hidden' }}>

        {/* Sidebar */}
        <aside style={{ width:sidebarOpen?240:50, flexShrink:0, background:'#fff', borderInlineEnd:'1px solid #D8DEE9', display:'flex', flexDirection:'column', overflow:'hidden', transition:'width .3s ease' }}>
          <div style={{ padding:'1rem', borderBottom:'1px solid #D8DEE9', display:'flex', alignItems:'center', justifyContent:'space-between', minHeight:52 }}>
            {sidebarOpen && <span style={{ fontSize:'.7rem', fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'#5A6478', whiteSpace:'nowrap', overflow:'hidden' }}>{isRTL?'فلتر المهارات':'Skill Filter'}</span>}
            <button onClick={()=>setSidebarOpen(v=>!v)} style={{ background:'none', border:'1px solid #D8DEE9', borderRadius:7, padding:'.28rem', cursor:'pointer', display:'flex', alignItems:'center', color:'#5A6478', marginInlineStart:sidebarOpen?'auto':0 }}>
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4h12M2 8h12M2 12h6"/></svg>
            </button>
          </div>

          {sidebarOpen && (
            <div style={{ flex:1, overflowY:'auto', padding:'.85rem', display:'flex', flexDirection:'column', gap:'1.1rem' }}>
              {SKILL_GROUPS.map((g,gi) => (
                <div key={gi}>
                  <p style={{ fontSize:'.66rem', fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'#94A3B8', marginBottom:'.45rem' }}>{isRTL?g.ar:g.en}</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'.3rem' }}>
                    {g.skills.map(s => {
                      const active = selectedSkills.includes(s)
                      return (
                        <button key={s} onClick={()=>toggleSkill(s)} style={{ fontSize:'.72rem', fontWeight:active?700:400, padding:'.22rem .6rem', borderRadius:99, cursor:'pointer', transition:'all .15s', background:active?'#002D62':'transparent', color:active?'#fff':'#5A6478', border:`1px solid ${active?'#002D62':'#D8DEE9'}` }}>
                          {s}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              {selectedSkills.length > 0 && (
                <button onClick={()=>setSelectedSkills([])} style={{ fontSize:'.75rem', fontWeight:600, color:'#DC3545', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'.4rem .75rem', cursor:'pointer' }}>
                  {isRTL?`✕ مسح (${selectedSkills.length})`:`✕ Clear (${selectedSkills.length})`}
                </button>
              )}
            </div>
          )}
        </aside>

        {/* Main */}
        <main style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column', padding:'1.25rem 1.5rem', gap:'1rem' }}>

          {/* Header + Pillar 2: live badge */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'.75rem' }}>
            <div>
              <h1 style={{ fontFamily:'Plus Jakarta Sans,Cairo,sans-serif', fontSize:'1.35rem', fontWeight:800, color:'#002D62', margin:0 }}>
                {isRTL?'📡 رادار القنص':'📡 Bounty Radar'}
              </h1>
              <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginTop:'.3rem', flexWrap:'wrap' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background: isConnected ? '#28A745' : '#DC3545', display:'inline-block', animation: isConnected ? 'pulse 2s infinite' : 'none' }} />
                <span style={{ fontSize:'.75rem', color:'#5A6478' }}>{isConnected ? (isRTL?'متصل':'Connected') : (isRTL?'غير متصل':'Disconnected')}</span>
                {/* Pillar 2: عدد المتصلين الحقيقي */}
                {isConnected && onlineCount > 0 && (
                  <span style={{ fontSize:'.72rem', fontWeight:700, color:'#28A745', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:99, padding:'.1rem .5rem' }}>
                    🟢 {onlineCount} {isRTL?'مطوّر متصل':'online'}
                  </span>
                )}
                {stats && (
                  <span style={{ fontSize:'.72rem', color:'#94A3B8' }}>
                    · {stats.totalUsers?.toLocaleString()} {isRTL?'مطوّر':'devs'} · {stats.totalTasks?.toLocaleString()} {isRTL?'مهمة':'tasks'}
                  </span>
                )}
                <span style={{ fontSize:'.7rem', color:'#94A3B8' }}>· {fmt(lastUpdated)}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
              <button onClick={()=>setShowSaved(v=>!v)} style={BTN(showSaved)}>
                🔖 {isRTL?`المفضلة (${savedIds.length})`:`Saved (${savedIds.length})`}
              </button>
              <button onClick={handleRefresh} disabled={isRefreshing} style={{ ...BTN(false), background:'#002D62', color:'#fff', opacity:isRefreshing?.7:1 }}>
                <span style={{ display:'inline-block', animation:isRefreshing?'spin .8s linear infinite':'none' }}>🔄</span>{' '}
                {isRTL?(isRefreshing?'يحدّث...':'تحديث'):(isRefreshing?'Refreshing...':'Refresh')}
              </button>
            </div>
          </div>

          {/* Search */}
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder={isRTL?'🔍 ابحث في المهام...':'🔍 Search tasks...'}
            style={{ padding:'.6rem 1rem', border:'1.5px solid #D8DEE9', borderRadius:9, fontSize:'.875rem', background:'#fff', outline:'none', color:'#1A1A2E', transition:'border-color .15s' }}
            onFocus={e=>e.target.style.borderColor='#002D62'} onBlur={e=>e.target.style.borderColor='#D8DEE9'}
          />

          {/* Domain filters */}
          <div style={{ display:'flex', gap:'.4rem', overflowX:'auto', flexShrink:0, paddingBottom:'.1rem' }}>
            {DOMAINS.map(d => (
              <button key={d.id} onClick={()=>setActiveDomain(d.id)} style={{ ...BTN(activeDomain===d.id), padding:'.38rem .85rem', whiteSpace:'nowrap' }}>
                {d.icon} {isRTL?d.ar:d.en}
              </button>
            ))}
          </div>

          {/* Source filters */}
          <div style={{ display:'flex', gap:'.3rem', overflowX:'auto', flexShrink:0 }}>
            {SOURCES.slice(0,7).map(s => (
              <button key={s.id} onClick={()=>setActiveSource(s.id)} style={{ fontSize:'.72rem', fontWeight:activeSource===s.id?700:400, padding:'.26rem .7rem', borderRadius:99, cursor:'pointer', whiteSpace:'nowrap', transition:'all .15s', border:'none', background:activeSource===s.id?'#E8EEF7':'transparent', color:activeSource===s.id?'#002D62':'#94A3B8' }}>
                {s.id!=='all' && SOURCE_CONFIG[s.id]?.emoji} {isRTL?s.ar:s.en}
              </button>
            ))}
          </div>

          {/* Feed */}
          <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:'.75rem', paddingInlineEnd:'.15rem' }}>
            {isRefreshing ? (
              Array.from({length:4}).map((_,i) => (
                <div key={i} style={{ background:'#fff', border:'1px solid #D8DEE9', borderRadius:12, padding:'1.25rem', display:'flex', flexDirection:'column', gap:'.7rem' }}>
                  {[25,75,100,38].map((w,j) => <div key={j} className="skeleton" style={{ height:j===1?17:11, width:`${w}%` }} />)}
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'3rem', textAlign:'center' }}>
                <div style={{ fontSize:'3rem', marginBottom:'.75rem' }}>📭</div>
                <p style={{ fontWeight:700, color:'#1A1A2E', margin:'0 0 .4rem' }}>{isRTL?'لا توجد مهام مطابقة':'No matching tasks'}</p>
                <p style={{ fontSize:'.85rem', color:'#5A6478', margin:0 }}>{isRTL?'جرّب تعديل الفلاتر أو اضغط تحديث':'Try adjusting filters or click Refresh'}</p>
              </div>
            ) : (
              filtered.map((task, i) => {
                const src     = SOURCE_CONFIG[task.source] || SOURCE_CONFIG.rss
                const isSaved = savedIds.includes(task.id)
                const srcUrl  = task.url || task.sourceUrl
                return (
                  <article key={task.id}
                    onClick={()=>navigate(`/task/${task.id}`)}
                    style={{ background:'#fff', border:`1px solid ${task._isNew?'#28A745':'#D8DEE9'}`, borderRadius:12, padding:'1.1rem 1.25rem 1rem', cursor:'pointer', transition:'box-shadow .2s,transform .15s', boxShadow:task._isNew?'0 0 0 2px rgba(40,167,69,.12)':'0 1px 4px rgba(0,45,98,.06)', position:'relative', animation:`fadeUp .3s ease ${Math.min(i*.04,.3)}s both` }}
                    onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 6px 20px rgba(0,45,98,.1)'; e.currentTarget.style.transform='translateY(-1px)' }}
                    onMouseLeave={e=>{ e.currentTarget.style.boxShadow=task._isNew?'0 0 0 2px rgba(40,167,69,.12)':'0 1px 4px rgba(0,45,98,.06)'; e.currentTarget.style.transform='' }}
                  >
                    {task._isNew && <span style={{ position:'absolute', top:'.65rem', insetInlineEnd:'.65rem', fontSize:'.6rem', fontWeight:800, color:'#28A745', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:99, padding:'.15rem .5rem' }}>{isRTL?'⚡ جديد':'⚡ NEW'}</span>}
                    <div style={{ display:'flex', alignItems:'center', gap:'.45rem', marginBottom:'.55rem', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'.7rem', fontWeight:700, padding:'.18rem .6rem', borderRadius:99, color:src.color, background:`${src.color}15`, border:`1px solid ${src.color}30` }}>{src.emoji} {src.label}</span>
                      <span style={{ fontSize:'.68rem', color:'#94A3B8', marginInlineStart:'auto' }}>{task.postedAt}</span>
                      <button onClick={e=>{ e.stopPropagation(); setSavedIds(p => p.includes(task.id) ? p.filter(x=>x!==task.id) : [...p, task.id]) }} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'.9rem', padding:'.1rem', transition:'transform .2s' }}
                        onMouseEnter={e=>e.currentTarget.style.transform='scale(1.2)'} onMouseLeave={e=>e.currentTarget.style.transform=''}>
                        {isSaved?'🔖':'📌'}
                      </button>
                    </div>
                    <h3 style={{ fontSize:'.93rem', fontWeight:700, color:'#1A1A2E', margin:'0 0 .4rem', lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{task.title}</h3>
                    <p style={{ fontSize:'.8rem', color:'#5A6478', margin:'0 0 .55rem', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{task.description}</p>
                    {task.skills?.length>0 && (
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'.3rem', marginBottom:'.6rem' }}>
                        {task.skills.map(s=><span key={s} style={{ fontSize:'.67rem', fontWeight:600, padding:'.18rem .55rem', borderRadius:99, background:'#E8EEF7', border:'1px solid #C5D3E8', color:'#002D62' }}>{s}</span>)}
                      </div>
                    )}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'.5rem', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'.78rem', fontWeight:700, color:'#28A745', fontFamily:'JetBrains Mono,monospace' }}>{task.budget||(isRTL?'مفتوح':'Open')}</span>
                      <div style={{ display:'flex', gap:'.4rem' }} onClick={e=>e.stopPropagation()}>
                        {/* Pillar 4: رابط المصدر الحقيقي */}
                        {srcUrl && srcUrl !== '#' && (
                          <a href={srcUrl} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize:'.72rem', fontWeight:600, padding:'.28rem .65rem', borderRadius:7, border:'1px solid #D8DEE9', background:'transparent', color:'#5A6478', textDecoration:'none', transition:'all .15s' }}
                            onMouseEnter={e=>{ e.currentTarget.style.borderColor='#0ea5e9'; e.currentTarget.style.color='#0ea5e9' }}
                            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#D8DEE9'; e.currentTarget.style.color='#5A6478' }}>
                            🔗 {isRTL?'المصدر':'Source'}
                          </a>
                        )}
                        <button onClick={()=>navigate(`/task/${task.id}`)}
                          style={{ fontSize:'.75rem', fontWeight:700, padding:'.32rem .75rem', borderRadius:7, border:'1.5px solid #002D62', background:'transparent', color:'#002D62', cursor:'pointer', transition:'all .15s' }}
                          onMouseEnter={e=>{ e.currentTarget.style.background='#002D62'; e.currentTarget.style.color='#fff' }}
                          onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#002D62' }}>
                          {isRTL?'اصطد ←':'→ Hunt'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </main>
      </div>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#D8DEE9;border-radius:99px}
        .skeleton{background:linear-gradient(90deg,#F4F6F9 25%,#E8EEF7 50%,#F4F6F9 75%);background-size:200%;animation:shimmer 1.4s infinite;border-radius:6px}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      `}</style>
    </div>
  )
}
=======
// Dashboard.jsx - صفحة الرادار الرئيسية
// قلب التطبيق: عرض المهام المباشرة والفلترة
// ===================================================
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../components/layout/Navbar.jsx'
import LiveFeed from '../components/radar/LiveFeed.jsx'
import FilterPanel from '../components/radar/FilterPanel.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import { taskService } from '../services/taskService.js'
import { useSocket } from '../hooks/useSocket.js'
import { useNotifications } from '../hooks/useNotifications.js'

function Dashboard() {
  const { t } = useTranslation()
  const [activeSource, setActiveSource]     = useState('all')
  const [selectedSkills, setSelectedSkills] = useState([])
  
  // الاتصال بالـ WebSocket لاستقبال المهام الجديدة
  const { isConnected, newTasks } = useSocket()
  const { requestPermission, sendNotification } = useNotifications()

  // طلب إذن الإشعارات عند فتح الصفحة
  useEffect(() => { requestPermission() }, [])

  // إرسال إشعار عند ظهور مهام جديدة
  useEffect(() => {
    newTasks.forEach(task => sendNotification(task))
  }, [newTasks])

  // جلب المهام من الـ Backend
  const { data, isLoading } = useQuery({
    queryKey: ['tasks', activeSource, selectedSkills],
    queryFn: () => taskService.getTasks({ source: activeSource, skills: selectedSkills }),
    refetchInterval: 30000, // تحديث كل 30 ثانية كـ backup للـ WebSocket
  })

  // دمج المهام الجديدة من الـ WebSocket مع القديمة
  const allTasks = [...(newTasks || []), ...(data?.data?.tasks || [])]

  // تبديل اختيار المهارة
  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* الشريط الجانبي للفلترة */}
        <Sidebar selectedSkills={selectedSkills} onSkillToggle={handleSkillToggle} />
        
        {/* المنطقة الرئيسية */}
        <main className="flex-1 overflow-y-auto p-6">
          
          {/* رأس الرادار */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-white">
                📡 {t('radar.title')}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`live-dot ${isConnected ? '' : 'bg-neon-red!'}`}></span>
                <span className="text-xs text-gray-400">
                  {isConnected ? t('radar.live') : 'غير متصل'}
                </span>
                <span className="text-xs text-gray-600">•</span>
                <span className="text-xs text-gray-400">
                  {allTasks.length} {t('radar.tasks_found')}
                </span>
              </div>
            </div>
          </div>

          {/* فلتر المصادر */}
          <div className="mb-4">
            <FilterPanel activeSource={activeSource} onSourceChange={setActiveSource} />
          </div>

          {/* قائمة المهام */}
          <LiveFeed tasks={allTasks} isLoading={isLoading} />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
