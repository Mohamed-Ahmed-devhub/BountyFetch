// ===== مكوّن التغذية الحية للمهام =====
// يستقبل المهام من Socket.io ويعرضها بأنيميشن فور وصولها
// TODO (الأسبوع 3): ربط useSocket hook لاستقبال المهام real-time

import TaskCard from './TaskCard.jsx'

// بيانات وهمية مؤقتة لاختبار الواجهة قبل ربط الـ Backend
const MOCK_TASKS = [
  { id: 1, title: 'تصحيح مشكلة Responsive في صفحة رئيسية', budget: '$25', source: 'Telegram', description: 'الموقع لا يظهر بشكل صحيح على الجوال' },
  { id: 2, title: 'إضافة Dark Mode لموقع React', budget: '$40', source: 'Reddit', description: 'أحتاج إضافة وضع مظلم لتطبيق React موجود' },
  { id: 3, title: 'تعديل CSS لصفحة تسجيل دخول', budget: '$15', source: 'Twitter', description: 'تحسين شكل الأزرار والحقول في صفحة Login' },
]

function LiveFeed() {
  return (
    <div className="flex flex-col gap-3">
      {/* مؤشر الاتصال الحي */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
        <span className="text-xs text-gray-500">مباشر — {MOCK_TASKS.length} مهام مصطادة</span>
      </div>

      {/* قائمة المهام - حالياً بيانات وهمية */}
      {MOCK_TASKS.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}

export default LiveFeed
