import api from './api.js'

export const taskService = {
  getTasks:     (params)  => api.get('/tasks', { params }),
  getTaskById:  (id)      => api.get(`/tasks/${id}`),
  getStats:     ()        => api.get('/tasks/stats'),
  getSavedTasks:()        => api.get('/tasks/saved'),
  saveTask:     (id)      => api.post(`/tasks/${id}/save`),
  unsaveTask:   (id)      => api.delete(`/tasks/${id}/save`),
}
