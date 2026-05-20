// ===================================================
// useSocket.js — Hook للاتصال بالـ WebSocket
// يدير الاتصال الحي مع السيرفر لاستقبال المهام الجديدة
// المسار: frontend/src/hooks/useSocket.js
// ===================================================

import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

export function useSocket() {
  const socketRef              = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [newTasks, setNewTasks]       = useState([])

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) return // لا اتصال بدون token

    socketRef.current = io(
      import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001',
      { auth: { token }, transports: ['websocket', 'polling'] }
    )

    socketRef.current.on('connect', () => {
      console.log('🟢 WebSocket متصل')
      setIsConnected(true)
    })

    // استقبال مهمة جديدة من السيرفر
    socketRef.current.on('new_task', (task) => {
      setNewTasks(prev => [task, ...prev].slice(0, 50)) // حد أقصى 50
    })

    socketRef.current.on('disconnect', () => {
      console.log('🔴 WebSocket انقطع')
      setIsConnected(false)
    })

    socketRef.current.on('connect_error', (err) => {
      console.warn('⚠️ WebSocket خطأ:', err.message)
      setIsConnected(false)
    })

    return () => socketRef.current?.disconnect()
  }, [])

  const clearNewTasks = () => setNewTasks([])

  return { isConnected, newTasks, clearNewTasks }
}
