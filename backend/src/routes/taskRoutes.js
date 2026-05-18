// ===== مسارات المهام =====
// GET /api/tasks        → جلب قائمة المهام مع فلاتر اختيارية
// GET /api/tasks/:id    → جلب تفاصيل مهمة واحدة

import { Router } from 'express'
import { getTasks, getTaskById } from '../controllers/taskController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

// كل مسارات المهام محمية وتحتاج token
router.use(authMiddleware)

router.get('/',    getTasks)      // GET /api/tasks?skill=CSS&source=telegram
router.get('/:id', getTaskById)   // GET /api/tasks/123

export default router
