// ===================================================
// aiController.js — نقاط نهاية الذكاء الاصطناعي
// المسار: backend/src/controllers/aiController.js
// ===================================================

const { prisma }   = require('../config/database')
const { generateProposalText, chatWithShield } = require('../services/aiService')

// ── توليد البروبوزال ──
exports.generateProposal = async (req, res, next) => {
  try {
    const { taskId, language = 'ar' } = req.body

    const [task, user] = await Promise.all([
      prisma.task.findUnique({ where: { id: taskId } }),
      prisma.user.findUnique({ where: { id: req.userId } }),
    ])

    if (!task) return res.status(404).json({ message: 'المهمة غير موجودة' })

    const proposal = await generateProposalText(task, user, language)

    // حفظ البروبوزال في قاعدة البيانات
    await prisma.proposal.create({
      data: { userId: req.userId, taskId, language, content: proposal },
    }).catch(() => {}) // تجاهل خطأ الحفظ — البروبوزال يُعاد على أي حال

    res.json({ proposal })
  } catch (e) { next(e) }
}

// ── Code Shield Chatbot ──
exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body

    if (!message?.trim())
      return res.status(400).json({ message: 'الرسالة فارغة' })

    const reply = await chatWithShield(message, history)
    res.json({ reply })
  } catch (e) { next(e) }
}
