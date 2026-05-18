// ===== إعداد الاتصال بقاعدة البيانات =====
// يستخدم Prisma ORM للتعامل مع PostgreSQL بطريقة آمنة وسهلة

import { PrismaClient } from '@prisma/client'

// إنشاء instance واحد من Prisma (Singleton Pattern)
// لمنع فتح اتصالات متعددة بقاعدة البيانات
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

export default prisma
