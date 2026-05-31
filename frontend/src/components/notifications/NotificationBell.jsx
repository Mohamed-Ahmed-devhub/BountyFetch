import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function NotificationBell() {
  const { user }   = useAuth()
  const { isRTL }  = useLanguage()
  const navigate   = useNavigate()
  const panelRef   = useRef(null)

  const [notifs, setNotifs]   = useState([])
  const [open, setOpen]       = useState(false)
  const unread = notifs.filter(n => !n.read).length

  // Load + realtime subscribe
  useEffect(() => {
    if (!user?.id) return
    // Initial load
    supabase.from('notifications').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setNotifs(data || []))

    // Realtime new notifications
    const sub = supabase.channel(`notif-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, payload => {
        setNotifs(p => [payload.new, ...p])
      })
      .subscribe()

    // Close panel on outside click
    const handleClick = e => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)

    return () => { supabase.removeChannel(sub); document.removeEventListener('mousedown', handleClick) }
  }, [user?.id])

  const markAllRead = async () => {
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
    setNotifs(p => p.map(n => ({ ...n, read: true })))
  }

  const markRead = async (id) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleClick = (n) => {
    markRead(n.id)
    if (n.link) navigate(n.link)
    setOpen(false)
  }

  const TYPE_ICON = { dm: '💬', support_reply: '🎧', task: '🎯', system: '📢' }

  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
    if (diff < 60)    return isRTL ? 'الآن' : 'now'
    if (diff < 3600)  return isRTL ? `منذ ${Math.floor(diff/60)} د` : `${Math.floor(diff/60)}m ago`
    if (diff < 86400) return isRTL ? `منذ ${Math.floor(diff/3600)} س` : `${Math.floor(diff/3600)}h ago`
    return isRTL ? `منذ ${Math.floor(diff/86400)} ي` : `${Math.floor(diff/86400)}d ago`
  }

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{ position: 'relative', width: 36, height: 36, borderRadius: 9, border: '1.5px solid #D8DEE9', background: open ? '#E8EEF7' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
        title={isRTL ? 'الإشعارات' : 'Notifications'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#5A6478" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{ position: 'absolute', top: -4, insetInlineEnd: -4, minWidth: 17, height: 17, borderRadius: 99, background: '#DC3545', color: '#fff', fontSize: '.58rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #fff' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{ position: 'absolute', top: '110%', insetInlineEnd: 0, width: 320, background: '#fff', border: '1px solid #D8DEE9', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,45,98,.14)', zIndex: 500, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '.85rem 1rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, color: '#002D62', fontSize: '.9rem' }}>
              🔔 {isRTL ? 'الإشعارات' : 'Notifications'}
              {unread > 0 && <span style={{ marginInlineStart: '.4rem', fontSize: '.7rem', color: '#DC3545', fontWeight: 700 }}>({unread})</span>}
            </span>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ fontSize: '.72rem', color: '#002D62', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>
                {isRTL ? 'قراءة الكل' : 'Mark all read'}
              </button>
            )}
          </div>

          {/* Notification list */}
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {notifs.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#94A3B8' }}>
                <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🔔</div>
                <p style={{ fontSize: '.85rem', margin: 0 }}>{isRTL ? 'لا توجد إشعارات' : 'No notifications yet'}</p>
              </div>
            ) : (
              notifs.map(n => (
                <button key={n.id} onClick={() => handleClick(n)} style={{ width: '100%', display: 'flex', gap: '.75rem', padding: '.85rem 1rem', border: 'none', background: n.read ? '#fff' : '#F8FAFF', cursor: 'pointer', textAlign: 'start', transition: 'background .15s', borderBottom: '1px solid #F1F5F9' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F4F6F9'}
                  onMouseLeave={e => e.currentTarget.style.background = n.read ? '#fff' : '#F8FAFF'}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: n.read ? '#F4F6F9' : '#E8EEF7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                    {TYPE_ICON[n.type] || '📢'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '.82rem', fontWeight: n.read ? 500 : 700, color: '#1A1A2E', margin: '0 0 .2rem', lineHeight: 1.4 }}>{n.title}</p>
                    {n.body && <p style={{ fontSize: '.75rem', color: '#5A6478', margin: '0 0 .25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.body}</p>}
                    <p style={{ fontSize: '.68rem', color: '#94A3B8', margin: 0 }}>{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#002D62', flexShrink: 0, marginTop: '.35rem' }} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
