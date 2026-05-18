// ===== دالة مطابقة المهارات =====
// تقارن مهارات المستخدم بمتطلبات المهمة وتحسب نسبة التطابق
// تُستخدم في الـ Frontend لعرض مؤشر التوافق في بطاقة المهمة

// userSkills: ['HTML', 'CSS', 'React'] | taskSkills: ['CSS', 'Responsive']
export function calculateMatchScore(userSkills, taskSkills) {
  if (!taskSkills?.length) return 0
  
  // حساب عدد المهارات المتطابقة
  const matchedSkills = taskSkills.filter(skill =>
    userSkills.some(userSkill =>
      userSkill.toLowerCase() === skill.toLowerCase()
    )
  )
  
  // نسبة التطابق من 0 إلى 100
  return Math.round((matchedSkills.length / taskSkills.length) * 100)
}

// تحديد لون مؤشر التطابق بناءً على النسبة
export function getMatchColor(score) {
  if (score >= 80) return 'green'   // تطابق ممتاز
  if (score >= 50) return 'cyan'    // تطابق جيد
  if (score >= 30) return 'purple'  // تطابق متوسط
  return 'gray'                      // تطابق ضعيف
}
