// ===== Custom Hook للاتصال بـ Socket.io =====
// يدير الاتصال بالسيرفر real-time
// يُستخدم في Dashboard لاستقبال المهام الجديدة فوراً
// TODO (الأسبوع 3): تفعيل الاتصال الفعلي بعد بناء الـ Backend

import { useEffect, useRef } from 'react'
// import { io } from 'socket.io-client' // سيتم تفعيله لاحقاً

export function useSocket(onNewTask) {
  const socketRef = useRef(null)

  useEffect(() => {
    // TODO: إلغاء التعليق عند جاهزية الـ Backend
    // socketRef.current = io(import.meta.env.VITE_SOCKET_URL)
    // socketRef.current.on('new_task', onNewTask)

    // تنظيف الاتصال عند مغادرة الصفحة
    return () => {
      // socketRef.current?.disconnect()
    }
  }, [])

  return socketRef.current
}
