// rateLimiter.js — express-rate-limit replacement (no external dep required)
// Simple in-memory sliding window per IP address

function createLimiter({ windowMs, max, message }) {
  const store = new Map()

  setInterval(() => {
    const now = Date.now()
    for (const [key, data] of store.entries()) {
      if (now - data.start > windowMs) store.delete(key)
    }
  }, windowMs).unref()

  return function rateLimiter(req, res, next) {
    const ip  = req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown'
    const now = Date.now()
    let entry = store.get(ip)
    if (!entry || now - entry.start > windowMs) {
      entry = { count: 0, start: now }
      store.set(ip, entry)
    }
    entry.count++
    res.setHeader('X-RateLimit-Limit', max)
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count))
    if (entry.count > max) {
      return res.status(429).json(message)
    }
    next()
  }
}

const apiLimiter  = createLimiter({ windowMs: 15*60*1000, max: 200, message: { message: 'Too many requests, please try again later.' } })
const authLimiter = createLimiter({ windowMs: 15*60*1000, max: 20,  message: { message: 'Too many auth attempts, please wait before retrying.' } })
const aiLimiter   = createLimiter({ windowMs: 10*60*1000, max: 30,  message: { message: 'AI rate limit reached, please wait a few minutes.' } })

module.exports = { apiLimiter, authLimiter, aiLimiter }
