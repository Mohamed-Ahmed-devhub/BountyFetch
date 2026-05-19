// ===================================================
// redis.js - إعداد اتصال Redis للـ Queue System
// ===================================================
const Redis = require('ioredis')

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

redis.on('connect', () => console.log('✅ متصل بـ Redis'))
redis.on('error',   (err) => console.error('❌ خطأ Redis:', err))

module.exports = redis
