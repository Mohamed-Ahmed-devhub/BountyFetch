// ===================================================
// ProposalGenerator.jsx - مولد العروض الذكي
// يرسل طلب للـ Backend الذي يتصل بـ Claude API
// ===================================================
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { aiService } from '../../services/aiService.js'
import Button from '../ui/Button.jsx'

function ProposalGenerator({ taskId }) {
  const { t } = useTranslation()
  const [proposal, setProposal]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [copied, setCopied]       = useState(false)
  const [language, setLanguage]   = useState('ar')

  // توليد البروبوزال عبر الـ AI
  const handleGenerate = async (lang) => {
    setLanguage(lang)
    setLoading(true)
    setProposal('')
    
    try {
      const response = await aiService.generateProposal(taskId, lang)
      setProposal(response.data.proposal)
    } catch (error) {
      console.error('خطأ في توليد البروبوزال:', error)
      setProposal('حدث خطأ أثناء التوليد. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  // نسخ النص للحافظة
  const handleCopy = () => {
    navigator.clipboard.writeText(proposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-card p-5">
      <h2 className="text-lg font-bold text-brand-cyan mb-4">
        🤖 {t('proposal.title')}
      </h2>

      {/* أزرار التوليد */}
      <div className="flex gap-3 mb-4">
        <Button
          variant="primary"
          onClick={() => handleGenerate('ar')}
          loading={loading && language === 'ar'}
        >
          {t('proposal.generate_ar')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleGenerate('en')}
          loading={loading && language === 'en'}
        >
          {t('proposal.generate_en')}
        </Button>
      </div>

      {/* منطقة عرض البروبوزال */}
      {loading && (
        <div className="text-center py-6 text-brand-cyan animate-pulse">
          ⚡ {t('proposal.generating')}
        </div>
      )}

      {proposal && !loading && (
        <div className="relative">
          <textarea
            readOnly
            value={proposal}
            rows={8}
            className="w-full bg-brand-dark border border-brand-border rounded-lg p-4 text-gray-300 text-sm resize-none focus:outline-none"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          {/* زر النسخ */}
          <button
            onClick={handleCopy}
            className="absolute top-2 end-2 text-xs px-3 py-1 bg-brand-surface border border-brand-border rounded-md text-gray-400 hover:text-brand-cyan hover:border-brand-cyan transition-all"
          >
            {copied ? `✅ ${t('proposal.copied')}` : `📋 ${t('proposal.copy')}`}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProposalGenerator
