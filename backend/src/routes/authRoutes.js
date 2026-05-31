// ===================================================
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

module.exports = router
