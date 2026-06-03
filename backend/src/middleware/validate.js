// validate.js — lightweight input validation without external deps
function validateBody(rules) {
  return (req, res, next) => {
    const errors = []
    for (const [field, rule] of Object.entries(rules)) {
      const val = req.body[field]
      if (rule.required && (val === undefined || val === null || val === '')) {
        errors.push(`${field} is required`)
        continue
      }
      if (val !== undefined && rule.type === 'string' && typeof val !== 'string') {
        errors.push(`${field} must be a string`)
      }
      if (val !== undefined && rule.type === 'array' && !Array.isArray(val)) {
        errors.push(`${field} must be an array`)
      }
      if (val !== undefined && rule.maxLength && typeof val === 'string' && val.length > rule.maxLength) {
        errors.push(`${field} must be at most ${rule.maxLength} characters`)
      }
      if (val !== undefined && rule.email) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRe.test(val)) errors.push(`${field} must be a valid email`)
      }
    }
    if (errors.length > 0) return res.status(400).json({ message: errors[0], errors })
    next()
  }
}

const validators = {
  syncToken:    validateBody({ access_token: { required: true, type: 'string' } }),
  updateProfile: validateBody({
    skills:          { type: 'array' },
    bio:             { type: 'string', maxLength: 600 },
    jobTitle:        { type: 'string', maxLength: 100 },
    linkedinUrl:     { type: 'string', maxLength: 200 },
    githubUrl:       { type: 'string', maxLength: 200 },
  }),
  updateSkills: validateBody({ skills: { required: true, type: 'array' } }),
}

module.exports = { validateBody, validators }
