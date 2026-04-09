const { isAdmin, isBotAdmin } = require('../../utils/group-helper')

module.exports = {
  name: 'demote',
  alias: ['removeadmin'],
  category: 'group',
  reactEmoji: '⬇️',
  desc: 'Remove admin rights',
  async execute(sock, msg, { from, sender, args }) {
    if (!from.endsWith('@g.us')) return sock.sendMessage(from, { text: '❌ Groups only!' })
    
    if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ Admin only!' })
    if (!await isBotAdmin(sock, from)) return sock.sendMessage(from, { text: '❌ I need admin rights!' })
    
    let target = args[0]
    if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
      target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0]
    }
    
    if (!target) return sock.sendMessage(from, { text: '❌ Tag the member to demote!' })
    
    await sock.groupParticipantsUpdate(from, [target], 'demote')
    await sock.sendMessage(from, { text: `✅ @${target.split('@')[0]} _HAS NO LONGER THE GROUP CHARGE_`, mentions: [target] })
  }
}
