// ===== Controller الـ AI =====
// يتواصل مع Claude API لتوليد البروبوزالات وردود الشات بوت

import { generateProposalText, getChatReply } from '../services/aiService.js'
import prisma from '../config/database.js'

// POST /api/ai/proposal
export async function generateProposal(req, res) {
  try {
    const { taskId, language = 'ar' } = req.body

    // جلب بيانات المهمة
    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task) return res.status(404).json({ message: 'المهمة غير موجودة' })

    // جلب مهارات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { name: true, skills: true }
    })

    // استدعاء Claude API
    const proposal = await generateProposalText({ task, user, language })

    res.json({ proposal })

  } catch (error) {
    res.status(500).json({ message: 'خطأ في توليد البروبوزال', error: error.message })
  }
}

// POST /api/ai/chat
export async function chatWithAI(req, res) {
  try {
    const { messages, userCode = '' } = req.body

    // استدعاء Claude API للرد على المستخدم
    const reply = await getChatReply({ messages, userCode })

    res.json({ reply })

  } catch (error) {
    res.status(500).json({ message: 'خطأ في الشات بوت', error: error.message })
  }
}
