// ===================================================
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
