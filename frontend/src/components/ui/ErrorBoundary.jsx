import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info?.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const isRTL   = document.documentElement.dir === 'rtl'
    const onReset = () => {
      this.setState({ hasError: false, error: null })
      if (this.props.onReset) this.props.onReset()
    }

    const S = {
      wrap:  { minHeight: this.props.inline ? 'auto' : '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: this.props.inline ? 'transparent' : '#F4F6F9', fontFamily: 'Plus Jakarta Sans, Cairo, sans-serif' },
      card:  { background: '#fff', border: '1px solid #FCA5A5', borderRadius: 14, padding: '2rem', maxWidth: 480, width: '100%', textAlign: 'center' },
      icon:  { fontSize: '2.5rem', marginBottom: '.75rem' },
      title: { fontSize: '1.1rem', fontWeight: 800, color: '#DC2626', margin: '0 0 .5rem' },
      msg:   { fontSize: '.875rem', color: '#5A6478', lineHeight: 1.6, margin: '0 0 1.5rem' },
      detail:{ fontSize: '.75rem', color: '#94A3B8', background: '#F8FAFC', padding: '.6rem .9rem', borderRadius: 8, marginBottom: '1.25rem', textAlign: 'left', wordBreak: 'break-word' },
      btn:   { padding: '.7rem 1.5rem', borderRadius: 9, border: 'none', background: '#002D62', color: '#fff', fontWeight: 700, fontSize: '.9rem', cursor: 'pointer', marginRight: '.5rem' },
      btn2:  { padding: '.7rem 1.5rem', borderRadius: 9, border: '1.5px solid #D8DEE9', background: 'transparent', color: '#5A6478', fontWeight: 600, fontSize: '.9rem', cursor: 'pointer' },
    }

    return (
      <div style={S.wrap}>
        <div style={S.card}>
          <div style={S.icon}>⚠️</div>
          <h2 style={S.title}>{isRTL ? 'حدث خطأ غير متوقع' : 'Something went wrong'}</h2>
          <p style={S.msg}>
            {isRTL
              ? 'حدث خطأ في هذا القسم. يمكنك المحاولة مرة أخرى أو العودة للرادار.'
              : 'An error occurred in this section. You can retry or go back to the radar.'}
          </p>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div style={S.detail}>{this.state.error.message}</div>
          )}
          <button style={S.btn} onClick={onReset}>
            {isRTL ? '↺ إعادة المحاولة' : '↺ Try Again'}
          </button>
          <button style={S.btn2} onClick={() => window.location.href = '/dashboard'}>
            {isRTL ? '← الرادار' : '← Radar'}
          </button>
        </div>
      </div>
    )
  }
}

// Convenience wrapper for inline use
export function withErrorBoundary(Component, props = {}) {
  return function WrappedWithBoundary(componentProps) {
    return (
      <ErrorBoundary {...props}>
        <Component {...componentProps} />
      </ErrorBoundary>
    )
  }
}
