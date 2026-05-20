// ===================================================
// authRoutes.js — مسارات المصادقة
// المسار: backend/src/routes/authRoutes.js
// ===================================================

const express        = require('express')
const router         = express.Router()
const authController = require('../controllers/authController')
const auth           = require('../middleware/authMiddleware')

router.post('/register',      authController.register)
router.post('/login',         authController.login)
router.get('/profile',  auth, authController.getProfile)
router.put('/skills',   auth, authController.updateSkills)

module.exports = router
