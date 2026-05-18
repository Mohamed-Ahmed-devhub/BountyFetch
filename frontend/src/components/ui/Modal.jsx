// ===== مكوّن النافذة المنبثقة =====
// يُستخدم لعرض: تأكيد إجراء، معاينة البروبوزال، إشعار مهم
// isOpen: هل النافذة مفتوحة؟ | onClose: دالة الإغلاق

function Modal({ isOpen, onClose, title, children }) {
  // لا تعرض شيئاً إذا كانت النافذة مغلقة
  if (!isOpen) return null

  return (
    // الطبقة الخلفية الداكنة - عند النقر عليها تغلق النافذة
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* محتوى النافذة - نوقف انتشار الحدث لمنع إغلاقها بالنقر الداخلي */}
      <div
        className="bg-dark-card border border-dark-border rounded-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس النافذة */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
