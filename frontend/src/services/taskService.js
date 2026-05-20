// ===================================================
// taskService.js — خدمة المهام (Frontend)
// المسار: frontend/src/services/taskService.js
// ===================================================

import api from './api.js'

export const taskService = {
  // جلب المهام مع فلاتر اختيارية
  getTasks:    (params = {}) => api.get('/tasks', { params }),
  getTaskById: (id)          => api.get(`/tasks/${id}`),
  saveTask:    (id)          => api.post(`/tasks/${id}/save`),
}
