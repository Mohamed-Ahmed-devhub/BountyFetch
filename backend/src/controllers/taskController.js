// taskController.js — Tasks CRUD + Stats + Redis Cache
const { prisma }             = require('../config/database')
const { cacheGet, cacheSet } = require('../config/redis')
const { getIO }              = require('../config/socket')

// GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const { source, skills } = req.query
    const cacheKey = `tasks:${source || 'all'}:${skills ? JSON.stringify(skills) : 'all'}`

    const cached = await cacheGet(cacheKey)
    if (cached) return res.json({ tasks: cached, cached: true })

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

    await cacheSet(cacheKey, tasks, 60)
    res.json({ tasks })
  } catch (e) { next(e) }
}

// GET /api/tasks/stats
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

    const usersWithSkills = await prisma.user.findMany({ select: { skills: true } })

    const trackCounts = { frontend: 0, backend: 0, mobile: 0, ai: 0, security: 0, games: 0, other: 0 }
    const trackMap    = {
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
        if (skills.some(s => keywords.some(k => s.includes(k)))) { trackCounts[track]++; assigned = true; break }
      }
      if (!assigned) trackCounts.other++
    })

    const io        = getIO()
    const onlineNow = io ? io.engine.clientsCount : 0
    const stats     = { totalUsers, totalTasks, totalProposals, onlineNow, tracks: trackCounts }

    await cacheSet(cacheKey, stats, 120)
    res.json(stats)
  } catch (e) { next(e) }
}

// GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const cacheKey = `task:${req.params.id}`
    const cached   = await cacheGet(cacheKey)
    if (cached) return res.json(cached)

    const task = await prisma.task.findUnique({ where: { id: req.params.id } })
    if (!task) return res.status(404).json({ message: 'Task not found' })

    await cacheSet(cacheKey, task, 300)
    res.json(task)
  } catch (e) { next(e) }
}

// POST /api/tasks/:id/save
exports.saveTask = async (req, res, next) => {
  try {
    await prisma.savedTask.upsert({
      where:  { userId_taskId: { userId: req.userId, taskId: req.params.id } },
      update: {},
      create: { userId: req.userId, taskId: req.params.id },
    })
    res.json({ message: 'Task saved' })
  } catch (e) { next(e) }
}

// GET /api/tasks/saved
exports.getSavedTasks = async (req, res, next) => {
  try {
    const saved = await prisma.savedTask.findMany({
      where:   { userId: req.userId },
      include: { task: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ tasks: saved.map(s => s.task), ids: saved.map(s => s.taskId) })
  } catch (e) { next(e) }
}

// DELETE /api/tasks/:id/save
exports.unsaveTask = async (req, res, next) => {
  try {
    await prisma.savedTask.deleteMany({
      where: { userId: req.userId, taskId: req.params.id },
    })
    res.json({ message: 'Task unsaved' })
  } catch (e) { next(e) }
}
