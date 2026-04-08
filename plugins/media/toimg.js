module.exports = {
  name: 'toimg',
  alias: ['toimage'],
  category: 'media',
  reactEmoji: '🖼️',
  async execute(sock, msg, { from }) {
    const stickerMsg = msg.message?.stickerMessage
    if (!stickerMsg) {
      return sock.sendMessage(from, { text: '❌ Reply to a sticker with .toimg' }, { quoted: msg })
    }
    const buffer = await sock.downloadMediaMessage(msg)
    await sock.sendMessage(from, { image: buffer }, { quoted: msg })
  }
}