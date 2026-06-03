// authMiddleware.js — verifies Supabase access tokens server-side
const { createClient } = require('@supabase/supabase-js')

// Fail fast at startup if env vars are missing rather than silently accepting all requests
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  authMiddleware: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — all auth requests will be rejected')
}

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
)

module.exports = async function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' })
  }

  const token = header.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token missing' })

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
    req.userId       = user.id
    req.supabaseUser = user
    next()
  } catch (e) {
    console.error('authMiddleware error:', e.message)
    res.status(401).json({ message: 'Token verification failed' })
  }
}
