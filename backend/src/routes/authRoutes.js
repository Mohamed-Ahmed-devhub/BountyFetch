// ===================================================
<<<<<<< HEAD
// authRoutes.js — مسارات المصادقة والملف الشخصي
// المسار: backend/src/routes/authRoutes.js
// ===================================================

const express        = require('express')
const router         = express.Router()
const authController = require('../controllers/authController')
const auth           = require('../middleware/authMiddleware')

// ── Public ──
router.post('/supabase-sync', authController.supabaseSync)

// ── Protected ──
router.get('/profile',                auth, authController.getProfile)
router.put('/profile',                auth, authController.updateProfile)
router.put('/skills',                 auth, authController.updateSkills)
router.post('/avatar', auth, authController.uploadMiddleware, authController.uploadAvatar)
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a

module.exports = router
