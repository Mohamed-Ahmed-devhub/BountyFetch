// ===================================================
// taskService.js - كل الدوال المتعلقة بالمهام
// التواصل مع الـ Backend لجلب وإدارة المهام
// ===================================================
import api from './api.js'

export const taskService = {
  // جلب قائمة المهام المفلترة حسب مهارات المستخدم
  getTasks: (filters = {}) => {
    return api.get('/tasks', { params: filters })
  },

  // جلب تفاصيل مهمة محددة
  getTaskById: (taskId) => {
    return api.get(`/tasks/${taskId}`)
  },

  // حفظ مهمة في قائمة المهام المحفوظة
  saveTask: (taskId) => {
    return api.post(`/tasks/${taskId}/save`)
  },
}
