const { downloadYouTubeMP3 } = require('../../utils/downloader')
const { sendLoadingMessage } = require('../../utils/message-helper')

module.exports = {
  name: 'ytmp3',
  alias: ['ytaudio'],
  category: 'media',
  reactEmoji: '🎵',
  async execute(sock, msg, { from, args }) {
    const link = args[0]
    if (!link) return sock.sendMessage(from, { text: '❌ Usage: `.ytmp3 <youtube_link>`' }, { quoted: msg })
    const loading = await sendLoadingMessage(sock, from, 'Converting to MP3...')
    try {
      const { filePath, title, duration } = await downloadYouTubeMP3(link)
      const fs = require('fs')
      await sock.sendMessage(from, {
        audio: fs.readFileSync(filePath),
        mimetype: 'audio/mpeg',
        ptt: false
      }, { quoted: msg })
      await sock.sendMessage(from, { text: `✅ *${title}*` })
      fs.unlinkSync(filePath)
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ Error: ${err.message}` }, { quoted: msg })
    }
    if (loading) await sock.sendMessage(from, { delete: loading.key })
  }
}