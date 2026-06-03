// redis.js — smart Redis setup (skips connection if disabled)
const Redis = require('ioredis')

const REDIS_URL = process.env.REDIS_URL

const isRedisDisabled = !REDIS_URL ||
  REDIS_URL === 'disabled' ||
  REDIS_URL.trim() === '""' ||
  REDIS_URL.trim() === "''"

let redis    = null
let redisSub = null

if (!isRedisDisabled) {
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
    redis.on('connect',    () => console.log('✅ Redis (cache) connected'))
    redis.on('error',      (e) => console.error('❌ Redis (cache):', e.message))
    redisSub.on('connect', () => console.log('✅ Redis (sub) connected'))
    redisSub.on('error',   (e) => console.error('❌ Redis (sub):', e.message))
  } catch (err) {
    console.error('❌ Redis init failed:', err.message)
  }
} else {
  console.log('⚠️  Redis disabled — using in-memory cache mock')
  const mockRedis = {
    on:  () => {},
    get: async () => null,
    set: async () => 'OK',
    del: async () => 1,
  }
  redis    = mockRedis
  redisSub = mockRedis
}

async function cacheGet(key) {
  if (isRedisDisabled) return null
  try {
    const val = await redis.get(key)
    return val ? JSON.parse(val) : null
  } catch { return null }
}

async function cacheSet(key, value, ttlSeconds = 300) {
  if (isRedisDisabled) return
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  } catch (e) {
    console.error('Redis cacheSet error:', e.message)
  }
}

async function cacheDel(key) {
  if (isRedisDisabled) return
  try { await redis.del(key) } catch {}
}

module.exports = { redis, redisSub, cacheGet, cacheSet, cacheDel }
