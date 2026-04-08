const { useMongoDBAuthState } = require('mongo-baileys')
const { connectDB } = require('../database')
const { delay } = require('@whiskeysockets/baileys')

const sessions = new Map()
const qrStore = new Map()

async function getAuthCollection(number) {
  const db = await connectDB()
  return db.collection(`session_${number}`)
}

async function loadAuthState(number) {
  const collection = await getAuthCollection(number)
  return await useMongoDBAuthState(collection)
}

async function removeSessionDir(number) {
  const collection = await getAuthCollection(number)
  await collection.drop().catch(() => {})
}

async function restoreAllSessions(createSessionFn) {
  const db = await connectDB()
  const collections = await db.listCollections().toArray()
  const sessionCols = collections.filter(c => c.name.startsWith('session_'))
  console.log(`[SESSION] Restoring ${sessionCols.length} sessions...`)
  for (const col of sessionCols) {
    const number = col.name.replace('session_', '')
    try {
      await createSessionFn(number)
      await delay(2500)
    } catch (err) {
      console.error(`Failed to restore ${number}:`, err.message)
    }
  }
}

module.exports = {
  sessions,
  qrStore,
  getAuthCollection,
  loadAuthState,
  removeSessionDir,
  restoreAllSessions
}