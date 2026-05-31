// ===================================================
<<<<<<< HEAD
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
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
    })
  }

  return { requestPermission, sendNotification }
}
