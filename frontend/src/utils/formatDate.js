export function formatDate(dateStr, lang = 'en') {
  try {
    const date   = new Date(dateStr)
    const locale = lang === 'ar' ? 'ar-SA' : 'en-US'
    const now    = Date.now()
    const diff   = now - date.getTime()
    const mins   = Math.floor(diff / 60000)
    const hours  = Math.floor(diff / 3600000)
    const days   = Math.floor(diff / 86400000)

    if (mins < 1)   return lang === 'ar' ? 'الآن'                : 'Just now'
    if (mins < 60)  return lang === 'ar' ? `منذ ${mins} دقيقة`  : `${mins}m ago`
    if (hours < 24) return lang === 'ar' ? `منذ ${hours} ساعة`  : `${hours}h ago`
    if (days < 7)   return lang === 'ar' ? `منذ ${days} أيام`   : `${days}d ago`
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
  } catch {
    return dateStr || ''
  }
}
