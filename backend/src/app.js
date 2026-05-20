// ===================================================
// app.js — نقطة الدخول الرئيسية للـ Backend
// يهيئ السيرفر، قاعدة البيانات، Socket.io، والـ Queue
// المسار: backend/src/app.js
// ===================================================

require('dotenv').config()

const express = require('express')
const http    = require('http')
const cors    = require('cors')

const { initSocket }  = require('./config/socket')
const { connectDB }   = require('./config/database')
const { initQueues }  = require('./jobs/scrapingJob')
const errorHandler    = require('./middleware/errorHandler')

// Routes
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
const aiRoutes   = require('./routes/aiRoutes')

const app    = express()
const server = http.createServer(app)

// ── Middleware ──
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '2mb' }))

// ── Routes ──
app.use('/api/auth',  authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/ai',    aiRoutes)

// Health check
app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', message: '◈ BountyFetch Backend يعمل' })
)

// ── معالج الأخطاء (يجب أن يكون آخراً) ──
app.use(errorHandler)

// ── تشغيل السيرفر ──
const PORT = process.env.PORT || 3001

async function startServer() {
  try {
    await connectDB()
    initSocket(server)
    initQueues()
    server.listen(PORT, () => {
      console.log(`\n◈ BountyFetch Backend`)
      console.log(`  → http://localhost:${PORT}`)
      console.log(`  → WebSocket: جاهز`)
      console.log(`  → Queue:     جاهز\n`)
    })
  } catch (err) {
    console.error('❌ فشل تشغيل السيرفر:', err)
    process.exit(1)
  }
}

startServer()
