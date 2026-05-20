
import React from 'react'

// color: 'cyan' | 'purple' | 'green' | 'red' | 'yellow'
function Badge({ children, color = 'cyan' }) {
  const colors = {
    cyan:   'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30',
    purple: 'bg-brand-purple/10 text-brand-purple border-brand-purple/30',
    green:  'bg-neon-green/10 text-neon-green border-neon-green/30',
    red:    'bg-neon-red/10 text-neon-red border-neon-red/30',
    yellow: 'bg-neon-yellow/10 text-neon-yellow border-neon-yellow/30',
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[color]}`}>
      {children}
    </span>
  )
}

export default Badge
