// ===================================================
<<<<<<< HEAD
// taskService.js — خدمة المهام (Frontend)
// المسار: frontend/src/services/taskService.js
// ===================================================

import api from './api.js'

export const taskService = {
  // جلب المهام مع فلاتر اختيارية
  getTasks:    (params = {}) => api.get('/tasks', { params }),
  getTaskById: (id)          => api.get(`/tasks/${id}`),
  saveTask:    (id)          => api.post(`/tasks/${id}/save`),
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
}
