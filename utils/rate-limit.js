const userCooldown = new Map()

function isRateLimited(userId, limitPerHour = 30, windowMs = 3600000) {
  const now = Date.now()
  const record = userCooldown.get(userId) || { count: 0, firstRequest: now }
  if (now - record.firstRequest > windowMs) {
    record.count = 1
    record.firstRequest = now
  } else {
    record.count++
  }
  userCooldown.set(userId, record)
  return record.count > limitPerHour
}

module.exports = { isRateLimited }