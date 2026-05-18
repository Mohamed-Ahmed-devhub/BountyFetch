// ===== خدمة الـ AI =====
// التواصل مع الـ Backend لاستدعاء Claude API
// لتوليد البروبوزالات وردود الشات بوت

import api from './api.js'

// توليد بروبوزال لمهمة معينة
export const generateProposal = async (taskId, language = 'ar') => {
  const { data } = await api.post('/ai/proposal', { taskId, language })
  return data.proposal
}

// إرسال رسالة للشات بوت والحصول على رد
export const sendChatMessage = async (messages, userCode = '') => {
  const { data } = await api.post('/ai/chat', { messages, userCode })
  return data.reply
}

// TODO (الأسبوع 6): تحويل هذه الدوال لـ streaming باستخدام fetch مباشرة
// لأن axios لا يدعم streaming بشكل مثالي
