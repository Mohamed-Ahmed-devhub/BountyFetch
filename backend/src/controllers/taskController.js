// ===================================================
// taskController.js — إدارة المهام
// المسار: backend/src/controllers/taskController.js
// ===================================================

const { prisma } = require('../config/database')

// ── جلب المهام مع الفلترة ──
exports.getTasks = async (req, res, next) => {
  try {
    const { source, skills } = req.query
    const where = {}

    if (source && source !== 'all') where.source = source

    if (skills) {
      const list   = Array.isArray(skills) ? skills : [skills]
      where.skills = { hasSome: list }
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { postedAt: 'desc' },
      take:    60,
    })

    res.json({ tasks })
  } catch (e) { next(e) }
}

// ── جلب مهمة واحدة ──
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } })
    if (!task) return res.status(404).json({ message: 'المهمة غير موجودة' })
    res.json(task)
  } catch (e) { next(e) }
}

// ── حفظ مهمة ──
exports.saveTask = async (req, res, next) => {
  try {
    await prisma.savedTask.upsert({
      where:  { userId_taskId: { userId: req.userId, taskId: req.params.id } },
      update: {},
      create: { userId: req.userId, taskId: req.params.id },
    })
    res.json({ message: 'تم حفظ المهمة' })
  } catch (e) { next(e) }
}
