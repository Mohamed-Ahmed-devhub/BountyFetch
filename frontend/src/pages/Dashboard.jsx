// ===================================================
// Dashboard.jsx - صفحة الرادار الرئيسية
// قلب التطبيق: عرض المهام المباشرة والفلترة
// ===================================================
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../components/layout/Navbar.jsx'
import LiveFeed from '../components/radar/LiveFeed.jsx'
import FilterPanel from '../components/radar/FilterPanel.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import { taskService } from '../services/taskService.js'
import { useSocket } from '../hooks/useSocket.js'
import { useNotifications } from '../hooks/useNotifications.js'

function Dashboard() {
  const { t } = useTranslation()
  const [activeSource, setActiveSource]     = useState('all')
  const [selectedSkills, setSelectedSkills] = useState([])
  
  // الاتصال بالـ WebSocket لاستقبال المهام الجديدة
  const { isConnected, newTasks } = useSocket()
  const { requestPermission, sendNotification } = useNotifications()

  // طلب إذن الإشعارات عند فتح الصفحة
  useEffect(() => { requestPermission() }, [])

  // إرسال إشعار عند ظهور مهام جديدة
  useEffect(() => {
    newTasks.forEach(task => sendNotification(task))
  }, [newTasks])

  // جلب المهام من الـ Backend
  const { data, isLoading } = useQuery({
    queryKey: ['tasks', activeSource, selectedSkills],
    queryFn: () => taskService.getTasks({ source: activeSource, skills: selectedSkills }),
    refetchInterval: 30000, // تحديث كل 30 ثانية كـ backup للـ WebSocket
  })

  // دمج المهام الجديدة من الـ WebSocket مع القديمة
  const allTasks = [...(newTasks || []), ...(data?.data?.tasks || [])]

  // تبديل اختيار المهارة
  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* الشريط الجانبي للفلترة */}
        <Sidebar selectedSkills={selectedSkills} onSkillToggle={handleSkillToggle} />
        
        {/* المنطقة الرئيسية */}
        <main className="flex-1 overflow-y-auto p-6">
          
          {/* رأس الرادار */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-white">
                📡 {t('radar.title')}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`live-dot ${isConnected ? '' : 'bg-neon-red!'}`}></span>
                <span className="text-xs text-gray-400">
                  {isConnected ? t('radar.live') : 'غير متصل'}
                </span>
                <span className="text-xs text-gray-600">•</span>
                <span className="text-xs text-gray-400">
                  {allTasks.length} {t('radar.tasks_found')}
                </span>
              </div>
            </div>
          </div>

          {/* فلتر المصادر */}
          <div className="mb-4">
            <FilterPanel activeSource={activeSource} onSourceChange={setActiveSource} />
          </div>

          {/* قائمة المهام */}
          <LiveFeed tasks={allTasks} isLoading={isLoading} />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
