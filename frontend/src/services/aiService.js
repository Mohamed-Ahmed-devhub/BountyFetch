// ===================================================
// aiService.js - التواصل مع الـ AI في الـ Backend
// يرسل البيانات للسيرفر الذي يتواصل مع Claude API
// ===================================================
import api from './api.js'

export const aiService = {
  // توليد بروبوزال احترافي لمهمة معينة
  generateProposal: (taskId, language = 'ar') => {
    return api.post('/ai/proposal', { taskId, language })
  },

  // إرسال رسالة للشات بوت (Code Shield)
  sendChatMessage: (message, conversationHistory = []) => {
    return api.post('/ai/chat', { message, history: conversationHistory })
  },
}
