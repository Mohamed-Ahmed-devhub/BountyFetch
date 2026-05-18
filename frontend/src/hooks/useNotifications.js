// ===== Custom Hook لإدارة الإشعارات الفورية =====
// يطلب إذن المستخدم ويرسل Push Notifications عند ظهور مهام جديدة
// TODO (الأسبوع 7): ربط بـ Service Worker لإشعارات حتى عند إغلاق التطبيق

export function useNotifications() {
  // طلب إذن الإشعارات من المتصفح
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  // إرسال إشعار فوري
  const sendNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.svg', // TODO: إضافة أيقونة المشروع
      })
    }
  }

  return { requestPermission, sendNotification }
}
