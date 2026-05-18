// ===== أداة تسجيل الأحداث =====
// طباعة رسائل السيرفر بتنسيق موحد ومع التوقيت

export function log(message, level = 'info') {
  const timestamp = new Date().toLocaleTimeString('ar')
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️' }
  console.log(`${icons[level] || '•'} [${timestamp}] ${message}`)
}
