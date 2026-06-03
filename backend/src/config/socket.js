// socket.js — WebSockets + optional Redis adapter + real-time counters
const { Server }        = require('socket.io')
const { createAdapter } = require('@socket.io/redis-adapter')
const { redis, redisSub } = require('./redis')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
let io = null

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  })

  const isRedisEnabled = process.env.REDIS_URL &&
    process.env.REDIS_URL !== 'disabled' &&
    process.env.REDIS_URL.trim() !== '""' &&
    process.env.REDIS_URL.trim() !== "''"

  if (isRedisEnabled) {
    try {
      io.adapter(createAdapter(redis, redisSub))
      console.log('✅ Socket.io Redis Adapter enabled')
    } catch (e) {
      console.warn('⚠️  Redis Adapter failed — running without it:', e.message)
    }
  } else {
    console.log('ℹ️  Socket.io running in single-node mode (no Redis)')
  }

  // Auth middleware — decode JWT payload without verification (verification is on HTTP routes)
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
        socket.userId     = payload.sub || payload.userId || 'anon'
        socket.userName   = payload.user_metadata?.full_name || payload.email?.split('@')[0] || 'Dev'
        socket.userAvatar = payload.user_metadata?.avatar_url || null
      } catch {
        socket.userId = `anon_${Date.now()}`; socket.userName = 'Dev'; socket.userAvatar = null
      }
    } else {
      socket.userId = `anon_${Date.now()}`; socket.userName = 'Guest'; socket.userAvatar = null
    }
    next()
  })

  io.on('connection', (socket) => {
    socket.join(`user:${socket.userId}`)
    broadcastOnlineCount()

    socket.on('join_room', (room) => {
      socket.rooms.forEach(r => {
        if (r !== socket.id && r !== `user:${socket.userId}`) socket.leave(r)
      })
      socket.join(`room:${room}`)
      socket.currentRoom = room
    })

    socket.on('send_message', async (data) => {
      const { room, content } = data
      if (!content?.trim() || !room) return
      try {
        const msg = await prisma.chatMessage.create({
          data: { room, userId: socket.userId, userName: socket.userName, userAvatar: socket.userAvatar, content: content.trim() },
        })
        io.to(`room:${room}`).emit('new_message', {
          id: msg.id, room: msg.room, userId: msg.userId, userName: msg.userName,
          userAvatar: msg.userAvatar, content: msg.content, createdAt: msg.createdAt,
        })
      } catch (e) {
        console.error('Chat message save error:', e.message)
        socket.emit('message_error', { error: 'Message send failed' })
      }
    })

    socket.on('disconnect', () => { broadcastOnlineCount() })
  })

  console.log('✅ Socket.io initialised')
  return io
}

function broadcastOnlineCount() {
  if (!io) return
  io.emit('online_count', { count: io.engine.clientsCount })
}

function broadcastTask(task) { io?.emit('new_task', task) }
function sendTaskToUser(userId, task) { io?.to(`user:${userId}`).emit('new_task', task) }
function getIO() { return io }

module.exports = { initSocket, sendTaskToUser, broadcastTask, broadcastOnlineCount, getIO }
