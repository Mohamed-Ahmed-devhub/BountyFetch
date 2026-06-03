// aiController.js — Proposal generation + Code Shield chat
const { generateProposalText, chatWithShield } = require('../services/aiService')
const { prisma } = require('../config/database')

// POST /api/ai/proposal
exports.generateProposal = async (req, res, next) => {
  try {
    const { taskId, language = 'ar' } = req.body
    if (!taskId) return res.status(400).json({ message: 'taskId required' })

    const [task, user] = await Promise.all([
      prisma.task.findUnique({ where: { id: taskId } }),
      prisma.user.findUnique({ where: { id: req.userId } }),
    ])

    if (!task) return res.status(404).json({ message: 'Task not found' })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const proposal = await generateProposalText(task, user, language)

    // Persist proposal
    await prisma.proposal.upsert({
      where:  { userId_taskId: { userId: req.userId, taskId } },
      update: { language, content: typeof proposal === 'object' ? proposal[language] || proposal.ar : proposal },
      create: {
        userId:   req.userId,
        taskId,
        language,
        content:  typeof proposal === 'object' ? proposal[language] || proposal.ar : proposal,
      },
    }).catch(() => {}) // non-fatal if upsert fails

    res.json({ proposal, task: { id: task.id, title: task.title } })
  } catch (e) { next(e) }
}

// POST /api/ai/chat
exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'message (string) required' })
    }

    const reply = await chatWithShield(message.slice(0, 2000), history.slice(-10))
    res.json({ reply })
  } catch (e) { next(e) }
}
