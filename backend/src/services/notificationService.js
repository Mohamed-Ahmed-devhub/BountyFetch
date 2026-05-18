// ===== خدمة الإشعارات =====
// ترسل إشعاراً للمستخدمين عند ظهور مهمة تناسب مهاراتهم
// تعمل مع Socket.io لإرسال الإشعار في الوقت الفعلي

import { emitNewTask } from '../config/socket.js'

// إرسال إشعار مهمة جديدة لكل المستخدمين المهتمين
export function notifyMatchingUsers(task) {
  if (!task.skills?.length) return

  // إرسال الإشعار لكل غرفة مهارة مرتبطة بهذه المهمة
  task.skills.forEach(skill => {
    emitNewTask(skill, {
      id:          task.id,
      title:       task.title,
      source:      task.source,
      budget:      task.estimatedBudget,
      skills:      task.skills,
      createdAt:   task.createdAt
    })
  })
}
