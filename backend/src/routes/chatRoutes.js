// ===================================================
// chatRoutes.js — جلب سجل رسائل الغرف
// المسار: backend/src/routes/chatRoutes.js
// ===================================================

const express   = require('express')
const router    = express.Router()
const { prisma} = require('../config/database')
const auth      = require('../middleware/authMiddleware')

// GET /api/chat/:room?limit=50
router.get('/:room', auth, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100)
    const messages = await prisma.chatMessage.findMany({
      where:   { room: req.params.room },
      orderBy: { createdAt: 'asc' },
      take:    limit,
    })
    res.json({ messages })
  } catch (e) { next(e) }
})

module.exports = router
