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
