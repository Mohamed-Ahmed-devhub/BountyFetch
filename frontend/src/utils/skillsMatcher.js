// ===================================================
<<<<<<< HEAD
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
=======
// skillsMatcher.js - مطابقة مهارات المستخدم مع المهمة
// تحسب نسبة التطابق بين مهارات المستخدم ومتطلبات المهمة
// ===================================================

export function calculateMatchScore(userSkills = [], taskSkills = []) {
  if (taskSkills.length === 0) return 100 // إذا لا توجد مهارات محددة = تناسب الجميع

  const matchCount = taskSkills.filter(skill =>
    userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
  ).length

  return Math.round((matchCount / taskSkills.length) * 100)
}

// تصنيف درجة التطابق
export function getMatchLabel(score, lang = 'ar') {
  if (score >= 80) return lang === 'ar' ? '🟢 مطابقة ممتازة' : '🟢 Excellent Match'
  if (score >= 50) return lang === 'ar' ? '🟡 مطابقة جيدة'   : '🟡 Good Match'
  return lang === 'ar' ? '🔴 مطابقة منخفضة' : '🔴 Low Match'
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
}
