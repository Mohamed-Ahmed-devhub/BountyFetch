// ===================================================
<<<<<<< HEAD
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
=======
// useSocket.js - Hook للاتصال بالـ WebSocket
// يدير الاتصال الحي مع السيرفر لاستقبال المهام الجديدة
// ===================================================
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

export function useSocket() {
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [newTasks, setNewTasks]       = useState([])

  useEffect(() => {
    // إنشاء الاتصال مع السيرفر
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token: localStorage.getItem('auth_token')
      }
    })

    // عند نجاح الاتصال
    socketRef.current.on('connect', () => {
      console.log('🟢 متصل بالرادار')
      setIsConnected(true)
    })

    // عند استقبال مهمة جديدة من السيرفر
    socketRef.current.on('new_task', (task) => {
      console.log('🎯 مهمة جديدة:', task.title)
      setNewTasks(prev => [task, ...prev]) // إضافة المهمة في أول القائمة
    })

    // عند انقطاع الاتصال
    socketRef.current.on('disconnect', () => {
      console.log('🔴 انقطع الاتصال بالرادار')
      setIsConnected(false)
    })

    // تنظيف الاتصال عند إغلاق المكون
    return () => {
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
      socketRef.current?.disconnect()
    }
  }, [])

<<<<<<< HEAD
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
=======
  // دالة لمسح المهام المستلمة (بعد عرضها)
  const clearNewTasks = () => setNewTasks([])

  return { isConnected, newTasks, clearNewTasks }
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
}
