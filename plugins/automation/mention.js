const fs = require('fs')
const path = require('path')

module.exports = {
  name: 'mention',
  alias: [],
  category: 'automation',
  desc: 'Send audio when someone mentions the bot',
  async execute(sock, msg, { from, sender }) {
    // This is handled automatically in the message handler
    // See _loader.js update below
  },
  async handleMention(sock, msg, from, sender, botNumber) {
    try {
      const audioPath = path.join(__dirname, '../../audio/dev.mp3')
      
      if (fs.existsSync(audioPath)) {
        const audioBuffer = fs.readFileSync(audioPath)
        
        await sock.sendMessage(from, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: true // Sends as voice note
        })
        console.log(`[MENTION] Sent audio to ${from} for mention by ${sender}`)
      } else {
        console.log('[MENTION] Audio file not found at:', audioPath)
      }
    } catch (err) {
      console.error('[MENTION] Error sending audio:', err.message)
    }
  }
}
