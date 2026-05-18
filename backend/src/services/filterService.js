// ===== خدمة فلترة المهام بالـ AI =====
// تأخذ المهمة الخام من المصدر وتحدد:
// 1. هل هي مهمة برمجية حقيقية؟
// 2. ما هي المهارات المطلوبة؟
// 3. ما هو التقدير المالي المتوقع؟
// TODO (الأسبوع 5): ربط Claude API للتصنيف التلقائي

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function classifyAndEnrichTask(rawText, source) {
  const prompt = `حلل هذا النص وحدد إذا كان طلب عمل برمجي:
"${rawText}"

أجب بـ JSON فقط بهذا الشكل:
{
  "isTask": true/false,
  "title": "عنوان مختصر للمهمة",
  "description": "وصف المهمة",
  "skills": ["CSS", "JavaScript"],
  "estimatedBudget": "$10-30",
  "urgency": "low/medium/high"
}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }]
  })

  try {
    // استخراج JSON من رد Claude
    const jsonText = response.content[0].text.trim()
    return JSON.parse(jsonText)
  } catch {
    return { isTask: false } // إذا فشل التحليل، تجاهل المهمة
  }
}
