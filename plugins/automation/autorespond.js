const { connectDB } = require('../../database')

module.exports = {
  name: 'autorespond',
  alias: ['autoreply'],
  category: 'automation',
  reactEmoji: '💬',
  async execute(sock, msg, { from, args, sender }) {
    const keyword = args[0]
    const response = args.slice(1).join(' ')
    if (!keyword || !response) {
      return sock.sendMessage(from, { text: 'Usage: .autorespond <keyword> <response>' }, { quoted: msg })
    }
    const db = await connectDB()
    await db.collection('autorespond').updateOne(
      { jid: from, keyword: keyword.toLowerCase() },
      { $set: { response } },
      { upsert: true }
    )
    await sock.sendMessage(from, { text: `✅ Auto-response set: "${keyword}" → "${response}"` }, { quoted: msg })
  }
}