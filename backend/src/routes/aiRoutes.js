// ===================================================
// aiRoutes.js - مسارات الـ AI
// ===================================================
const express      = require('express')
const router       = express.Router()
const aiController = require('../controllers/aiController')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.post('/proposal', aiController.generateProposal) // POST /api/ai/proposal
router.post('/chat',     aiController.chat)             // POST /api/ai/chat

module.exports = router
