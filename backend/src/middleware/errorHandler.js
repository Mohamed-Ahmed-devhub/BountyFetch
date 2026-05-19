// ===================================================
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
