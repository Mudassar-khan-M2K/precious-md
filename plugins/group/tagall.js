module.exports = {
  name: 'tagall',
  alias: ['mentionall'],
  category: 'group',
  reactEmoji: '📢',
  async execute(sock, msg, { from, sender }) {
    const groupMeta = await sock.groupMetadata(from)
    if (!groupMeta.participants.find(p => p.id === sender)?.admin) {
      return sock.sendMessage(from, { text: '❌ Admin only.' }, { quoted: msg })
    }
    let text = '📢 *Attention everyone!*\n'
    for (const p of groupMeta.participants) {
      text += `@${p.id.split('@')[0]} `
    }
    await sock.sendMessage(from, { text, mentions: groupMeta.participants.map(p => p.id) }, { quoted: msg })
  }
}