// ===================================================
// useNotifications.js - إدارة الإشعارات الفورية
// يطلب إذن الإشعارات ويرسلها عند ظهور مهمة مناسبة
// ===================================================
import { useEffect } from 'react'

export function useNotifications() {
  // طلب إذن الإشعارات من المتصفح عند أول استخدام
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.log('المتصفح لا يدعم الإشعارات')
      return false
    }
    
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  // إرسال إشعار للمستخدم عند ظهور مهمة جديدة
  const sendNotification = (task) => {
    if (Notification.permission !== 'granted') return
    
    new Notification('🎯 مهمة جديدة تناسبك!', {
      body: task.title,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: `task-${task.id}`, // منع تكرار نفس الإشعار
    })
  }

  return { requestPermission, sendNotification }
}
