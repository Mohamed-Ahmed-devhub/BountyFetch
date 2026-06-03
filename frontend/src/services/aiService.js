import api from './api.js'

export const aiService = {
  generateProposal: (taskId, language = 'ar') =>
    api.post('/ai/proposal', { taskId, language }),
  chat: (message, history = []) =>
    api.post('/ai/chat', { message, history }),
}
