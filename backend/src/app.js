// app.js — BountyFetch v3 — Backend Entry Point
require('dotenv').config()

const express  = require('express')
const http     = require('http')
const cors     = require('cors')

const { initSocket }  = require('./config/socket')
const { connectDB }   = require('./config/database')
const { initQueues }  = require('./jobs/scrapingJob')
const errorHandler    = require('./middleware/errorHandler')
const { apiLimiter, authLimiter, aiLimiter } = require('./middleware/rateLimiter')

// Routes
const authRoutes    = require('./routes/authRoutes')
const taskRoutes    = require('./routes/taskRoutes')
const aiRoutes      = require('./routes/aiRoutes')
const supportRoutes = require('./routes/supportRoutes')
const chatRoutes    = require('./routes/chatRoutes')

const app    = express()
const server = http.createServer(app)

// ── Security headers (manual — no external dep) ──
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

// ── CORS ──
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// ── Body parsing ──
// Note: express.json() comes BEFORE multer routes handle multipart
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Global rate limiter ──
app.use('/api', apiLimiter)

// ── Routes ──
app.use('/api/auth',    authLimiter, authRoutes)
app.use('/api/tasks',   taskRoutes)
app.use('/api/ai',      aiLimiter, aiRoutes)
app.use('/api/support', supportRoutes)
app.use('/api/chat',    chatRoutes)

// Health check
app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', message: '◈ BountyFetch Backend is running', version: '3.0.0' })
)

// ── Error handler (must be last) ──
app.use(errorHandler)

// ── Start server ──
const PORT = process.env.PORT || 3001

async function startServer() {
  try {
    await connectDB()
    initSocket(server)
    initQueues()
    server.listen(PORT, () => {
      console.log(`\n◈ BountyFetch Backend v3`)
      console.log(`  → http://localhost:${PORT}`)
      console.log(`  → WebSocket: ready`)
      console.log(`  → Redis:     ${process.env.REDIS_URL ? 'connected' : 'mock (disabled)'}`)
      console.log(`  → Queue:     running\n`)
    })
  } catch (err) {
    console.error('❌ Server startup failed:', err)
    process.exit(1)
  }
}

startServer()
