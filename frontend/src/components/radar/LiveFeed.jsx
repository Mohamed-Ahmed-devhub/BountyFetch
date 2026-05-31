// ===================================================
// LiveFeed.jsx - قائمة المهام المباشرة في الرادار
// ===================================================
import React from 'react'
import { useTranslation } from 'react-i18next'
import TaskCard from './TaskCard.jsx'

function LiveFeed({ tasks = [], isLoading = false }) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {/* Skeleton Loading Placeholders */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-4 animate-pulse">
            <div className="h-3 bg-brand-border rounded w-1/4 mb-3"></div>
            <div className="h-4 bg-brand-border rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-brand-border rounded w-full mb-3"></div>
            <div className="h-8 bg-brand-border rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">📡</span>
        <p className="text-gray-400">{t('radar.no_tasks')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task, index) => (
        <TaskCard key={task.id} task={task} isNew={index === 0} />
      ))}
    </div>
  )
}

export default LiveFeed
