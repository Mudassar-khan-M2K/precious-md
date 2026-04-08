function randomDelay(min = 500, max = 2000) {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min))
}

async function executeWithAntiBan(sessions, action) {
  const results = []
  for (const [num, sock] of sessions.entries()) {
    await randomDelay(800, 2500)
    try {
      const res = await action(sock, num)
      results.push({ number: num, success: true, result: res })
    } catch (err) {
      results.push({ number: num, success: false, error: err.message })
    }
  }
  return results
}

module.exports = { randomDelay, executeWithAntiBan }