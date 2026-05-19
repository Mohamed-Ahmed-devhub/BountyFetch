// ===================================================
// database.js - إعداد الاتصال بقاعدة البيانات
// ===================================================
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ متصل بقاعدة البيانات PostgreSQL')
  } catch (error) {
    console.error('❌ فشل الاتصال بقاعدة البيانات:', error)
    throw error
  }
}

module.exports = { prisma, connectDB }
