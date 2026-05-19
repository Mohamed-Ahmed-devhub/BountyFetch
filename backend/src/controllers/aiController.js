// ===================================================
// aiController.js - التحكم في طلبات الـ AI
// ===================================================
const { prisma }   = require('../config/database')
const { generateProposalText, chatWithShield } = require('../services/aiService')

// توليد البروبوزال
exports.generateProposal = async (req, res, next) => {
  try {
    const { taskId, language } = req.body

    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task) return res.status(404).json({ message: 'المهمة غير موجودة' })

    const user = await prisma.user.findUnique({ where: { id: req.userId } })

    const proposal = await generateProposalText(task, user, language)
    res.json({ proposal })
  } catch (error) {
    next(error)
  }
}

// الشات بوت Code Shield
exports.chat = async (req, res, next) => {
  try {
    const { message, history } = req.body
    const reply = await chatWithShield(message, history)
    res.json({ reply })
  } catch (error) {
    next(error)
  }
}
