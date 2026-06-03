import api from './api.js'

export const authService = {
  syncWithBackend: (accessToken) =>
    api.post('/auth/supabase-sync', { access_token: accessToken }),
  getProfile: () =>
    api.get('/auth/profile'),
  updateProfile: (data) =>
    api.put('/auth/profile', data),
  updateSkills: (skills) =>
    api.put('/auth/skills', { skills }),
  uploadAvatar: (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    })
  },
}
