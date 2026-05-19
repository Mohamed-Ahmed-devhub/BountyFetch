// ===================================================
// socket.js - إعداد Socket.io للاتصال الفوري
// يرسل المهام الجديدة للمستخدمين المتصلين مباشرة
// ===================================================
const { Server } = require('socket.io')
const jwt        = require('jsonwebtoken')

let io = null

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin:      process.env.FRONTEND_URL,
      credentials: true,
    },
  })

  // التحقق من هوية المستخدم عند الاتصال
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error('التحقق من الهوية مطلوب'))

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.userId
      next()
    } catch {
      next(new Error('Token غير صالح'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`🟢 مستخدم متصل: ${socket.userId}`)
    
    // إضافة المستخدم لغرفة خاصة باسم الـ userId
    socket.join(`user:${socket.userId}`)

    socket.on('disconnect', () => {
      console.log(`🔴 مستخدم انقطع: ${socket.userId}`)
    })
  })

  return io
}

// دالة لإرسال مهمة لمستخدم محدد
function sendTaskToUser(userId, task) {
  if (io) {
    io.to(`user:${userId}`).emit('new_task', task)
  }
}

// دالة لإرسال مهمة لكل المستخدمين المتصلين
function broadcastTask(task) {
  if (io) {
    io.emit('new_task', task)
  }
}

module.exports = { initSocket, sendTaskToUser, broadcastTask }
