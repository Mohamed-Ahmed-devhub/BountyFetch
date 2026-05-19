// ===================================================
// taskRoutes.js - مسارات المهام
// ===================================================
const express        = require('express')
const router         = express.Router()
const taskController = require('../controllers/taskController')
const authMiddleware = require('../middleware/authMiddleware')

// كل مسارات المهام تحتاج تسجيل دخول
router.use(authMiddleware)

router.get('/',              taskController.getTasks)    // GET /api/tasks
router.get('/:id',           taskController.getTaskById) // GET /api/tasks/:id
router.post('/:id/save',     taskController.saveTask)    // POST /api/tasks/:id/save

module.exports = router
