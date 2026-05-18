// ===== الشريط الجانبي =====
// يظهر في لوحة التحكم لعرض فلاتر المهارات والمصادر
// TODO (الأسبوع 3): ربط الفلاتر بحالة التطبيق لتصفية المهام

function Sidebar() {
  return (
    <aside className="w-64 bg-dark-card border-e border-dark-border h-screen p-4 flex flex-col gap-4">
      {/* قسم الفلاتر */}
      <div>
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">فلترة حسب المهارة</h3>
        {/* TODO: قائمة ديناميكية من مهارات المستخدم */}
        <p className="text-gray-600 text-sm">قيد البناء...</p>
      </div>

      {/* قسم المصادر */}
      <div>
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">المصادر</h3>
        {/* TODO: مصادر البيانات (Telegram, Reddit, Twitter) */}
        <p className="text-gray-600 text-sm">قيد البناء...</p>
      </div>
    </aside>
  )
}

export default Sidebar
