const { searchAndDownloadAudio } = require('../../utils/downloader')
const { sendLoadingMessage } = require('../../utils/message-helper')

module.exports = {
  name: 'play',
  alias: ['song'],
  category: 'media',
  reactEmoji: '🎧',
  async execute(sock, msg, { from, args }) {
    const query = args.join(' ')
    if (!query) return sock.sendMessage(from, { text: '❌ Usage: `.play <song name>`' }, { quoted: msg })
    const loading = await sendLoadingMessage(sock, from, `Searching for "${query}"...`)
    try {
      const { filePath, title, duration } = await searchAndDownloadAudio(query)
      const fs = require('fs')
      await sock.sendMessage(from, {
        audio: fs.readFileSync(filePath),
        mimetype: 'audio/mpeg',
        ptt: false
      }, { quoted: msg })
      await sock.sendMessage(from, { text: `🎵 *${title}*` })
      fs.unlinkSync(filePath)
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ ${err.message}` }, { quoted: msg })
    }
    if (loading) await sock.sendMessage(from, { delete: loading.key })
  }
}