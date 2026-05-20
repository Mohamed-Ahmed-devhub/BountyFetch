// ===================================================
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
}
