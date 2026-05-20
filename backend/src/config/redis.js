// ===================================================
// redis.js — إعداد Redis للـ Queue System
// المسار: backend/src/config/redis.js
// ===================================================

const Redis = require('ioredis')

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
})

redis.on('connect', () => console.log('✅ Redis متصل'))
redis.on('error',   (e) => console.error('❌ Redis:', e.message))

module.exports = redis
