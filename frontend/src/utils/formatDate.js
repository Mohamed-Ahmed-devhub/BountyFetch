// ===== دوال تنسيق التواريخ =====
// تحوّل التواريخ الخام لصيغ قابلة للقراءة بالعربية والإنجليزية

// تنسيق: "منذ 5 دقائق" أو "5 minutes ago"
export function timeAgo(dateString, lang = 'ar') {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)

  if (lang === 'ar') {
    if (diffMins < 1)    return 'الآن'
    if (diffMins < 60)   return `منذ ${diffMins} دقيقة`
    if (diffHours < 24)  return `منذ ${diffHours} ساعة`
    return `منذ ${Math.floor(diffHours / 24)} يوم`
  } else {
    if (diffMins < 1)    return 'just now'
    if (diffMins < 60)   return `${diffMins}m ago`
    if (diffHours < 24)  return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }
}
