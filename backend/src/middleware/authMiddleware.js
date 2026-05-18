// ===== Middleware التحقق من الهوية =====
// يتحقق من وجود وصحة الـ JWT token في كل طلب محمي
// إذا كان التوكن صحيح، يضيف بيانات المستخدم لـ req.user

import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
  // جلب الـ token من الـ Header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1] // نأخذ الجزء بعد "Bearer "

  if (!token) {
    return res.status(401).json({ message: 'لا يوجد token، سجّل دخولك أولاً' })
  }

  try {
    // التحقق من صحة الـ token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // إضافة بيانات المستخدم للطلب
    next() // متابعة للـ Controller التالي
  } catch (error) {
    return res.status(401).json({ message: 'الـ token غير صحيح أو منتهي الصلاحية' })
  }
}
