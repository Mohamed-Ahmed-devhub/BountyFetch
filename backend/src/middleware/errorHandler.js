// ===== Middleware معالجة الأخطاء العامة =====
// يمسك أي خطأ غير متوقع ويرسل رسالة منسقة للـ Frontend
// يُضاف في نهاية كل الـ Middleware في app.js

export function errorHandler(err, req, res, next) {
  // طباعة الخطأ في السيرفر للتشخيص
  console.error(`❌ خطأ: ${err.message}`)

  // تحديد كود الخطأ المناسب
  const statusCode = err.statusCode || 500
  const message = process.env.NODE_ENV === 'production'
    ? 'حدث خطأ في السيرفر'  // في الإنتاج: رسالة عامة آمنة
    : err.message             // في التطوير: الخطأ كاملاً

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}
