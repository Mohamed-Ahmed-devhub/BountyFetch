// ===================================================
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

module.exports = router
