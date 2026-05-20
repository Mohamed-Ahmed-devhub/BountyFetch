// ===================================================
// taskRoutes.js — مسارات المهام
// المسار: backend/src/routes/taskRoutes.js
// ===================================================

const express        = require('express')
const router         = express.Router()
const taskController = require('../controllers/taskController')
const auth           = require('../middleware/authMiddleware')

router.use(auth) // كل المسارات تحتاج تسجيل دخول

router.get('/',           taskController.getTasks)
router.get('/:id',        taskController.getTaskById)
router.post('/:id/save',  taskController.saveTask)

module.exports = router
