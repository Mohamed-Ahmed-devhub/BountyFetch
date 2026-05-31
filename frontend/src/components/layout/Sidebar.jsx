// ===================================================
// Sidebar.jsx - الشريط الجانبي للفلترة في الرادار
// ===================================================
import React from 'react'
import { useTranslation } from 'react-i18next'
import Badge from '../ui/Badge.jsx'

// قائمة المهارات المتاحة للفلترة
const SKILLS = ['HTML', 'CSS', 'JavaScript', 'React', 'Python', 'WordPress', 'Responsive', 'Figma']

function Sidebar({ selectedSkills = [], onSkillToggle }) {
  const { t } = useTranslation()

  return (
    <aside className="w-64 border-e border-brand-border p-4 h-full">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        {t('radar.filter_label')}
      </h3>
      
      {/* قائمة المهارات */}
      <div className="flex flex-wrap gap-2">
        {SKILLS.map((skill) => {
          const isSelected = selectedSkills.includes(skill)
          return (
            <button
              key={skill}
              onClick={() => onSkillToggle(skill)}
              className={`
                text-xs px-3 py-1.5 rounded-full border transition-all
                ${isSelected 
                  ? 'bg-brand-cyan text-brand-dark border-brand-cyan font-semibold' 
                  : 'border-brand-border text-gray-400 hover:border-brand-cyan hover:text-brand-cyan'
                }
              `}
            >
              {skill}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default Sidebar
