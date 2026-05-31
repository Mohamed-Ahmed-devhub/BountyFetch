// ===================================================
// taskRoutes.js — مسارات المهام + الإحصائيات
// المسار: backend/src/routes/taskRoutes.js
// ===================================================

const express        = require('express')
const router         = express.Router()
const taskController = require('../controllers/taskController')
const auth           = require('../middleware/authMiddleware')

// الإحصائيات — لا تحتاج auth (عامة)
router.get('/stats', taskController.getStats)

// باقي المسارات تحتاج تسجيل دخول
router.use(auth)

router.get('/',           taskController.getTasks)
router.get('/:id',        taskController.getTaskById)
router.post('/:id/save',  taskController.saveTask)

module.exports = router
