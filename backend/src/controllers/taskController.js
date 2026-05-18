// ===== Controller المهام =====
// جلب المهام من قاعدة البيانات مع دعم الفلترة

import prisma from '../config/database.js'

// GET /api/tasks
export async function getTasks(req, res) {
  try {
    // الفلاتر من query parameters: ?skill=CSS&source=telegram
    const { skill, source, limit = 20, page = 1 } = req.query

    // بناء شرط الفلترة بشكل ديناميكي
    const where = {}
    if (source) where.source = source
    if (skill)  where.skills = { has: skill } // PostgreSQL Array Contains

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' }, // الأحدث أولاً
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    })

    const total = await prisma.task.count({ where })

    res.json({
      tasks,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    })

  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المهام', error: error.message })
  }
}

// GET /api/tasks/:id
export async function getTaskById(req, res) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id }
    })

    if (!task) {
      return res.status(404).json({ message: 'المهمة غير موجودة' })
    }

    res.json({ task })
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المهمة', error: error.message })
  }
}
