// ===================================================
// skillsMatcher.js — حساب نسبة التطابق بين مهارات المستخدم والمهمة
// المسار: frontend/src/utils/skillsMatcher.js
// ===================================================

export function calculateMatchScore(userSkills = [], taskSkills = []) {
  if (!taskSkills.length) return 100
  const lowerUser = userSkills.map(s => s.toLowerCase())
  const matched   = taskSkills.filter(s => lowerUser.includes(s.toLowerCase()))
  return Math.round((matched.length / taskSkills.length) * 100)
}

export function getMatchLabel(score, lang = 'ar') {
  if (score >= 80) return lang === 'ar' ? '🟢 ممتاز'  : '🟢 Excellent'
  if (score >= 50) return lang === 'ar' ? '🟡 جيد'     : '🟡 Good'
  return lang === 'ar' ? '🔴 منخفض' : '🔴 Low'
}
