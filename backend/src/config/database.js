// database.js — Prisma connection to Supabase PostgreSQL
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
})

async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected (Prisma → Supabase)')
  } catch (err) {
    console.error('❌ Database connection failed:', err.message)
    console.error('   Check DATABASE_URL in backend/.env')
    throw err  // fail fast — no mock fallback in production
  }
}

module.exports = { prisma, connectDB }
