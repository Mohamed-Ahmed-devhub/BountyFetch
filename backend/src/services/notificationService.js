// notificationService.js — broadcasts new tasks to Socket.io rooms
const { broadcastTask } = require('../config/socket')

function notifyMatchingUsers(task) {
  if (!task?.skills?.length) return
  broadcastTask(task)
}
module.exports = { notifyMatchingUsers }
