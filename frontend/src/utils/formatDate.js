// ===================================================
<<<<<<< HEAD
// formatDate.js — تنسيق التواريخ
// المسار: frontend/src/utils/formatDate.js
// ===================================================

export function timeAgo(dateString, lang = 'ar') {
  const now  = new Date()
  const date = new Date(dateString)
  const diff = Math.floor((now - date) / 1000)

  if (lang === 'ar') {
    if (diff < 60)    return 'منذ لحظات'
    if (diff < 3600)  return `منذ ${Math.floor(diff / 60)} دقيقة`
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`
    return `منذ ${Math.floor(diff / 86400)} يوم`
  }
  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
=======
// formatDate.js - دوال تنسيق التاريخ والوقت
// ===================================================

// تحويل التاريخ إلى صيغة "منذ X دقائق"
export function timeAgo(dateString, lang = 'ar') {
  const now  = new Date()
  const date = new Date(dateString)
  const diff = Math.floor((now - date) / 1000) // الفرق بالثواني

  if (lang === 'ar') {
    if (diff < 60)   return 'منذ لحظات'
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`
    return `منذ ${Math.floor(diff / 86400)} يوم`
  } else {
    if (diff < 60)   return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
}
