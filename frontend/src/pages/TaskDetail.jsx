// ===== صفحة تفاصيل المهمة + مولد البروبوزال =====
// تعرض: تفاصيل المهمة المصطادة كاملة
// + زر "ولّد بروبوزال" الذي يستدعي Claude API
// + منطقة النص مع streaming للرد + زر نسخ
// TODO (الأسبوع 5): ربط AI Proposal Generator

import { useParams } from 'react-router-dom'

function TaskDetail() {
  // useParams: لجلب معرّف المهمة من عنوان URL مثل /task/123
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <h1 className="text-2xl font-bold text-neon-green">
        📋 تفاصيل المهمة #{id} — قيد البناء
      </h1>
    </div>
  )
}

export default TaskDetail
