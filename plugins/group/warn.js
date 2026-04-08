const { connectDB } = require('../../database')

module.exports = {
  name: 'warn',
  alias: [],
  category: 'group',
  reactEmoji: '⚠️',
  async execute(sock, msg, { from, args, sender }) {
    const groupMeta = await sock.groupMetadata(from)
    const isAdmin = groupMeta.participants.find(p => p.id === sender)?.admin
    if (!isAdmin) return sock.sendMessage(from, { text: '❌ Admin only.' }, { quoted: msg })
    let target = args[0]
    if (!target) {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant
      if (quoted) target = quoted.split('@')[0]
      else return sock.sendMessage(from, { text: '❌ Tag or reply to user' }, { quoted: msg })
    }
    target = target.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    const db = await connectDB()
    const warns = await db.collection('warns').findOne({ jid: from, user: target })
    let count = warns ? warns.count + 1 : 1
    await db.collection('warns').updateOne({ jid: from, user: target }, { $set: { count } }, { upsert: true })
    await sock.sendMessage(from, { text: `⚠️ Warned @${target.split('@')[0]}. Total warns: ${count}/3` }, { quoted: msg })
    if (count >= 3) {
      await sock.groupParticipantsUpdate(from, [target], 'remove')
      await sock.sendMessage(from, { text: `🚫 @${target.split('@')[0]} removed due to 3 warns.` }, { quoted: msg })
      await db.collection('warns').deleteOne({ jid: from, user: target })
    }
  }
}