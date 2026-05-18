// ===== بطاقة المهمة الواحدة في الرادار =====
// تعرض: عنوان المهمة، المصدر، التقدير المالي، زر "اصطد"
// task: كائن يحتوي على بيانات المهمة من الـ API

function TaskCard({ task }) {
  return (
    <div className="bg-dark-card border border-dark-border hover:border-neon-cyan/50 rounded-xl p-4 transition-all duration-300 animate-slide-in">
      {/* TODO: استبدال البيانات الوهمية ببيانات task الحقيقية */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white text-sm leading-relaxed">
          {task?.title || 'عنوان المهمة سيظهر هنا'}
        </h3>
        <span className="text-neon-green text-sm font-bold whitespace-nowrap ms-2">
          {task?.budget || '$0'}
        </span>
      </div>

      <p className="text-gray-500 text-xs mb-3 line-clamp-2">
        {task?.description || 'وصف المهمة...'}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">📡 {task?.source || 'مصدر غير معروف'}</span>
        {/* TODO: ربط هذا الزر بصفحة التفاصيل /task/:id */}
        <button className="text-xs bg-neon-purple/20 text-neon-purple border border-neon-purple/30 px-3 py-1 rounded-lg hover:bg-neon-purple hover:text-white transition">
          🎯 اصطد
        </button>
      </div>
    </div>
  )
}

export default TaskCard
