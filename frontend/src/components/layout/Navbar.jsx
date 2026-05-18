// ===== شريط التنقل العلوي =====
// يظهر في كل صفحات التطبيق بعد تسجيل الدخول
// يحتوي: الشعار + روابط التنقل + زر تغيير اللغة + صورة المستخدم
// TODO (الأسبوع 4): ربط زر اللغة بـ LanguageContext لتبديل RTL/LTR

function Navbar() {
  return (
    <nav className="bg-dark-card border-b border-dark-border px-6 py-3 flex items-center justify-between">
      {/* الشعار */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎯</span>
        <span className="font-bold text-neon-cyan text-lg">صيّاد التاسكات</span>
      </div>

      {/* روابط التنقل */}
      <div className="flex items-center gap-6">
        <a href="/dashboard"   className="text-gray-400 hover:text-neon-cyan transition">الرادار</a>
        <a href="/code-shield" className="text-gray-400 hover:text-neon-cyan transition">درع الكود</a>
      </div>

      {/* زر اللغة + الملف الشخصي */}
      <div className="flex items-center gap-3">
        {/* TODO: ربط هذا الزر بـ LanguageContext */}
        <button className="text-sm border border-dark-border px-3 py-1 rounded-lg text-gray-400 hover:text-white hover:border-neon-purple transition">
          EN / ع
        </button>
        <div className="w-8 h-8 rounded-full bg-neon-purple/30 border border-neon-purple flex items-center justify-center text-sm">
          👤
        </div>
      </div>
    </nav>
  )
}

export default Navbar
