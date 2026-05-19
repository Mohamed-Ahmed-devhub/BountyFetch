// ===================================================
// app.js - نقطة الدخول الرئيسية للـ Backend
// يبدأ السيرفر، يربط الـ Socket.io، ويسجل الـ Routes
// ===================================================
require('dotenv').config()

const express  = require('express')
const http     = require('http')
const cors     = require('cors')

const { initSocket }  = require('./config/socket')
const { connectDB }   = require('./config/database')
const { initQueues }  = require('./jobs/scrapingJob')
const errorHandler    = require('./middleware/errorHandler')

// استيراد الـ Routes
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
const aiRoutes   = require('./routes/aiRoutes')

const app    = express()
const server = http.createServer(app)

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
const PORT = process.env.PORT || 3001

async function startServer() {
  try {
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
    process.exit(1)
  }
}

startServer()
