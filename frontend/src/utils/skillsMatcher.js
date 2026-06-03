// Returns a 0-100 match score between task skills and user skills
export function matchScore(taskSkills = [], userSkills = []) {
  if (!taskSkills.length) return 0
  const task = taskSkills.map(s => s.toLowerCase())
  const user = userSkills.map(s => s.toLowerCase())
  const matches = task.filter(s => user.some(u => u.includes(s) || s.includes(u)))
  return Math.round((matches.length / task.length) * 100)
}

export function topMatches(tasks = [], userSkills = [], limit = 5) {
  return tasks
    .map(t => ({ ...t, _score: matchScore(t.skills, userSkills) }))
    .filter(t => t._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
}
