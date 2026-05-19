// ===================================================
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
      socketRef.current?.disconnect()
    }
  }, [])

  // دالة لمسح المهام المستلمة (بعد عرضها)
  const clearNewTasks = () => setNewTasks([])

  return { isConnected, newTasks, clearNewTasks }
}
