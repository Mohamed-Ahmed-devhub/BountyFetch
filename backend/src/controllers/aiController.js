// ===================================================
<<<<<<< HEAD
// aiController.js — Pillar 3: AI Proposal (Gemini JSON output)
// المسار: backend/src/controllers/aiController.js
// ===================================================

const { prisma }   = require('../config/database')
const { generateProposalText, chatWithShield } = require('../services/aiService')

// ── توليد البروبوزال ──
exports.generateProposal = async (req, res, next) => {
  try {
    const { taskId, language = 'ar' } = req.body

    if (!taskId) return res.status(400).json({ message: 'taskId مطلوب' })

    const [task, user] = await Promise.all([
      prisma.task.findUnique({ where: { id: taskId } }),
      prisma.user.findUnique({ where: { id: req.userId } }),
    ])

    if (!task) return res.status(404).json({ message: 'المهمة غير موجودة' })
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' })

    // Gemini يرجع { ar, en, highlights }
    const proposal = await generateProposalText(task, user, language)

    // حفظ البروبوزال في قاعدة البيانات (النسخة حسب اللغة المطلوبة)
    await prisma.proposal.create({
      data: {
        userId:   req.userId,
        taskId,
        language,
        content: language === 'ar' ? proposal.ar : proposal.en,
      },
    }).catch(() => {})

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
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
}
