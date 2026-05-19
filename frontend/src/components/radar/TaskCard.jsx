// ===================================================
// TaskCard.jsx - بطاقة عرض المهمة في الرادار
// تُعرض في الـ Feed وتحتوي على معلومات المهمة
// ===================================================
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'

// sourceColors: لون مختلف لكل مصدر بيانات
const SOURCE_COLORS = {
  telegram: 'cyan',
  reddit:   'purple',
  twitter:  'yellow',
  rss:      'green',
}

function TaskCard({ task, isNew = false }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    // أنيميشن الظهور عند إضافة مهمة جديدة
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        glass-card p-4 cursor-pointer
        hover:border-brand-cyan/50 transition-all
        ${isNew ? 'border border-neon-green/50 shadow-[0_0_15px_rgba(0,255,136,0.1)]' : ''}
      `}
      onClick={() => navigate(`/task/${task.id}`)}
    >
      {/* رأس البطاقة: المصدر + الوقت */}
      <div className="flex items-center justify-between mb-2">
        <Badge color={SOURCE_COLORS[task.source] || 'cyan'}>
          {task.source}
        </Badge>
        <span className="text-xs text-gray-500">{task.postedAt}</span>
      </div>

      {/* عنوان المهمة */}
      <h3 className="font-semibold text-white mb-2 leading-snug line-clamp-2">
        {task.title}
      </h3>

      {/* وصف مختصر */}
      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* المهارات المطلوبة */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {task.skills?.map((skill) => (
          <Badge key={skill} color="purple">{skill}</Badge>
        ))}
      </div>

      {/* تذييل البطاقة: الميزانية + زر الاصطياد */}
      <div className="flex items-center justify-between">
        <span className="text-neon-green font-mono font-bold text-sm">
          {task.budget || '---'}
        </span>
        <Button variant="secondary" size="sm" onClick={(e) => {
          e.stopPropagation() // منع فتح صفحة التفاصيل
          navigate(`/task/${task.id}`)
        }}>
          🎯 {t('radar.hunt_btn')}
        </Button>
      </div>
    </motion.div>
  )
}

export default TaskCard
