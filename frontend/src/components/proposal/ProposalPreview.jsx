// ===== معاينة ونسخ البروبوزال =====
// يعرض النص المولّد مع أنيميشن الـ streaming
// + زر نسخ بلمسة واحدة
// TODO (الأسبوع 5): إضافة منطق النسخ والـ streaming display

function ProposalPreview({ text, isStreaming }) {
  const handleCopy = () => {
    // TODO: navigator.clipboard.writeText(text) + رسالة تأكيد
    alert('سيتم تفعيل النسخ قريباً!')
  }

  return (
    <div className="bg-dark-bg border border-dark-border rounded-xl p-4">
      {/* منطقة النص */}
      <p className="text-gray-300 text-sm leading-relaxed min-h-20 whitespace-pre-wrap">
        {text || 'النص المولّد سيظهر هنا...'}
        {/* مؤشر الكتابة عند streaming */}
        {isStreaming && <span className="animate-pulse text-neon-cyan">|</span>}
      </p>

      {/* زر النسخ */}
      {text && (
        <button
          onClick={handleCopy}
          className="mt-3 text-xs border border-neon-green text-neon-green px-4 py-1.5 rounded-lg hover:bg-neon-green hover:text-dark-bg transition"
        >
          📋 نسخ البروبوزال
        </button>
      )}
    </div>
  )
}

export default ProposalPreview
