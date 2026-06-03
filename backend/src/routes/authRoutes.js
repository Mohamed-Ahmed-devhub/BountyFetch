const express  = require('express')
const router   = express.Router()
const auth     = require('../middleware/authMiddleware')
const ctrl     = require('../controllers/authController')
const { validators } = require('../middleware/validate')

// POST /api/auth/supabase-sync — called on SIGNED_IN event
router.post('/supabase-sync', validators.syncToken, ctrl.supabaseSync)

// Profile (protected)
router.get('/profile',          auth, ctrl.getProfile)
router.put('/profile',          auth, validators.updateProfile, ctrl.updateProfile)
router.put('/skills',           auth, validators.updateSkills,  ctrl.updateSkills)
router.post('/avatar',          auth, ctrl.uploadMiddleware, ctrl.uploadAvatar)

module.exports = router
