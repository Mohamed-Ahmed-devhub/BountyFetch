// ===================================================
// useSocket.js — Pillar 1+2: WebSocket Hook
// يستقبل المهام الجديدة + عدد المتصلين الفعليين
// المسار: frontend/src/hooks/useSocket.js
// ===================================================

import { useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import { supabase } from '../services/supabase.js'

export function useSocket() {
  const socketRef                  = useRef(null)
  const [isConnected, setIsConnected]   = useState(false)
  const [newTasks, setNewTasks]         = useState([])
  const [onlineCount, setOnlineCount]   = useState(0)

  useEffect(() => {
    let mounted = true

    async function connect() {
      // نجلب Supabase token
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!mounted) return

      socketRef.current = io(
        import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001',
        {
          auth:       { token: token || '' },
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5,
          reconnectionDelay:    2000,
        }
      )

      socketRef.current.on('connect', () => {
        if (!mounted) return
        setIsConnected(true)
      })

      // Pillar 2: استقبال عدد المتصلين
      socketRef.current.on('online_count', ({ count }) => {
        if (!mounted) return
        setOnlineCount(count)
      })

      // استقبال مهمة جديدة
      socketRef.current.on('new_task', (task) => {
        if (!mounted) return
        setNewTasks(prev => [task, ...prev].slice(0, 50))
      })

      socketRef.current.on('disconnect', () => {
        if (!mounted) return
        setIsConnected(false)
      })

      socketRef.current.on('connect_error', (err) => {
        console.warn('⚠️ WebSocket خطأ:', err.message)
        if (!mounted) return
        setIsConnected(false)
      })
    }

    connect()

    return () => {
      mounted = false
      socketRef.current?.disconnect()
    }
  }, [])

  const joinRoom = useCallback((room) => {
    socketRef.current?.emit('join_room', room)
  }, [])

  const sendMessage = useCallback((room, content) => {
    socketRef.current?.emit('send_message', { room, content })
  }, [])

  const clearNewTasks = useCallback(() => setNewTasks([]), [])

  return {
    isConnected,
    newTasks,
    onlineCount,
    clearNewTasks,
    joinRoom,
    sendMessage,
    socket: socketRef.current,
  }
}
