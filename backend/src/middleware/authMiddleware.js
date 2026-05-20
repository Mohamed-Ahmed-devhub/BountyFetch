// ===================================================
// authMiddleware.js — التحقق من JWT
// يُضاف على أي Route يحتاج تسجيل دخول
// المسار: backend/src/middleware/authMiddleware.js
// ===================================================

const jwt = require('jsonwebtoken')

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ message: 'تسجيل الدخول مطلوب' })

  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    req.userId    = decoded.userId
    next()
  } catch {
    res.status(401).json({ message: 'Token غير صالح أو منتهٍ' })
  }
}
