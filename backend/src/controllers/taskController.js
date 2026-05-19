// ===================================================
// taskController.js - جلب وإدارة المهام
// ===================================================
const { prisma } = require('../config/database')

// جلب المهام مع الفلترة
exports.getTasks = async (req, res, next) => {
  try {
    const { source, skills } = req.query

    const where = {}
    if (source && source !== 'all') where.source = source
    if (skills) {
      const skillList = Array.isArray(skills) ? skills : [skills]
      where.skills = { hasSome: skillList } // Prisma: هل المصفوفة تحتوي أي من المهارات
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { postedAt: 'desc' }, // الأحدث أولاً
      take: 50, // حد أقصى 50 مهمة
    })

    res.json({ tasks })
  } catch (error) {
    next(error)
  }
}

// جلب مهمة واحدة بالـ ID
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } })
    if (!task) return res.status(404).json({ message: 'المهمة غير موجودة' })
    res.json(task)
  } catch (error) {
    next(error)
  }
}

// حفظ مهمة
exports.saveTask = async (req, res, next) => {
  try {
    await prisma.savedTask.upsert({
      where:  { userId_taskId: { userId: req.userId, taskId: req.params.id } },
      update: {},
      create: { userId: req.userId, taskId: req.params.id },
    })
    res.json({ message: 'تم حفظ المهمة' })
  } catch (error) {
    next(error)
  }
}
