module.exports = {
  name: 'promote',
  alias: ['makeadmin'],
  category: 'group',
  reactEmoji: '⭐',
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
    await sock.groupParticipantsUpdate(from, [target], 'promote')
    await sock.sendMessage(from, { text: `✅ Promoted @${target.split('@')[0]}` }, { quoted: msg })
  }
}