// ===================================================
// TaskDetail.jsx - صفحة تفاصيل المهمة + البروبوزال
// ===================================================
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar.jsx'
import ProposalGenerator from '../components/proposal/ProposalGenerator.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { taskService } from '../services/taskService.js'

function TaskDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTaskById(id),
  })

  const task = data?.data

  if (isLoading) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh] text-brand-cyan animate-pulse">
          {t('common.loading')}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* زر الرجوع */}
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
          ← {t('common.back')}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* تفاصيل المهمة */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge color="cyan">{task?.source}</Badge>
              <span className="text-xs text-gray-500">{task?.postedAt}</span>
            </div>
            
            <h1 className="text-xl font-black text-white mb-4">{task?.title}</h1>
            <p className="text-gray-400 leading-relaxed mb-6">{task?.description}</p>
            
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">{t('radar.skills')}</p>
              <div className="flex flex-wrap gap-2">
                {task?.skills?.map(skill => (
                  <Badge key={skill} color="purple">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border">
              <p className="text-xs text-gray-500">{t('radar.budget')}</p>
              <p className="text-neon-green font-mono font-bold text-lg mt-1">
                {task?.budget || '---'}
              </p>
            </div>

            {/* رابط المصدر الأصلي */}
            {task?.url && (
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-brand-cyan hover:underline"
              >
                عرض المصدر الأصلي ↗
              </a>
            )}
          </div>

          {/* مولد البروبوزال */}
          <ProposalGenerator taskId={id} />
        </div>
      </div>
    </div>
  )
}

export default TaskDetail
