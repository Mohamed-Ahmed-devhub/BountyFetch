// ===================================================
<<<<<<< HEAD
// redis.js — إعداد ذكي لـ Redis (يتخطى الاتصال إذا تم تعطيله)
// المسار: backend/src/config/redis.js
// ===================================================

const Redis = require('ioredis')

const REDIS_URL = process.env.REDIS_URL;

// فحص هل الـ Redis معطل فعلياً؟
const isRedisDisabled = !REDIS_URL || 
                        REDIS_URL === 'disabled' || 
                        REDIS_URL.trim() === '""' || 
                        REDIS_URL.trim() === "''";

let redis = null;
let redisSub = null;

if (!isRedisDisabled) {
  // تشغيل الـ Redis الفعلي لو المتغير موجود وشغال
  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect:          true,
      enableOfflineQueue:   false,
    })

    redisSub = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect:          true,
      enableOfflineQueue:   false,
    })

    redis.on('connect',  () => console.log('✅ Redis (cache) متصل'))
    redis.on('error',    (e) => console.error('❌ Redis (cache):', e.message))
    redisSub.on('connect', () => console.log('✅ Redis (sub) متصل'))
    redisSub.on('error',   (e) => console.error('❌ Redis (sub):', e.message))
  } catch (err) {
    console.error('❌ فشل تهيئة Redis:', err.message)
  }
} else {
  console.log('⚠️ Redis معطل برمجياً بالكامل — جاري تشغيل بيئة الكاش الوهمية المحمية')
  
  // دالة وهمية عشان الكود اللي بيستدعي redis ما يضربش تيب كراش
  const mockRedis = {
    on: () => {},
    get: async () => null,
    set: async () => 'OK',
    del: async () => 1
  };
  redis = mockRedis;
  redisSub = mockRedis;
}

// ── Helper: get or set with TTL ──
async function cacheGet(key) {
  if (isRedisDisabled) return null;
  try {
    const val = await redis.get(key)
    return val ? JSON.parse(val) : null
  } catch { return null }
}

async function cacheSet(key, value, ttlSeconds = 300) {
  if (isRedisDisabled) return;
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  } catch (e) {
    console.error('Redis cacheSet error:', e.message)
  }
}

async function cacheDel(key) {
  if (isRedisDisabled) return;
  try { await redis.del(key) } catch {}
}

module.exports = { redis, redisSub, cacheGet, cacheSet, cacheDel }
=======
// redis.js - إعداد اتصال Redis للـ Queue System
// ===================================================
const Redis = require('ioredis')

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

redis.on('connect', () => console.log('✅ متصل بـ Redis'))
redis.on('error',   (err) => console.error('❌ خطأ Redis:', err))

module.exports = redis
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
