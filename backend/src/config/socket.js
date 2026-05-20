// ===================================================
// socket.js — إعداد Socket.io للاتصال الفوري
// يدير غرف المستخدمين ويرسل المهام الجديدة
// المسار: backend/src/config/socket.js
// ===================================================

const { Server } = require('socket.io')
const jwt        = require('jsonwebtoken')

let io = null

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
  })

  // التحقق من الـ Token عند كل اتصال
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error('مطلوب تسجيل الدخول'))
    try {
      const decoded  = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId  = decoded.userId
      next()
    } catch {
      next(new Error('Token غير صالح'))
    }
  })

  io.on('connection', (socket) => {
    // كل مستخدم له غرفة خاصة باسم userId
    socket.join(`user:${socket.userId}`)
    console.log(`🟢 Socket متصل: ${socket.userId}`)

    socket.on('disconnect', () => {
      console.log(`🔴 Socket انقطع: ${socket.userId}`)
    })
  })

  console.log('✅ Socket.io مهيأ')
  return io
}

// إرسال مهمة لمستخدم محدد
function sendTaskToUser(userId, task) {
  io?.to(`user:${userId}`).emit('new_task', task)
}

// إرسال مهمة لجميع المتصلين
function broadcastTask(task) {
  io?.emit('new_task', task)
}

module.exports = { initSocket, sendTaskToUser, broadcastTask }
