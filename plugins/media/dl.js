const { downloadMedia, detectPlatform } = require('../../utils/downloader')
const { sendLoadingMessage } = require('../../utils/message-helper')

module.exports = {
  name: 'dl',
  alias: ['download'],
  category: 'media',
  reactEmoji: '📥',
  async execute(sock, msg, { from, args }) {
    const link = args[0]
    if (!link) {
      await sock.sendMessage(from, { text: '❌ Usage: `.dl <link>`\nSupported: YouTube, TikTok, Instagram, Pinterest, Twitter, Facebook' }, { quoted: msg })
      return
    }
    const platform = detectPlatform(link)
    if (!platform) {
      await sock.sendMessage(from, { text: '❌ Unsupported platform' }, { quoted: msg })
      return
    }
    const loading = await sendLoadingMessage(sock, from, `Downloading from ${platform}...`)
    try {
      const { filePath, title, isVideo } = await downloadMedia(link, platform)
      const fs = require('fs')
      if (isVideo) {
        await sock.sendMessage(from, {
          video: fs.readFileSync(filePath),
          caption: `✅ *${title}*\n_Downloaded by PRECIOUS-MD_`
        }, { quoted: msg })
      } else {
        await sock.sendMessage(from, {
          image: fs.readFileSync(filePath),
          caption: `✅ *${title}*\n_Downloaded by PRECIOUS-MD_`
        }, { quoted: msg })
      }
      fs.unlinkSync(filePath)
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ Download failed: ${err.message}` }, { quoted: msg })
    }
    if (loading) await sock.sendMessage(from, { delete: loading.key })
  }
}