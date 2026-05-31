import api from './api.js'
export const authService = {
  supabaseSync: token => api.post('/auth/supabase-sync', { access_token: token }),
  getProfile:   ()    => api.get('/auth/profile'),
  updateSkills: skills => api.put('/auth/skills', { skills }),
}
