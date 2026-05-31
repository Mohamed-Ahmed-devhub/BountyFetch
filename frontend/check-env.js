// ضع هذا الملف في مجلد frontend وشغله بـ: node check-env.js
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '.env')
const content = fs.readFileSync(envPath, 'utf8')
const lines = content.split('\n')

console.log('\n🔍 BountyFetch Frontend ENV Check\n')

const checks = {
  VITE_SUPABASE_URL: null,
  VITE_SUPABASE_ANON_KEY: null,
  VITE_API_URL: null,
}

for (const line of lines) {
  for (const key of Object.keys(checks)) {
    if (line.startsWith(key + '=')) {
      checks[key] = line.split('=').slice(1).join('=').trim()
    }
  }
}

let allOk = true

// Check SUPABASE_URL
if (!checks.VITE_SUPABASE_URL) {
  console.log('❌ VITE_SUPABASE_URL: مفقود!')
  allOk = false
} else if (!checks.VITE_SUPABASE_URL.startsWith('https://')) {
  console.log('❌ VITE_SUPABASE_URL: يجب أن يبدأ بـ https://')
  allOk = false
} else {
  console.log('✅ VITE_SUPABASE_URL:', checks.VITE_SUPABASE_URL)
}

// Check SUPABASE_ANON_KEY
if (!checks.VITE_SUPABASE_ANON_KEY) {
  console.log('❌ VITE_SUPABASE_ANON_KEY: مفقود!')
  allOk = false
} else if (checks.VITE_SUPABASE_ANON_KEY.length < 40) {
  console.log('❌ VITE_SUPABASE_ANON_KEY: مقطوع! الطول الحالي:', checks.VITE_SUPABASE_ANON_KEY.length, 'حرف (يجب أن يكون 200+ حرف)')
  console.log('   القيمة الموجودة:', checks.VITE_SUPABASE_ANON_KEY)
  allOk = false
} else {
  console.log('✅ VITE_SUPABASE_ANON_KEY: موجود (طوله', checks.VITE_SUPABASE_ANON_KEY.length, 'حرف)')
}

// Check API URL
if (!checks.VITE_API_URL) {
  console.log('⚠️  VITE_API_URL: مفقود (سيستخدم http://localhost:3001/api افتراضياً)')
} else {
  console.log('✅ VITE_API_URL:', checks.VITE_API_URL)
}

console.log('')
if (allOk) {
  console.log('🎉 كل الـ ENV variables صحيحة!\n')
} else {
  console.log('⚠️  يوجد مشاكل في الـ ENV — راجع الأخطاء أعلاه\n')
  console.log('📌 للحصول على الـ ANON KEY الصحيح:')
  console.log('   1. اذهب إلى https://supabase.com/dashboard')
  console.log('   2. اختر مشروعك')
  console.log('   3. Settings → API → anon public key')
  console.log('   4. انسخ المفتاح كاملاً وضعه في frontend/.env\n')
}
