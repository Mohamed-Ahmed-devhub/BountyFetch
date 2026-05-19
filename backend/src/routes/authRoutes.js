// ===================================================
// authRoutes.js - مسارات التسجيل والدخول
// ===================================================
const express        = require('express')
const router         = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', authController.register)  // POST /api/auth/register
router.post('/login',    authController.login)     // POST /api/auth/login
router.get('/profile',   authMiddleware, authController.getProfile) // يحتاج token
router.put('/skills',    authMiddleware, authController.updateSkills)

module.exports = router
