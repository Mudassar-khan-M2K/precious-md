const {
  makeWASocket,
  DisconnectReason,
  delay,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const pino = require('pino')
const { sessions, loadAuthState, removeSessionDir } = require('./session-store')
const { handleIncomingMessage } = require('../plugins/_loader')

const logger = pino({ level: 'silent' })

async function createSessionViaPairing(number) {
  if (sessions.has(number)) throw new Error('Already connected')

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

  let pairCode = null
  let requested = false

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    if (!requested && !sock.authState.creds.registered) {
      requested = true
      await delay(1500)
      try {
        pairCode = await sock.requestPairingCode(number.replace(/[^0-9]/g, ''))
        console.log(`[PAIR] Code for ${number}: ${pairCode}`)
      } catch (err) {
        console.error(`[PAIR] Request failed:`, err.message)
      }
    }

    if (connection === 'open') {
      console.log(`[PAIR] ✅ Paired: ${number}`)
      sessions.set(number, sock)
    }

    if (connection === 'close') {
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode
      sessions.delete(number)
      if (code !== DisconnectReason.loggedOut) {
        await delay(4000)
        createSessionViaPairing(number).catch(console.error)
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

  for (let i = 0; i < 60; i++) {
    await delay(500)
    if (pairCode) break
  }
  if (!pairCode) throw new Error('Pairing code timeout')
  return pairCode
}

module.exports = { createSessionViaPairing }