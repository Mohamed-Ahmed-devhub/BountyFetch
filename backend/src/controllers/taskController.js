// ===================================================
<<<<<<< HEAD
// taskController.js — Pillar 2: Stats API + Pillar 7: Redis Cache
// المسار: backend/src/controllers/taskController.js
// ===================================================

const { prisma }              = require('../config/database')
const { cacheGet, cacheSet }  = require('../config/redis')
const { getIO }               = require('../config/socket')

// ── جلب المهام مع الفلترة + Redis Cache ──
exports.getTasks = async (req, res, next) => {
  try {
    const { source, skills } = req.query
    const cacheKey = `tasks:${source || 'all'}:${skills ? JSON.stringify(skills) : 'all'}`

    // محاولة الـ cache أولاً
    const cached = await cacheGet(cacheKey)
    if (cached) return res.json({ tasks: cached, cached: true })
=======
// taskController.js - جلب وإدارة المهام
// ===================================================
const { prisma } = require('../config/database')

// جلب المهام مع الفلترة
exports.getTasks = async (req, res, next) => {
  try {
    const { source, skills } = req.query
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a

    const where = {}
    if (source && source !== 'all') where.source = source
    if (skills) {
<<<<<<< HEAD
      const list   = Array.isArray(skills) ? skills : [skills]
      where.skills = { hasSome: list }
=======
      const skillList = Array.isArray(skills) ? skills : [skills]
      where.skills = { hasSome: skillList } // Prisma: هل المصفوفة تحتوي أي من المهارات
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
    }

    const tasks = await prisma.task.findMany({
      where,
<<<<<<< HEAD
      orderBy: { postedAt: 'desc' },
      take:    60,
    })

    // Cache لمدة 60 ثانية
    await cacheSet(cacheKey, tasks, 60)

    res.json({ tasks })
  } catch (e) { next(e) }
}

// ── جلب مهمة واحدة مع Cache ──
exports.getTaskById = async (req, res, next) => {
  try {
    const cacheKey = `task:${req.params.id}`
    const cached   = await cacheGet(cacheKey)
    if (cached) return res.json(cached)

    const task = await prisma.task.findUnique({ where: { id: req.params.id } })
    if (!task) return res.status(404).json({ message: 'المهمة غير موجودة' })

    await cacheSet(cacheKey, task, 300) // Cache 5 دقائق
    res.json(task)
  } catch (e) { next(e) }
}

// ── حفظ مهمة ──
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
exports.saveTask = async (req, res, next) => {
  try {
    await prisma.savedTask.upsert({
      where:  { userId_taskId: { userId: req.userId, taskId: req.params.id } },
      update: {},
      create: { userId: req.userId, taskId: req.params.id },
    })
    res.json({ message: 'تم حفظ المهمة' })
<<<<<<< HEAD
  } catch (e) { next(e) }
}

// ── Pillar 2: إحصائيات الأعضاء المصنّفة بالتخصصات ──
exports.getStats = async (req, res, next) => {
  try {
    const cacheKey = 'stats:members'
    const cached   = await cacheGet(cacheKey)
    if (cached) return res.json(cached)

    const [totalUsers, totalTasks, totalProposals] = await Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.proposal.count(),
    ])

    // إحصاء المستخدمين حسب التخصص (من حقل skills)
    const usersWithSkills = await prisma.user.findMany({
      select: { skills: true },
    })

    const trackCounts = {
      frontend:  0,
      backend:   0,
      mobile:    0,
      ai:        0,
      security:  0,
      games:     0,
      other:     0,
    }

    const trackMap = {
      frontend: ['html', 'css', 'javascript', 'react', 'vue', 'next', 'tailwind', 'bootstrap', 'typescript'],
      backend:  ['node', 'python', 'php', 'laravel', 'express', 'django'],
      mobile:   ['flutter', 'react native', 'dart', 'swift', 'kotlin'],
      ai:       ['machine learning', 'data science', 'tensorflow', 'pytorch', 'sql'],
      security: ['cybersecurity', 'pentesting', 'linux'],
      games:    ['unity', 'unreal', 'c#', 'c++'],
    }

    usersWithSkills.forEach(u => {
      const skills = (u.skills || []).map(s => s.toLowerCase())
      let assigned = false
      for (const [track, keywords] of Object.entries(trackMap)) {
        if (skills.some(s => keywords.some(k => s.includes(k)))) {
          trackCounts[track]++
          assigned = true
          break
        }
      }
      if (!assigned) trackCounts.other++
    })

    // عدد المتصلين الآن من Socket.io
    const io      = getIO()
    const onlineNow = io ? io.engine.clientsCount : 0

    const stats = {
      totalUsers,
      totalTasks,
      totalProposals,
      onlineNow,
      tracks: trackCounts,
    }

    await cacheSet(cacheKey, stats, 120) // Cache دقيقتان
    res.json(stats)
  } catch (e) { next(e) }
=======
  } catch (error) {
    next(error)
  }
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
}
