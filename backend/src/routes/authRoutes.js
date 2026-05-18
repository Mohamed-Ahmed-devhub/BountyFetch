// ===== مسارات المصادقة =====
// POST /api/auth/register → إنشاء حساب جديد
// POST /api/auth/login    → تسجيل الدخول والحصول على token
// GET  /api/auth/me       → جلب بيانات المستخدم الحالي

import { Router } from 'express'
import { register, login, getMe } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/register', register)         // عام - لا يحتاج token
router.post('/login',    login)            // عام - لا يحتاج token
router.get('/me',        authMiddleware, getMe) // محمي - يحتاج token

export default router
