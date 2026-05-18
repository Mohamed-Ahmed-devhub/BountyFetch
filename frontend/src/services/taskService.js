// ===== خدمة المهام =====
// كل العمليات المتعلقة بجلب وفلترة المهام من الـ Backend

import api from './api.js'

// جلب المهام المصطادة مع الفلاتر
export const getTasks = async (filters = {}) => {
  const { data } = await api.get('/tasks', { params: filters })
  return data
}

// جلب تفاصيل مهمة واحدة بمعرّفها
export const getTaskById = async (taskId) => {
  const { data } = await api.get(`/tasks/${taskId}`)
  return data
}

// TODO: إضافة حفظ المهمة في المفضلة، وتحديث الحالة
