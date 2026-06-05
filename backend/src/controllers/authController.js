// authController.js — aligned to profiles table schema
const { createClient }  = require('@supabase/supabase-js')
const { prisma }        = require('../config/database')
const { cacheDel }      = require('../config/redis')
const multer            = require('multer')
const path              = require('path')

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Multer — memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()))
  },
})
exports.uploadMiddleware = upload.single('avatar')

// ── Helpers ──────────────────────────────────────────────────────────────────
function userToResponse(u) {
  return {
    id:              u.id,
    name:            u.name,
    email:           u.email,
    avatar:          u.avatarUrl,       // expose as "avatar" to frontend
    avatarUrl:       u.avatarUrl,
    bio:             u.bio,
    skills:          u.skills || [],
    role:            u.role,
    specialty:       u.specialty,
    jobTitle:        u.jobTitle,
    linkedinUrl:     u.linkedinUrl,
    githubUrl:       u.githubUrl,
    yearsExperience: u.yearsExperience,
    onboarded:       u.onboarded,
  }
}

// POST /api/auth/supabase-sync ───────────────────────────────────────────────
exports.supabaseSync = async (req, res, next) => {
  try {
    const { access_token } = req.body
    if (!access_token) return res.status(400).json({ message: 'Token required' })

    const { data: { user: sbUser }, error } = await supabaseAdmin.auth.getUser(access_token)
    if (error || !sbUser) return res.status(401).json({ message: 'Invalid token' })

    const name      = sbUser.user_metadata?.full_name
                   || sbUser.user_metadata?.name
                   || sbUser.email?.split('@')[0]
                   || 'User'
    const email     = sbUser.email
    const avatarUrl = sbUser.user_metadata?.avatar_url || null

    // upsert into "profiles" table via Prisma
    const user = await prisma.user.upsert({
      where:  { id: sbUser.id },
      update: { name, avatarUrl, email },
      create: {
        id:        sbUser.id,
        name,
        email,
        avatarUrl,
        skills:    [],
        onboarded: false,
      },
    })

    res.json({ user: userToResponse(user) })
  } catch (e) {
    console.error('supabase-sync error:', e.message)
    next(e)
  }
}

// GET /api/auth/profile ───────────────────────────────────────────────────────
exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(userToResponse(user))
  } catch (e) { next(e) }
}

// PUT /api/auth/profile ───────────────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      skills, bio, jobTitle, linkedinUrl, githubUrl,
      yearsExperience, onboarded, role, specialty,
    } = req.body

    const data = {}
    if (Array.isArray(skills))            data.skills          = skills
    if (bio          !== undefined)       data.bio             = bio
    if (jobTitle     !== undefined)       data.jobTitle        = jobTitle
    if (linkedinUrl  !== undefined)       data.linkedinUrl     = linkedinUrl
    if (githubUrl    !== undefined)       data.githubUrl       = githubUrl
    if (yearsExperience !== undefined)    data.yearsExperience = Number(yearsExperience) || null
    if (onboarded    !== undefined)       data.onboarded       = Boolean(onboarded)
    if (role         !== undefined)       data.role            = role
    if (specialty    !== undefined)       data.specialty       = specialty

    // upsert instead of update — handles the case where profile row doesn't exist yet
    const user = await prisma.user.upsert({
      where:  { id: req.userId },
      update: data,
      create: {
        id:        req.userId,
        ...data,
        skills:    data.skills || [],
        onboarded: data.onboarded || false,
      },
    })

    res.json({ message: 'Profile saved', user: userToResponse(user) })
  } catch (e) {
    console.error('updateProfile error:', e.message)
    next(e)
  }
}

// PUT /api/auth/skills ────────────────────────────────────────────────────────
exports.updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body
    if (!Array.isArray(skills)) return res.status(400).json({ message: 'Skills must be an array' })

    await prisma.user.upsert({
      where:  { id: req.userId },
      update: { skills },
      create: { id: req.userId, skills, onboarded: false },
    })
    res.json({ message: 'Skills updated', skills })
  } catch (e) { next(e) }
}

// POST /api/auth/avatar ───────────────────────────────────────────────────────
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image attached' })

    const ext      = path.extname(req.file.originalname).toLowerCase() || '.jpg'
    const filePath = `avatars/${req.userId}${ext}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(filePath, req.file.buffer, { contentType: req.file.mimetype, upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('avatars').getPublicUrl(filePath)

    await prisma.user.upsert({
      where:  { id: req.userId },
      update: { avatarUrl: publicUrl },
      create: { id: req.userId, avatarUrl: publicUrl, skills: [], onboarded: false },
    })

    await cacheDel(`user:${req.userId}`)
    res.json({ message: 'Avatar uploaded', avatarUrl: publicUrl })
  } catch (e) {
    console.error('Avatar upload error:', e.message)
    next(e)
  }
}
