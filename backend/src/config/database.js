// ===================================================
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
}

module.exports = { prisma, connectDB }
