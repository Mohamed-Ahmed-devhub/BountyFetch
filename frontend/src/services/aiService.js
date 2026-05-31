// ===================================================
<<<<<<< HEAD
// aiService.js — خدمة الـ AI (Frontend)
// يرسل الطلبات للـ Backend الذي يتصل بـ Claude API
// المسار: frontend/src/services/aiService.js
// ===================================================

import api from './api.js'

export const aiService = {
  // توليد بروبوزال لمهمة محددة
  generateProposal: (taskId, language = 'ar') =>
    api.post('/ai/proposal', { taskId, language }),

  // إرسال رسالة لـ Code Shield
  sendChatMessage: (message, history = []) =>
    api.post('/ai/chat', { message, history }),
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
}
