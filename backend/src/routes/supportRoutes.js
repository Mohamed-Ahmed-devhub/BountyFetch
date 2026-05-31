// ===================================================
// supportRoutes.js — مسارات الدعم الفني
// المسار: backend/src/routes/supportRoutes.js
// ===================================================

const express           = require('express')
const router            = express.Router()
const supportController = require('../controllers/supportController')
const auth              = require('../middleware/authMiddleware')

router.use(auth)

router.post('/',     supportController.createTicket)
router.get('/mine',  supportController.getUserTickets)

module.exports = router
