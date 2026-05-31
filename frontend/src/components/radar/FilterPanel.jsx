// ===================================================
// FilterPanel.jsx - لوحة الفلاتر في أعلى الرادار
// ===================================================
import React from 'react'
import { useTranslation } from 'react-i18next'

const SOURCES = ['all', 'telegram', 'reddit', 'twitter', 'rss']

function FilterPanel({ activeSource, onSourceChange }) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {SOURCES.map((source) => (
        <button
          key={source}
          onClick={() => onSourceChange(source)}
          className={`
            text-sm px-4 py-1.5 rounded-full border whitespace-nowrap transition-all
            ${activeSource === source
              ? 'bg-brand-cyan text-brand-dark border-brand-cyan font-bold'
              : 'border-brand-border text-gray-400 hover:border-brand-cyan hover:text-brand-cyan'
            }
          `}
        >
          {source === 'all' ? 'الكل' : source}
        </button>
      ))}
    </div>
  )
}

export default FilterPanel
