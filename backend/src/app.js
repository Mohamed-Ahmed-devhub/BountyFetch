// ===================================================
<<<<<<< HEAD
// app.js — نقطة الدخول الرئيسية للـ Backend
// BountyFetch v3 — Production Ready
// المسار: backend/src/app.js
// ===================================================

require('dotenv').config()

const express = require('express')
const http    = require('http')
const cors    = require('cors')
=======
// app.js - نقطة الدخول الرئيسية للـ Backend
// يبدأ السيرفر، يربط الـ Socket.io، ويسجل الـ Routes
// ===================================================
require('dotenv').config()

const express  = require('express')
const http     = require('http')
const cors     = require('cors')
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a

const { initSocket }  = require('./config/socket')
const { connectDB }   = require('./config/database')
const { initQueues }  = require('./jobs/scrapingJob')
const errorHandler    = require('./middleware/errorHandler')

<<<<<<< HEAD
// Routes
const authRoutes    = require('./routes/authRoutes')
const taskRoutes    = require('./routes/taskRoutes')
const aiRoutes      = require('./routes/aiRoutes')
const supportRoutes = require('./routes/supportRoutes')
const chatRoutes    = require('./routes/chatRoutes')
=======
// استيراد الـ Routes
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
const aiRoutes   = require('./routes/aiRoutes')
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a

const app    = express()
const server = http.createServer(app)

<<<<<<< HEAD
// ── Middleware ──
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
// لا نضع express.json() قبل multer — multer يتعامل مع multipart
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Routes ──
app.use('/api/auth',    authRoutes)
app.use('/api/tasks',   taskRoutes)
app.use('/api/ai',      aiRoutes)
app.use('/api/support', supportRoutes)
app.use('/api/chat',    chatRoutes)

// Health check
app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', message: '◈ BountyFetch Backend يعمل', version: '3.0.0' })
)

// ── معالج الأخطاء (يجب أن يكون آخراً) ──
app.use(errorHandler)

// ── تشغيل السيرفر ──
=======
// --- Middleware ---
app.use(cors({
  origin:      process.env.FRONTEND_URL,
  credentials: true,
}))
app.use(express.json())

// --- Routes ---
app.use('/api/auth',  authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/ai',    aiRoutes)

// نقطة للتحقق أن السيرفر يعمل
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🎯 Task Bounty Agent يعمل!' })
})

// --- معالج الأخطاء (يجب أن يكون آخر middleware) ---
app.use(errorHandler)

// --- تشغيل السيرفر ---
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
const PORT = process.env.PORT || 3001

async function startServer() {
  try {
<<<<<<< HEAD
    await connectDB()
    initSocket(server)
    initQueues()
    server.listen(PORT, () => {
      console.log(`\n◈ BountyFetch Backend v3`)
      console.log(`  → http://localhost:${PORT}`)
      console.log(`  → WebSocket: جاهز مع Redis Adapter`)
      console.log(`  → Cache:     Redis`)
      console.log(`  → Queue:     جاهز\n`)
    })
  } catch (err) {
    console.error('❌ فشل تشغيل السيرفر:', err)
=======
    // الاتصال بقاعدة البيانات
    await connectDB()
    
    // تهيئة الـ Socket.io
    initSocket(server)
    
    // تشغيل مهام الـ Scraping في الخلفية
    initQueues()
    
    server.listen(PORT, () => {
      console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`)
      console.log(`📡 Socket.io جاهز للاتصالات`)
    })
  } catch (error) {
    console.error('❌ فشل تشغيل السيرفر:', error)
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
    process.exit(1)
  }
}

startServer()
