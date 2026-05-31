// ===================================================
<<<<<<< HEAD
// aiRoutes.js — مسارات الذكاء الاصطناعي
// المسار: backend/src/routes/aiRoutes.js
// ===================================================

const express      = require('express')
const router       = express.Router()
const aiController = require('../controllers/aiController')
const auth         = require('../middleware/authMiddleware')

router.use(auth)

router.post('/proposal', aiController.generateProposal)
router.post('/chat',     aiController.chat)
=======
// aiRoutes.js - مسارات الـ AI
// ===================================================
const express      = require('express')
const router       = express.Router()
const aiController = require('../controllers/aiController')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.post('/proposal', aiController.generateProposal) // POST /api/ai/proposal
router.post('/chat',     aiController.chat)             // POST /api/ai/chat
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a

module.exports = router
