// ===================================================
<<<<<<< HEAD
// errorHandler.js — معالج الأخطاء المركزي
// المسار: backend/src/middleware/errorHandler.js
// ===================================================

module.exports = function errorHandler(err, req, res, next) {
  console.error('❌', err.message)
  const status = err.statusCode || 500
  res.status(status).json({
    success: false,
    message: err.message || 'خطأ داخلي في السيرفر',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
=======
// errorHandler.js - معالج الأخطاء المركزي
// يمسك أي خطأ غير متوقع ويرد برسالة منظمة
// ===================================================
function errorHandler(err, req, res, next) {
  console.error('❌ خطأ غير متوقع:', err.message)

  const statusCode = err.statusCode || 500
  const message    = err.message    || 'حدث خطأ داخلي في السيرفر'

  res.status(statusCode).json({
    success: false,
    message,
    // في بيئة الإنتاج، لا نُظهر تفاصيل الخطأ للمستخدم
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorHandler
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
