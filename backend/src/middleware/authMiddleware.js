<<<<<<< HEAD
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
=======
// ===================================================
// authMiddleware.js - التحقق من هوية المستخدم
// يُضاف على أي Route يحتاج تسجيل دخول
// ===================================================
const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'تسجيل الدخول مطلوب' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId // إتاحة الـ userId في كل Controllers
    next()
  } catch {
    return res.status(401).json({ message: 'Token غير صالح أو منتهي الصلاحية' })
  }
}

module.exports = authMiddleware
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
