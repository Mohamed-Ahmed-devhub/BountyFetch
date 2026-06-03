import { useCallback } from 'react'

export function useNotifications() {
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported'
    if (Notification.permission === 'granted') return 'granted'
    if (Notification.permission === 'denied')  return 'denied'
    const result = await Notification.requestPermission()
    return result
  }, [])

  const sendNotification = useCallback((title, body, url = null) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return
    const n = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'bountyfetch-task',
    })
    if (url) n.onclick = () => { window.focus(); window.open(url, '_blank') }
  }, [])

  return { requestPermission, sendNotification }
}
