const { connectDB } = require('../database')
const { sessions } = require('../auth/session-store')
const logger = require('./logger')

async function backupSessions() {
  const db = await connectDB()
  const backupCol = db.collection('session_backups')
  const timestamp = new Date()
  const backupData = []
  for (const [number, sock] of sessions.entries()) {
    const creds = sock.authState.creds
    backupData.push({ number, creds, backedUpAt: timestamp })
  }
  if (backupData.length) {
    await backupCol.insertMany(backupData)
    await backupCol.deleteMany({ backedUpAt: { $lt: new Date(Date.now() - 30*24*60*60*1000) } })
    logger.info(`[BACKUP] Saved ${backupData.length} sessions`)
  }
}

function startBackupScheduler() {
  setInterval(() => backupSessions(), 6 * 60 * 60 * 1000)
  logger.info('[BACKUP] Scheduler started')
}

module.exports = { backupSessions, startBackupScheduler }