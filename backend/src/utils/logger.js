// logger.js — unified server logging
function log(message, level = 'info') {
  const timestamp = new Date().toLocaleTimeString('en')
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️' }
  console.log(`${icons[level] || '•'} [${timestamp}] ${message}`)
}
module.exports = { log }
