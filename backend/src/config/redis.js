// ===== إعداد Redis للـ Queue =====
// Redis هو قاعدة بيانات في الذاكرة تُستخدم لإدارة مهام الخلفية
// مثل: جدولة عمليات الـ Scraping كل X دقائق

import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // مطلوب لـ Bull Queue
  enableReadyCheck: false
})

redis.on('connect',    () => console.log('✅ متصل بـ Redis'))
redis.on('error', (err) => console.error('❌ خطأ في Redis:', err.message))

export default redis
