const { downloadMedia, detectPlatform } = require('../../utils/downloader')

module.exports = {
  name: 'sticker',
  alias: ['s'],
  category: 'media',
  reactEmoji: '🎴',
  async execute(sock, msg, { from }) {
    // If message has image/video, convert to sticker
    const mediaMsg = msg.message?.imageMessage || msg.message?.videoMessage
    if (!mediaMsg) {
      return sock.sendMessage(from, { text: '❌ Reply to an image or video with .sticker' }, { quoted: msg })
    }
    const buffer = await sock.downloadMediaMessage(msg)
    await sock.sendMessage(from, { sticker: buffer }, { quoted: msg })
  }
}