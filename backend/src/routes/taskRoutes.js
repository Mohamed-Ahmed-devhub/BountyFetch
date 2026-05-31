// ===================================================
<<<<<<< HEAD
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
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a

module.exports = router
