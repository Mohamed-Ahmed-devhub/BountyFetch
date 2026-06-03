// database.js — Prisma / PostgreSQL connection
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected (Prisma)')
  } catch (err) {
    console.error('❌ Database connection failed:', err.message)
    throw err
  }
}

module.exports = { prisma, connectDB }
