// ===== صفحة الهبوط الرئيسية =====
// أول ما يراه الزائر عند دخول الموقع
// المحتوى: شعار + وصف المشروع + زر البدء
// TODO (الأسبوع 7): إضافة أنيميشن Hero Section بـ Framer Motion

function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        {/* الشعار الرئيسي */}
        <h1 className="text-4xl font-bold text-neon-cyan mb-4">
          🎯 صيّاد التاسكات الذكي
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          اصطد مهامك البرمجية بالذكاء الاصطناعي
        </p>
        {/* TODO: ربط هذا الزر بـ /register */}
        <button className="bg-neon-purple text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition">
          ابدأ الصيد الآن 🚀
        </button>
      </div>
    </div>
  )
}

export default LandingPage
