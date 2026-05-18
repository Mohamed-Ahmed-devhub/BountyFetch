// ===== نقطة الدخول الرئيسية للـ Backend =====
// يقوم بتهيئة: Express + Socket.io + الـ Routes + الـ Middleware

import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import dotenv from 'dotenv'

// تحميل المتغيرات البيئية من ملف .env
dotenv.config()

// استيراد الـ Routes
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import aiRoutes   from './routes/aiRoutes.js'

// استيراد إعداد Socket.io
import { initSocket } from './config/socket.js'

// إنشاء تطبيق Express
const app = express()

// === Middleware العام ===

// السماح للـ Frontend بالتواصل مع الـ Backend (CORS)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// قراءة JSON في جسم الطلبات
app.use(express.json())

// === الـ Routes ===
app.use('/api/auth',  authRoutes)  // تسجيل الدخول والتسجيل
app.use('/api/tasks', taskRoutes)  // جلب وإدارة المهام
app.use('/api/ai',    aiRoutes)    // توليد البروبوزال والشات بوت

// نقطة اختبار بسيطة للتأكد من أن السيرفر يعمل
app.get('/health', (req, res) => {
  res.json({ status: '✅ السيرفر يعمل بنجاح', timestamp: new Date().toISOString() })
})

// === إنشاء HTTP Server وربطه بـ Socket.io ===
const httpServer = createServer(app)
initSocket(httpServer) // تهيئة الـ real-time

// === تشغيل السيرفر ===
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`)
  console.log(`🔗 http://localhost:${PORT}`)
})

export default app
