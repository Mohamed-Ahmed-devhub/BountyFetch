const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/authMiddleware')
const ctrl    = require('../controllers/taskController')

router.get('/',            ctrl.getTasks)
router.get('/stats',       ctrl.getStats)
router.get('/saved',       auth, ctrl.getSavedTasks)
router.get('/:id',         ctrl.getTaskById)
router.post('/:id/save',   auth, ctrl.saveTask)
router.delete('/:id/save', auth, ctrl.unsaveTask)

module.exports = router
