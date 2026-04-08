const axios = require('axios')
const fs = require('fs')
const path = require('path')

module.exports = {
  name: 'tts',
  alias: ['speak'],
  category: 'ai',
  reactEmoji: '🗣️',
  async execute(sock, msg, { from, args }) {
    const text = args.join(' ')
    if (!text) return sock.sendMessage(from, { text: '❌ Usage: .tts <text>' }, { quoted: msg })
    await sock.sendMessage(from, { text: '🔊 Generating voice...' }, { quoted: msg })
    try {
      // Free TTS API (replace with your preferred)
      const url = `https://api.voicerss.org/?key=YOUR_API_KEY&hl=en-us&src=${encodeURIComponent(text)}`
      const response = await axios.get(url, { responseType: 'arraybuffer' })
      const filePath = path.join(__dirname, '../../tmp', `tts_${Date.now()}.mp3`)
      fs.writeFileSync(filePath, response.data)
      await sock.sendMessage(from, {
        audio: fs.readFileSync(filePath),
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: msg })
      fs.unlinkSync(filePath)
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ TTS failed: ${err.message}` }, { quoted: msg })
    }
  }
}