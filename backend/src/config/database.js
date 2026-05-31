// ===================================================
<<<<<<< HEAD
// database.js — إعداد Prisma / PostgreSQL
// المسار: backend/src/config/database.js
// ===================================================

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
})

async function connectDB() {
  await prisma.$connect()
  console.log('✅ PostgreSQL متصل')
=======
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
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
}

module.exports = { prisma, connectDB }
