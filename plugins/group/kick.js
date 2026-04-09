const { isAdmin, isBotAdmin } = require('../../utils/group-helper')

module.exports = {
  name: 'kick',
  alias: ['remove', 'delete'],
  category: 'group',
  reactEmoji: '👢',
  desc: 'Remove a member from group',
  async execute(sock, msg, { from, sender, args }) {
    if (!from.endsWith('@g.us')) return sock.sendMessage(from, { text: '❌ This command is for groups only!' })
    
    const groupMeta = await sock.groupMetadata(from)
    const isUserAdmin = await isAdmin(sock, from, sender)
    const isBotAdminFlag = await isBotAdmin(sock, from)
    
    if (!isUserAdmin) return sock.sendMessage(from, { text: '❌ You need admin rights!' })
    if (!isBotAdminFlag) return sock.sendMessage(from, { text: '❌ I need to be admin first!' })
    
    let target = args[0]
    if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
      target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0]
    }
    
    if (!target) return sock.sendMessage(from, { text: '❌ Tag the member to kick!' })
    
    await sock.groupParticipantsUpdate(from, [target], 'remove')
    await sock.sendMessage(from, { text: `✅ SOMEONE LICKS THE DUST - KICKED OUT @${target.split('@')[0]} from group`, mentions: [target] })
  }
}
