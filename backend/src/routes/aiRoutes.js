// ===== مسارات الـ AI =====
// POST /api/ai/proposal → توليد بروبوزال لمهمة
// POST /api/ai/chat     → إرسال رسالة للشات بوت

import { Router } from 'express'
import { generateProposal, chatWithAI } from '../controllers/aiController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authMiddleware) // كل مسارات الـ AI محمية

router.post('/proposal', generateProposal) // POST /api/ai/proposal
router.post('/chat',     chatWithAI)       // POST /api/ai/chat

export default router
