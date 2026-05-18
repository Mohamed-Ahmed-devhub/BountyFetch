// ===== صفحة تسجيل الدخول =====
// نموذج: البريد الإلكتروني + كلمة المرور
// بعد الدخول: يتم تخزين JWT token ويتم التوجيه للـ Dashboard
// TODO (الأسبوع 2): بناء النموذج وربطه بـ /api/auth/login

function Login() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="bg-dark-card p-8 rounded-xl w-full max-w-md border border-dark-border">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          تسجيل الدخول
        </h2>
        {/* TODO: إضافة النموذج هنا */}
        <p className="text-gray-500 text-center">قيد البناء...</p>
      </div>
    </div>
  )
}

export default Login
