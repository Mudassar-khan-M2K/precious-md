const { connectDB } = require('../../database')

module.exports = {
  name: 'antilink',
  alias: [],
  category: 'group',
  reactEmoji: '🔗',
  async execute(sock, msg, { from, args, sender }) {
    const groupMeta = await sock.groupMetadata(from)
    const isAdmin = groupMeta.participants.find(p => p.id === sender)?.admin
    if (!isAdmin) return sock.sendMessage(from, { text: '❌ Admin only.' }, { quoted: msg })
    const action = args[0]?.toLowerCase()
    if (action !== 'on' && action !== 'off') return sock.sendMessage(from, { text: 'Usage: .antilink on/off' }, { quoted: msg })
    const db = await connectDB()
    await db.collection('group_settings').updateOne({ jid: from }, { $set: { antilink: action === 'on' } }, { upsert: true })
    await sock.sendMessage(from, { text: `✅ Anti-link ${action}.` }, { quoted: msg })
  }
}