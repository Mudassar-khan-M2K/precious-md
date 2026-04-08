const { downloadYouTubeMP3 } = require('../../utils/downloader')

module.exports = {
  name: 'tomp3',
  alias: ['audio'],
  category: 'media',
  reactEmoji: '🎵',
  async execute(sock, msg, { from, args }) {
    const videoMsg = msg.message?.videoMessage
    if (!videoMsg && !args[0]) {
      return sock.sendMessage(from, { text: '❌ Reply to a video or provide a YouTube link' }, { quoted: msg })
    }
    // If YouTube link provided
    if (args[0] && (args[0].includes('youtube.com') || args[0].includes('youtu.be'))) {
      const { filePath, title } = await downloadYouTubeMP3(args[0])
      const fs = require('fs')
      await sock.sendMessage(from, {
        audio: fs.readFileSync(filePath),
        mimetype: 'audio/mpeg'
      }, { quoted: msg })
      fs.unlinkSync(filePath)
    } else {
      // Convert replied video to audio
      const buffer = await sock.downloadMediaMessage(msg)
      // In production, use ffmpeg to extract audio. For brevity, send as audio.
      await sock.sendMessage(from, { audio: buffer, mimetype: 'audio/mpeg' }, { quoted: msg })
    }
  }
}