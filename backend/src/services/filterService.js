// ===================================================
// filterService.js - فلترة المهام بالذكاء الاصطناعي
// يحدد هل المنشور طلب عمل حقيقي أم لا
// ===================================================
const Anthropic = require('@anthropic-ai/sdk')

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// كلمات مفتاحية سريعة للفلترة الأولية (بدون AI لتوفير التكلفة)
const TASK_KEYWORDS = [
  'مطلوب', 'محتاج', 'hire', 'looking for', 'need a', 'budget',
  'freelance', 'فريلانس', 'شغل', 'مشروع', 'project', 'fix', 'تصحيح',
  'html', 'css', 'javascript', 'wordpress', 'react', 'website'
]

// فلترة سريعة بالكلمات المفتاحية أولاً
function quickFilter(text) {
  const lower = text.toLowerCase()
  return TASK_KEYWORDS.some(keyword => lower.includes(keyword.toLowerCase()))
}

// فلترة ذكية بالـ AI للتأكيد
async function isTaskPost(text) {
  // الفلترة السريعة أولاً لتوفير تكلفة الـ API
  if (!quickFilter(text)) return false

  try {
    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 50,
      messages:   [{
        role: 'user',
        content: `هل هذا النص طلب عمل أو مهمة برمجية؟ أجب فقط بـ "yes" أو "no":
"${text.slice(0, 300)}"`
      }],
    })

    return response.content[0].text.toLowerCase().includes('yes')
  } catch {
    return quickFilter(text) // عند الخطأ، نعود للفلترة السريعة
  }
}

// استخراج بيانات منظمة من النص
async function extractTaskData(text, source) {
  try {
    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages:   [{
        role: 'user',
        content: `استخرج من النص التالي البيانات بتنسيق JSON فقط (بدون أي نص إضافي):
{
  "title": "عنوان قصير للمهمة",
  "skills": ["مهارة1", "مهارة2"],
  "budget": "الميزانية المذكورة أو null"
}

النص: "${text.slice(0, 500)}"`
      }],
    })

    return JSON.parse(response.content[0].text)
  } catch {
    // إذا فشل الـ AI، نرجع بيانات افتراضية
    return { title: text.slice(0, 80), skills: [], budget: null }
  }
}

module.exports = { isTaskPost, extractTaskData }
