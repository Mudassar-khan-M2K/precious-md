const {
  makeWASocket,
  DisconnectReason,
  delay,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const pino = require('pino')
const qrcode = require('qrcode')
const { sessions, qrStore, loadAuthState, removeSessionDir } = require('./session-store')
const { handleIncomingMessage } = require('../plugins/_loader')

const logger = pino({ level: 'silent' })

async function createSessionViaQR(number) {
  if (sessions.has(number)) return sessions.get(number)

  const { state, saveCreds } = await loadAuthState(number)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false,
    browser: ['PRECIOUS-MD', 'Chrome', '3.0.0'],
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 10000,
    markOnlineOnConnect: false
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      const base64 = await qrcode.toDataURL(qr)
      qrStore.set(number, base64)
      console.log(`[QR] Generated for ${number}`)
    }

    if (connection === 'open') {
      console.log(`[QR] ✅ Connected: ${number}`)
      sessions.set(number, sock)
      qrStore.delete(number)
    }

    if (connection === 'close') {
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode
      sessions.delete(number)
      if (code !== DisconnectReason.loggedOut) {
        console.log(`[QR] Reconnecting ${number}...`)
        await delay(4000)
        createSessionViaQR(number)
      } else {
        await removeSessionDir(number)
      }
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    for (const msg of messages) {
      await handleIncomingMessage(msg, sock, number)
    }
  })

  sessions.set(number, sock)
  return sock
}

module.exports = { createSessionViaQR }