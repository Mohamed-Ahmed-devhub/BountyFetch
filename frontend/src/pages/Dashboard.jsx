// ===== لوحة التحكم الرئيسية - الرادار =====
// هذه الصفحة هي قلب التطبيق
// المحتوى: شريط المعلومات العلوي + فلاتر المهارات + Feed المهام live
// TODO (الأسبوع 3): ربط Socket.io لعرض المهام في الوقت الفعلي

function Dashboard() {
  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <h1 className="text-2xl font-bold text-neon-cyan">
        📡 رادار المهام — قيد البناء
      </h1>
      <p className="text-gray-500 mt-2">سيتم ربط المهام الحية هنا في الأسبوع الثالث</p>
    </div>
  )
}

export default Dashboard
