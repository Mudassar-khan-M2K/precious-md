const fs = require('fs')
const path = require('path')

const owners = ['923216046022', '923071639265', '923477262704', '923257762682']
const AUDIO_PATH = path.join(__dirname, '..', 'audio', 'dev.mp3')

async function reactToMessage(sock, msg, emoji) {
  try {
    await sock.sendMessage(msg.key.remoteJid, { react: { text: emoji, key: msg.key } })
  } catch (e) {}
}

async function sendLoadingMessage(sock, to, text) {
  const sent = await sock.sendMessage(to, { text: `⏳ ${text}` })
  return sent
}

async function sendOwnerMentionAudio(sock, msg, from) {
  const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ''
  const mentioned = owners.some(owner => messageText.includes(`@${owner}`) || messageText.includes(owner))
  if (!mentioned) return
  if (!fs.existsSync(AUDIO_PATH)) return console.warn('Audio file missing')
  const audioBuffer = fs.readFileSync(AUDIO_PATH)
  await sock.sendMessage(from, {
    audio: audioBuffer,
    mimetype: 'audio/mpeg',
    ptt: true
  })
}

module.exports = { reactToMessage, sendLoadingMessage, sendOwnerMentionAudio }