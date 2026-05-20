// ===================================================
// useNotifications.js — إدارة الإشعارات الفورية
// يطلب إذن المتصفح ويرسل إشعاراً عند كل مهمة جديدة
// المسار: frontend/src/hooks/useNotifications.js
// ===================================================

export function useNotifications() {
  // طلب إذن الإشعارات من المتصفح
  const requestPermission = async () => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    const result = await Notification.requestPermission()
    return result === 'granted'
  }

  // إرسال إشعار للمستخدم
  const sendNotification = (task) => {
    if (Notification.permission !== 'granted') return

    new Notification('🎯 مهمة جديدة تناسبك!', {
      body:  task.title?.slice(0, 80) || 'تحقق من الرادار',
      icon:  '/favicon.svg',
      badge: '/favicon.svg',
      tag:   `task-${task.id}`, // منع تكرار نفس الإشعار
    })
  }

  return { requestPermission, sendNotification }
}
