// ===== Controller المصادقة =====
// يحتوي على منطق تسجيل الدخول، إنشاء الحساب، وجلب المستخدم الحالي

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/database.js'

// دالة مساعدة: توليد JWT token
function generateToken(userId) {
  return jwt.sign(
    { userId }, // البيانات المخزنة في الـ token
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { name, email, password } = req.body

    // التحقق من عدم وجود حساب بنفس البريد
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'هذا البريد مسجّل مسبقاً' })
    }

    // تشفير كلمة المرور قبل الحفظ
    const hashedPassword = await bcrypt.hash(password, 12)

    // حفظ المستخدم الجديد
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true } // لا نرجع كلمة المرور!
    })

    const token = generateToken(user.id)
    res.status(201).json({ user, token })

  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء الحساب', error: error.message })
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'البريد أو كلمة المرور غير صحيحة' })
    }

    // مقارنة كلمة المرور مع المشفّرة
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'البريد أو كلمة المرور غير صحيحة' })
    }

    const token = generateToken(user.id)
    const { password: _, ...userWithoutPassword } = user // حذف كلمة المرور من الرد
    res.json({ user: userWithoutPassword, token })

  } catch (error) {
    res.status(500).json({ message: 'خطأ في تسجيل الدخول', error: error.message })
  }
}

// GET /api/auth/me
export async function getMe(req, res) {
  try {
    // req.user.userId يأتي من authMiddleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, skills: true }
    })
    res.json({ user })
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب بيانات المستخدم' })
  }
}
