const { connectDB } = require('../../database')

module.exports = {
  name: 'mute',
  alias: [],
  category: 'group',
  reactEmoji: '🔇',
  async execute(sock, msg, { from, args, sender }) {
    const groupMeta = await sock.groupMetadata(from)
    const isAdmin = groupMeta.participants.find(p => p.id === sender)?.admin
    if (!isAdmin) return sock.sendMessage(from, { text: '❌ Admin only.' }, { quoted: msg })
    await sock.groupSettingUpdate(from, 'announcement')
    await sock.sendMessage(from, { text: '🔇 Group muted (only admins can send).' }, { quoted: msg })
  }
}