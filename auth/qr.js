const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  delay,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys')

const { Boom } = require('@hapi/boom')
const pino = require('pino')
const fs = require('fs')
const path = require('path')
const qrcode = require('qrcode')

const SESSIONS_DIR = path.join(__dirname, '..', 'sessions')
const logger = pino({ level: 'silent' })

// Global maps
const sessions = new Map()
const qrStore = new Map()

// ── CREATE / RESTORE A SESSION ──
async function createSessionViaQR(number) {
  if (sessions.has(number)) {
    console.log(`[SESSION] Already connected: ${number}`)
    return sessions.get(number)
  }

  const sessDir = path.join(SESSIONS_DIR, number)
  if (!fs.existsSync(sessDir)) fs.mkdirSync(sessDir, { recursive: true })

  const { state, saveCreds } = await useMultiFileAuthState(sessDir)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false,
    browser: ['Precious MD', 'Chrome', '3.0.0'],
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    markOnlineOnConnect: false,
    syncFullHistory: false
  })

  sock.ev.on('creds.update', saveCreds)

  // ✅ MESSAGE HANDLER - PROCESS COMMANDS
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    for (const msg of messages) {
      try {
        const { handleIncomingMessage } = require('./_loader')
        await handleIncomingMessage(sock, msg, sessions)
      } catch (e) {
        console.error('[SESSION] handleCommand error:', e.message)
      }
    }
  })

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      try {
        const base64 = await qrcode.toDataURL(qr)
        qrStore.set(number, base64)
        console.log(`[SESSION] QR ready: ${number}`)
      } catch (e) {
        console.error('[SESSION] QR error:', e.message)
      }
    }

    if (connection === 'open') {
      console.log(`[SESSION] ✅ Connected: ${number}`)
      sessions.set(number, sock)
      qrStore.delete(number)
    }

    if (connection === 'close') {
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode
      console.log(`[SESSION] ❌ Disconnected: ${number} code=${code}`)
      sessions.delete(number)

      if (code !== DisconnectReason.loggedOut) {
        console.log(`[SESSION] 🔄 Reconnecting: ${number}`)
        await delay(4000)
        createSessionViaQR(number)
      } else {
        console.log(`[SESSION] 🚫 Logged out, removing: ${number}`)
        fs.rmSync(sessDir, { recursive: true, force: true })
      }
    }
  })

  sessions.set(number, sock)
  return sock
}

// ── PAIRING CODE FLOW ──
async function createSessionViaPairing(number) {
  if (sessions.has(number)) {
    throw new Error('Number already connected!')
  }

  const sessDir = path.join(SESSIONS_DIR, number)
  if (!fs.existsSync(sessDir)) fs.mkdirSync(sessDir, { recursive: true })

  const { state, saveCreds } = await useMultiFileAuthState(sessDir)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false,
    browser: ['Precious MD', 'Chrome', '3.0.0'],
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    markOnlineOnConnect: false,
    syncFullHistory: false
  })

  sock.ev.on('creds.update', saveCreds)

  // ✅ MESSAGE HANDLER - PROCESS COMMANDS
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    for (const msg of messages) {
      try {
        const { handleIncomingMessage } = require('./_loader')
        await handleIncomingMessage(sock, msg, sessions)
      } catch (e) {
        console.error('[SESSION] handleCommand error:', e.message)
      }
    }
  })

  let pairCode = null
  let codeDone = false

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    if (!codeDone && !sock.authState.creds.registered) {
      codeDone = true
      await delay(1500)
      try {
        pairCode = await sock.requestPairingCode(number)
        console.log(`[SESSION] Pair code for ${number}: ${pairCode}`)
      } catch (e) {
        console.error('[SESSION] requestPairingCode error:', e.message)
      }
    }

    if (connection === 'open') {
      console.log(`[SESSION] ✅ Paired: ${number}`)
      sessions.set(number, sock)
    }

    if (connection === 'close') {
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode
      sessions.delete(number)
      if (code !== DisconnectReason.loggedOut) {
        await delay(4000)
        createSessionViaQR(number)
      } else {
        fs.rmSync(sessDir, { recursive: true, force: true })
      }
    }
  })

  for (let i = 0; i < 40; i++) {
    await delay(500)
    if (pairCode) break
  }

  if (!pairCode) throw new Error('Could not generate pairing code. Try again.')
  return pairCode
}

// ── RESTORE ALL SAVED SESSIONS ON STARTUP ──
async function restoreAllSessions() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true })
    return
  }

  const folders = fs.readdirSync(SESSIONS_DIR).filter(f =>
    fs.statSync(path.join(SESSIONS_DIR, f)).isDirectory()
  )

  console.log(`[SESSION] Restoring ${folders.length} session(s)...`)

  for (const num of folders) {
    try {
      await createSessionViaQR(num)
      await delay(2500)
    } catch (e) {
      console.error(`[SESSION] Failed to restore ${num}:`, e.message)
    }
  }
}

module.exports = { 
  sessions, 
  qrStore, 
  createSessionViaQR, 
  createSessionViaPairing, 
  restoreAllSessions 
    }
