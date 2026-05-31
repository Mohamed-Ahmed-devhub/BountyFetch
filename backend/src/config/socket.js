// ===================================================
// socket.js — Pillar 1: Production WebSockets + Optional Redis
//              Pillar 2: Real-time active counters
// المسار: backend/src/config/socket.js
// ===================================================

const { Server }         = require('socket.io')
const { createAdapter }  = require('@socket.io/redis-adapter')
const { prisma }         = require('./database')
const { redis, redisSub } = require('./redis')

let io = null

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  })

  // ── فحص ذكي: لو الـ Redis مفعل ومش فاضي ولا disabled شغل الـ Adapter ──
  const isRedisEnabled = process.env.REDIS_URL && 
                         process.env.REDIS_URL !== 'disabled' && 
                         process.env.REDIS_URL.trim() !== '""' && 
                         process.env.REDIS_URL.trim() !== "''";

  if (isRedisEnabled) {
    try {
      io.adapter(createAdapter(redis, redisSub))
      console.log('✅ Socket.io Redis Adapter مفعّل')
    } catch (e) {
      console.warn('⚠️ Redis Adapter فشل في التشغيل — يعمل بدونه موقتاً:', e.message)
    }
  } else {
    console.log('⚠️ Redis معطل في الـ .env — يعمل في الوضع المحلي السلس وبدون كراش')
  }

  // ── Auth Middleware ──
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (token) {
      try {
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString()
        )
        socket.userId   = payload.sub || payload.userId || 'anon'
        socket.userName = payload.user_metadata?.full_name
                       || payload.email?.split('@')[0]
                       || 'مطوّر'
        socket.userAvatar = payload.user_metadata?.avatar_url || null
      } catch {
        socket.userId   = `anon_${Date.now()}`
        socket.userName = 'مطوّر'
        socket.userAvatar = null
      }
    } else {
      socket.userId   = `anon_${Date.now()}`
      socket.userName = 'زائر'
      socket.userAvatar = null
    }
    next()
  })

  io.on('connection', (socket) => {
    console.log(`🟢 Socket: ${socket.userId}`)
    socket.join(`user:${socket.userId}`)
    broadcastOnlineCount()

    socket.on('join_room', (room) => {
      socket.rooms.forEach(r => {
        if (r !== socket.id && r !== `user:${socket.userId}`) {
          socket.leave(r)
        }
      })
      socket.join(`room:${room}`)
      socket.currentRoom = room
      console.log(`📍 ${socket.userId} انضم لـ room:${room}`)
    })

    socket.on('send_message', async (data) => {
      const { room, content } = data
      if (!content?.trim() || !room) return

      try {
        const msg = await prisma.chatMessage.create({
          data: {
            room,
            userId:     socket.userId,
            userName:   socket.userName,
            userAvatar: socket.userAvatar,
            content:    content.trim(),
          },
        })

        io.to(`room:${room}`).emit('new_message', {
          id:         msg.id,
          room:       msg.room,
          userId:     msg.userId,
          userName:   msg.userName,
          userAvatar: msg.userAvatar,
          content:    msg.content,
          createdAt:  msg.createdAt,
        })
      } catch (e) {
        console.error('❌ حفظ رسالة:', e.message)
        socket.emit('message_error', { error: 'فشل إرسال الرسالة' })
      }
    })

    socket.on('disconnect', () => {
      console.log(`🔴 Socket: ${socket.userId}`)
      broadcastOnlineCount()
    })
  })

  console.log('✅ Socket.io مهيأ بالكامل')
  return io
}

function broadcastOnlineCount() {
  if (!io) return
  const count = io.engine.clientsCount
  io.emit('online_count', { count })
}

function sendTaskToUser(userId, task) {
  io?.to(`user:${userId}`).emit('new_task', task)
}

function broadcastTask(task) {
  io?.emit('new_task', task)
}

function getIO() { return io }

module.exports = { initSocket, sendTaskToUser, broadcastTask, broadcastOnlineCount, getIO }