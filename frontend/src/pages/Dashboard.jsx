// Dashboard.jsx — Live task radar with real-time feed and filters
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import ErrorBoundary from '../components/ui/ErrorBoundary.jsx'
import { useNavigate }        from 'react-router-dom'
import { useAuth }            from '../context/AuthContext.jsx'
import { useLanguage }        from '../context/LanguageContext.jsx'
import { useSocket }          from '../hooks/useSocket.js'
import { useNotifications }   from '../hooks/useNotifications.js'
import { taskService }        from '../services/taskService.js'
import { matchScore }         from '../utils/skillsMatcher.js'
import TaskCard               from '../components/radar/TaskCard.jsx'
import FilterPanel            from '../components/radar/FilterPanel.jsx'
import MOCK_TASKS             from '../data/mockTasks.js'

const SOURCES = ['all', 'reddit', 'telegram', 'twitter']

export default function Dashboard() {
  const { user, logout }           = useAuth()
  const { isRTL, language, toggleLanguage } = useLanguage()
  const navigate                   = useNavigate()
  const { requestPermission, sendNotification } = useNotifications()

  const [tasks,       setTasks]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [refreshing,   setRefreshing]   = useState(false)
  const [source,      setSource]      = useState('all')
  const [newTaskIds,  setNewTaskIds]  = useState(new Set())
  const [savedIds,    setSavedIds]    = useState(new Set())
  const [savedLoading, setSavedLoading] = useState(false)
  const [stats,       setStats]       = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile,    setIsMobile]    = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  const [search,      setSearch]      = useState('')
  const [skillFilter, setSkillFilter] = useState([])
  const newBadgeTimers               = useRef({})

  // Fetch tasks
  const fetchTasks = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const params = {}
      if (source !== 'all')          params.source = source
      if (skillFilter.length > 0)    params.skills = skillFilter
      const res = await taskService.getTasks(params)
      setTasks(res.data.tasks || MOCK_TASKS)
    } catch {
      setTasks(MOCK_TASKS)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [source, skillFilter])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  // Fetch live stats
  useEffect(() => {
    taskService.getStats()
      .then(r => setStats(r.data))
      .catch(() => {})
  }, [])

  // Request notification permission on mount
  useEffect(() => { requestPermission() }, [requestPermission])

  // Socket.io — live new tasks
  useSocket(useCallback((newTask) => {
    setTasks(prev => {
      if (prev.find(t => t.id === newTask.id)) return prev
      return [newTask, ...prev]
    })
    setNewTaskIds(prev => new Set([...prev, newTask.id]))
    sendNotification(
      isRTL ? '🎯 مهمة جديدة!' : '🎯 New Task!',
      newTask.title,
      `/tasks/${newTask.id}`
    )
    // Clear NEW badge after 30s
    if (newBadgeTimers.current[newTask.id]) clearTimeout(newBadgeTimers.current[newTask.id])
    newBadgeTimers.current[newTask.id] = setTimeout(() => {
      setNewTaskIds(prev => { const s = new Set(prev); s.delete(newTask.id); return s })
    }, 30000)
  }, [isRTL, sendNotification]))

  // Filtered + searched tasks with match scoring
  const displayedTasks = useMemo(() => {
    let list = tasks
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.skills?.some(s => s.toLowerCase().includes(q))
      )
    }
    if (skillFilter.length > 0) {
      list = list.filter(t => skillFilter.some(sf =>
        t.skills?.map(s => s.toLowerCase()).includes(sf.toLowerCase())
      ))
    }
    // Sort: NEW first, then by match score, then by date
    return [...list].sort((a, b) => {
      const aNew   = newTaskIds.has(a.id) ? 1 : 0
      const bNew   = newTaskIds.has(b.id) ? 1 : 0
      if (aNew !== bNew) return bNew - aNew
      const aScore = matchScore(a.skills, user?.skills || [])
      const bScore = matchScore(b.skills, user?.skills || [])
      if (aScore !== bScore) return bScore - aScore
      return new Date(b.postedAt) - new Date(a.postedAt)
    })
  }, [tasks, search, skillFilter, newTaskIds, user?.skills])

  // Load saved IDs from backend on mount
  useEffect(() => {
    setSavedLoading(true)
    taskService.getSavedTasks()
      .then(r => setSavedIds(new Set(r.data.ids || [])))
      .catch(() => {}) // non-fatal — start with empty set
      .finally(() => setSavedLoading(false))
  }, [])

  const handleSave = useCallback(async (taskId) => {
    const wasSaved = savedIds.has(taskId)
    // Optimistic update
    setSavedIds(prev => {
      const s = new Set(prev)
      wasSaved ? s.delete(taskId) : s.add(taskId)
      return s
    })
    try {
      if (wasSaved) await taskService.unsaveTask(taskId)
      else          await taskService.saveTask(taskId)
    } catch {
      // Rollback on failure
      setSavedIds(prev => {
        const s = new Set(prev)
        wasSaved ? s.add(taskId) : s.delete(taskId)
        return s
      })
    }
  }, [savedIds])

  const S = {
    root:        { minHeight: '100vh', background: '#F4F6F9', fontFamily: 'Plus Jakarta Sans, Cairo, sans-serif', direction: isRTL ? 'rtl' : 'ltr' },
    topbar:      { background: '#002D62', padding: '.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', position: 'sticky', top: 0, zIndex: 100 },
    logo:        { fontSize: '1.1rem', fontWeight: 800, color: '#fff', letterSpacing: '-.02em' },
    topbarRight: { display: 'flex', alignItems: 'center', gap: '.6rem' },
    topBtn:      { padding: '.4rem .85rem', borderRadius: 7, border: '1px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', fontSize: '.8rem', cursor: 'pointer', transition: 'background .15s' },
    body:        { display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: 1200, margin: '0 auto', padding: isMobile ? '1rem .75rem' : '1.5rem 1rem', gap: '1.25rem' },
    sidebar:     { width: isMobile ? '100%' : 260, flexShrink: 0, display: (isMobile && !sidebarOpen) ? 'none' : 'block' },
    main:        { flex: 1, minWidth: 0 },
    sourceRow:   { display: 'flex', gap: '.35rem', marginBottom: '1rem', flexWrap: 'wrap' },
    sourceBtn:   (a) => ({ padding: '.4rem .9rem', borderRadius: 99, border: `1.5px solid ${a ? '#002D62' : '#D8DEE9'}`, background: a ? '#002D62' : '#fff', color: a ? '#fff' : '#5A6478', fontSize: '.8rem', fontWeight: a ? 700 : 500, cursor: 'pointer', textTransform: 'capitalize' }),
    searchBar:   { width: '100%', padding: '.65rem 1rem', borderRadius: 9, border: '1.5px solid #D8DEE9', background: '#fff', fontSize: '.9rem', marginBottom: '1rem', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
    statsRow:    { display: 'flex', gap: '.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' },
    statPill:    { fontSize: '.8rem', padding: '.35rem .85rem', borderRadius: 99, background: '#EBF8FF', color: '#2B6CB0', border: '1px solid #BEE3F8', fontWeight: 600 },
    grid:        { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(300px,1fr))', gap: isMobile ? '.75rem' : '1rem' },
    empty:       { textAlign: 'center', color: '#94A3B8', padding: '3rem 1rem', fontSize: '.95rem' },
    skeleton:    { background: '#fff', borderRadius: 12, height: 130, border: '1px solid #E2E8F0', padding: '1rem', overflow: 'hidden', position: 'relative' },
    skelLine:    (w, h='12px', mb='8px') => ({ background: '#E2E8F0', borderRadius: 6, height: h, width: w, marginBottom: mb, animation: 'shimmer 1.4s infinite' }),
    countBadge:  { fontSize: '.75rem', background: 'rgba(255,255,255,.15)', color: '#fff', padding: '.2rem .55rem', borderRadius: 99, marginLeft: '.35rem' },
  }

  const newCount = newTaskIds.size

  return (
    <div style={S.root}>
      {/* Top bar */}
      <div style={S.topbar}>
        <span style={S.logo}>◈ BountyFetch</span>
        <div style={{ ...S.topbarRight, gap: isMobile ? '.3rem' : '.6rem' }}>
          {newCount > 0 && (
            <span style={{ ...S.statPill, background: '#DC3545', color: '#fff', border: 'none' }}>
              ● {newCount} {isRTL ? 'جديدة' : 'new'}
            </span>
          )}
          <button style={S.topBtn} onClick={toggleLanguage}>{isRTL ? 'EN' : 'ع'}</button>
          {!isMobile && <button style={S.topBtn} onClick={() => navigate('/profile')}>{isRTL ? 'الملف' : 'Profile'}</button>}
          {!isMobile && <button style={S.topBtn} onClick={() => navigate('/code-shield')}>{isRTL ? 'شيلد' : 'Shield'}</button>}
          {!isMobile && <button style={S.topBtn} onClick={() => navigate('/hub')}>DevHub</button>}
          {!isMobile && <button style={S.topBtn} onClick={() => navigate('/support')}>{isRTL ? 'دعم' : 'Support'}</button>}
          <button style={{ ...S.topBtn, borderColor: '#FF6B6B', color: '#FF6B6B' }} onClick={logout}>
            {isRTL ? 'خروج' : 'Logout'}
          </button>
        </div>
      </div>

      <div style={S.body}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <FilterPanel
            selectedSkills={skillFilter}
            onSkillsChange={setSkillFilter}
            userSkills={user?.skills || []}
          />
          {/* User mini card */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              {user?.avatar
                ? <img src={user.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#002D62', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.9rem' }}>{user?.name?.[0] || '?'}</div>
              }
              <div>
                <div style={{ fontWeight: 700, fontSize: '.85rem', color: '#1E293B' }}>{user?.name}</div>
                <div style={{ fontSize: '.75rem', color: '#94A3B8' }}>{user?.skills?.length || 0} {isRTL ? 'مهارة' : 'skills'}</div>
              </div>
            </div>
          </div>
          {/* Profile completion nudge */}
          {user && (() => {
            const fields = [
              user.skills?.length > 2,
              !!user.bio,
              !!user.jobTitle,
              !!(user.linkedinUrl || user.githubUrl),
              !!user.avatar,
            ]
            const done = fields.filter(Boolean).length
            const pct  = Math.round((done / fields.length) * 100)
            if (pct >= 100) return null
            return (
              <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:12, padding:'.85rem 1rem', marginTop:'1rem', cursor:'pointer' }}
                onClick={() => navigate('/profile')}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.4rem' }}>
                  <span style={{ fontSize:'.78rem', fontWeight:700, color:'#1D4ED8' }}>
                    {isRTL ? `🎯 أكمل ملفك — ${pct}%` : `🎯 Complete profile — ${pct}%`}
                  </span>
                  <span style={{ fontSize:'.7rem', color:'#93C5FD' }}>←</span>
                </div>
                <div style={{ background:'#BFDBFE', borderRadius:99, height:5 }}>
                  <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:'#2563EB', transition:'width .4s' }}/>
                </div>
                <p style={{ fontSize:'.72rem', color:'#3B82F6', margin:'.35rem 0 0' }}>
                  {isRTL ? 'ملفك يحسّن جودة المقترحات المولّدة بالـ AI' : 'Your profile improves AI-generated proposal quality'}
                </p>
              </div>
            )
          })()}

          {/* Live stats */}
          {stats && (
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '1rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '.75rem' }}>
                {isRTL ? 'إحصائيات حية' : 'Live Stats'}
              </div>
              {[
                { label: isRTL ? 'الأعضاء' : 'Members',   value: stats.totalUsers },
                { label: isRTL ? 'المهام' : 'Tasks',       value: stats.totalTasks },
                { label: isRTL ? 'المقترحات' : 'Proposals', value: stats.totalProposals },
                { label: isRTL ? 'أونلاين' : 'Online',     value: stats.onlineNow || 0 },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '.3rem 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: '.8rem', color: '#5A6478' }}>{s.label}</span>
                  <span style={{ fontSize: '.8rem', fontWeight: 700, color: '#002D62' }}>{s.value?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={S.main}>
          {/* First-run welcome banner */}
          {user && (!user.skills || user.skills.length === 0) && (
            <div style={{ background:'linear-gradient(135deg,#002D62,#1D4ED8)', borderRadius:12, padding:'1.1rem 1.25rem', marginBottom:'1rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
              <div>
                <p style={{ color:'#fff', fontWeight:700, fontSize:'.95rem', margin:'0 0 .2rem' }}>
                  {isRTL ? `👋 مرحباً ${user.name?.split(' ')[0] || ''}!` : `👋 Welcome, ${user.name?.split(' ')[0] || ''}!`}
                </p>
                <p style={{ color:'rgba(255,255,255,.75)', fontSize:'.82rem', margin:0 }}>
                  {isRTL ? 'أضف مهاراتك لتحسين مطابقة المهام وجودة المقترحات.' : 'Add your skills to improve task matching and proposal quality.'}
                </p>
              </div>
              <button
                onClick={() => navigate('/profile')}
                style={{ padding:'.55rem 1.2rem', borderRadius:8, border:'1.5px solid rgba(255,255,255,.4)', background:'transparent', color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer', whiteSpace:'nowrap' }}>
                {isRTL ? '← أضف مهاراتك' : '← Add Skills'}
              </button>
            </div>
          )}

          {/* Mobile sidebar toggle */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(p => !p)}
              style={{ padding:'.5rem .9rem', borderRadius:8, border:'1.5px solid #D8DEE9', background:'#fff', fontSize:'.85rem', fontWeight:600, cursor:'pointer', marginBottom:'.75rem', color:'#002D62' }}
            >
              {sidebarOpen ? (isRTL ? '✕ إخفاء الفلاتر' : '✕ Hide filters') : (isRTL ? '⚙ الفلاتر والإحصائيات' : '⚙ Filters & Stats')}
            </button>
          )}
          {/* Source filter + refresh indicator */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.5rem' }}>
            <div/>
            {refreshing && <span style={{ fontSize:'.75rem', color:'#94A3B8', display:'flex', alignItems:'center', gap:'.3rem' }}><span style={{ width:10,height:10,border:'2px solid #94A3B840',borderTopColor:'#94A3B8',borderRadius:'50%',animation:'spin .8s linear infinite',display:'inline-block'}}/>{isRTL?'جاري التحديث...':'Refreshing...'}</span>}
          </div>
          <div style={S.sourceRow}>
            {SOURCES.map(s => (
              <button key={s} style={S.sourceBtn(source === s)} onClick={() => setSource(s)}>
                {s === 'all' ? (isRTL ? 'الكل' : 'All') : s}
                {s === 'all' && <span style={S.countBadge}>{tasks.length}</span>}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            style={S.searchBar}
            placeholder={isRTL ? '🔍 ابحث عن مهارة أو كلمة مفتاحية...' : '🔍 Search by skill or keyword...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            dir={isRTL ? 'rtl' : 'ltr'}
          />

          {/* Stats pills */}
          {displayedTasks.length > 0 && (
            <div style={S.statsRow}>
              <span style={S.statPill}>
                {displayedTasks.length} {isRTL ? 'مهمة' : 'tasks'}
              </span>
              {newCount > 0 && (
                <span style={{ ...S.statPill, background: '#FEF9C3', color: '#854D0E', border: '1px solid #FDE047' }}>
                  ● {newCount} {isRTL ? 'جديدة الآن' : 'new now'}
                </span>
              )}
              {skillFilter.length > 0 && (
                <span
                  style={{ ...S.statPill, cursor: 'pointer', background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5' }}
                  onClick={() => setSkillFilter([])}
                >
                  ✕ {isRTL ? 'إلغاء الفلتر' : 'Clear filter'}
                </span>
              )}
            </div>
          )}

          {/* Task grid */}
          {loading ? (
            <div style={S.grid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={S.skeleton}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 10 }}>
                    <div style={S.skelLine('60%', '14px')}/>
                    <div style={S.skelLine('18%', '14px')}/>
                  </div>
                  <div style={{ display:'flex', gap:6, marginBottom:10 }}>
                    <div style={S.skelLine('22%', '22px', '0')}/>
                    <div style={S.skelLine('18%', '22px', '0')}/>
                    <div style={S.skelLine('20%', '22px', '0')}/>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:'auto', paddingTop:8 }}>
                    <div style={S.skelLine('25%', '11px', '0')}/>
                    <div style={S.skelLine('20%', '11px', '0')}/>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedTasks.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
              {search || skillFilter.length > 0 ? (
                // Filtered empty state — actionable
                <div style={{ maxWidth:360, margin:'0 auto' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>🔍</div>
                  <h3 style={{ fontSize:'1rem', fontWeight:700, color:'#1E293B', margin:'0 0 .4rem' }}>
                    {isRTL ? 'لا توجد نتائج مطابقة' : 'No matching results'}
                  </h3>
                  <p style={{ fontSize:'.875rem', color:'#94A3B8', margin:'0 0 1.25rem', lineHeight:1.6 }}>
                    {isRTL ? 'جرّب تغيير كلمات البحث أو إلغاء بعض الفلاتر.' : 'Try different keywords or remove some filters.'}
                  </p>
                  <div style={{ display:'flex', gap:'.6rem', justifyContent:'center', flexWrap:'wrap' }}>
                    {search && (
                      <button onClick={() => setSearch('')}
                        style={{ padding:'.5rem 1.1rem', borderRadius:8, border:'1.5px solid #D8DEE9', background:'#fff', fontSize:'.85rem', cursor:'pointer', color:'#5A6478' }}>
                        {isRTL ? '✕ مسح البحث' : '✕ Clear search'}
                      </button>
                    )}
                    {skillFilter.length > 0 && (
                      <button onClick={() => setSkillFilter([])}
                        style={{ padding:'.5rem 1.1rem', borderRadius:8, border:'1.5px solid #D8DEE9', background:'#fff', fontSize:'.85rem', cursor:'pointer', color:'#5A6478' }}>
                        {isRTL ? '✕ مسح الفلتر' : '✕ Clear filters'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                // No tasks at all — radar state
                <div style={{ maxWidth:380, margin:'0 auto' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>📡</div>
                  <h3 style={{ fontSize:'1rem', fontWeight:700, color:'#1E293B', margin:'0 0 .4rem' }}>
                    {isRTL ? 'الرادار يعمل...' : 'Radar is running...'}
                  </h3>
                  <p style={{ fontSize:'.875rem', color:'#94A3B8', margin:'0 0 1.25rem', lineHeight:1.6 }}>
                    {isRTL
                      ? 'سيجلب الرادار مهام جديدة من Reddit وتيليجرام كل 10 دقائق. ستظهر هنا فور اكتشافها.'
                      : 'The radar fetches new tasks from Reddit and Telegram every 10 minutes. They will appear here the moment they are found.'}
                  </p>
                  <p style={{ fontSize:'.78rem', color:'#CBD5E1' }}>
                    {isRTL ? '⏱ آخر فحص: منذ لحظات' : '⏱ Last scan: moments ago'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={S.grid}>
              {displayedTasks.map(task => (
                <div key={task.id} style={{ position: 'relative' }}>
                  <TaskCard task={task} isNew={newTaskIds.has(task.id)} />
                  <button
                    onClick={e => { e.stopPropagation(); handleSave(task.id) }}
                    style={{
                      position: 'absolute', top: 8, right: isRTL ? 'auto' : 8, left: isRTL ? 8 : 'auto',
                      background: savedIds.has(task.id) ? '#002D62' : 'rgba(255,255,255,.9)',
                      border: '1px solid #E2E8F0', borderRadius: 7, padding: '.2rem .5rem',
                      fontSize: '.7rem', cursor: 'pointer', color: savedIds.has(task.id) ? '#fff' : '#94A3B8',
                    }}
                  >
                    {savedIds.has(task.id) ? '★' : '☆'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-color: #E2E8F0; }
          50%  { background-color: #F1F5F9; }
          100% { background-color: #E2E8F0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
