// ===== مولد البروبوزال بالـ AI =====
// يستدعي Claude API لتوليد نص احترافي مخصص للمهمة
// taskData: بيانات المهمة | userProfile: مهارات المستخدم
// TODO (الأسبوع 5): ربط Claude API مع streaming

function ProposalGenerator({ taskData, userProfile }) {
  return (
    <div className="bg-dark-card border border-neon-purple/30 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-neon-purple mb-4">✍️ مولد البروبوزال الذكي</h3>
      <div className="flex gap-3 mb-4">
        {/* TODO: ربط هذين الزرين بـ AI API */}
        <button className="flex-1 text-sm border border-neon-cyan text-neon-cyan px-4 py-2 rounded-lg hover:bg-neon-cyan hover:text-dark-bg transition">
          🇸🇦 بالعربية
        </button>
        <button className="flex-1 text-sm border border-neon-purple text-neon-purple px-4 py-2 rounded-lg hover:bg-neon-purple hover:text-white transition">
          🇺🇸 In English
        </button>
      </div>
      <div className="bg-dark-bg rounded-lg p-3 min-h-24 text-gray-500 text-sm">
        اضغط على أحد الزرين لتوليد البروبوزال...
      </div>
    </div>
  )
}

export default ProposalGenerator
