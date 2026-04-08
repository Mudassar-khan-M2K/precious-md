const { connectDB } = require('../../database')

module.exports = {
  name: 'welcome',
  alias: ['setwelcome'],
  category: 'group',
  reactEmoji: '👋',
  async execute(sock, msg, { from, args, sender }) {
    const groupMeta = await sock.groupMetadata(from)
    const isAdmin = groupMeta.participants.find(p => p.id === sender)?.admin
    if (!isAdmin) return sock.sendMessage(from, { text: '❌ Admin only.' }, { quoted: msg })
    const text = args.join(' ')
    if (!text) return sock.sendMessage(from, { text: 'Usage: .welcome <message>' }, { quoted: msg })
    const db = await connectDB()
    await db.collection('group_settings').updateOne({ jid: from }, { $set: { welcome: text } }, { upsert: true })
    await sock.sendMessage(from, { text: '✅ Welcome message saved.' }, { quoted: msg })
  }
}