// authMiddleware.js — verifies Supabase JWT tokens
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' })
  }

  const token = header.split(' ')[1]

  try {
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
    req.userId      = user.id
    req.supabaseUser = user
    next()
  } catch {
    res.status(401).json({ message: 'Token verification failed' })
  }
}
