const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/authMiddleware')
const ctrl    = require('../controllers/aiController')

router.post('/proposal', auth, ctrl.generateProposal)
router.post('/chat',     auth, ctrl.chat)

module.exports = router
