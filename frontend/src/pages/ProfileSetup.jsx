// ===================================================
// ProfileSetup.jsx - صفحة إعداد ملف المستخدم ومهاراته
// ===================================================
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import { authService } from '../services/authService.js'

const ALL_SKILLS = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'TypeScript',
  'Node.js', 'Python', 'PHP', 'WordPress', 'Figma', 'Responsive Design',
  'Bootstrap', 'Tailwind CSS', 'MongoDB', 'MySQL', 'Git'
]

function ProfileSetup() {
  const { t } = useTranslation()
  const [selectedSkills, setSelectedSkills] = useState([])
  const [saving, setSaving] = useState(false)

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await authService.updateSkills(selectedSkills)
    } catch (error) {
      console.error('خطأ في الحفظ:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <h1 className="text-xl font-black text-brand-cyan mb-2">⚙️ ملفي الشخصي</h1>
          <p className="text-gray-400 text-sm mb-6">
            اختر مهاراتك حتى يرشح الرادار المهام المناسبة لك تحديداً
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {ALL_SKILLS.map(skill => {
              const isSelected = selectedSkills.includes(skill)
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`
                    text-sm px-4 py-2 rounded-full border transition-all
                    ${isSelected
                      ? 'bg-brand-cyan text-brand-dark border-brand-cyan font-bold'
                      : 'border-brand-border text-gray-400 hover:border-brand-cyan hover:text-brand-cyan'
                    }
                  `}
                >
                  {skill}
                </button>
              )
            })}
          </div>

          <Button variant="primary" onClick={handleSave} loading={saving}>
            💾 {t('common.save')} ({selectedSkills.length} مهارة)
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default ProfileSetup
