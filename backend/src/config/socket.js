// ===== إعداد Socket.io للتواصل Real-time =====
// يستخدم لإرسال المهام الجديدة للمستخدمين في اللحظة ذاتها

import { Server } from 'socket.io'

let io = null // المتغير العام لـ Socket.io instance

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log(`✅ مستخدم متصل: ${socket.id}`)

    // المستخدم يرسل مهاراته ليستقبل المهام المناسبة فقط
    socket.on('register_skills', (skills) => {
      // نضع المستخدم في "غرفة" باسم مهاراته
      skills.forEach(skill => socket.join(`skill:${skill}`))
      console.log(`👤 ${socket.id} سجّل مهاراته: ${skills.join(', ')}`)
    })

    socket.on('disconnect', () => {
      console.log(`❌ مستخدم انقطع: ${socket.id}`)
    })
  })

  return io
}

// دالة لإرسال مهمة جديدة لكل المهتمين بمهارة معينة
export function emitNewTask(skill, task) {
  if (io) {
    io.to(`skill:${skill}`).emit('new_task', task)
  }
}

export { io }
