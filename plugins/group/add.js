module.exports = {
  name: 'add',
  alias: [],
  category: 'group',
  reactEmoji: '➕',
  async execute(sock, msg, { from, args, sender }) {
    const groupMeta = await sock.groupMetadata(from)
    const isAdmin = groupMeta.participants.find(p => p.id === sender)?.admin
    if (!isAdmin) return sock.sendMessage(from, { text: '❌ Admin only.' }, { quoted: msg })
    const number = args[0]?.replace(/[^0-9]/g, '')
    if (!number || number.length < 10) return sock.sendMessage(from, { text: '❌ Provide a valid number' }, { quoted: msg })
    await sock.groupParticipantsUpdate(from, [number + '@s.whatsapp.net'], 'add')
    await sock.sendMessage(from, { text: `✅ Added +${number}` }, { quoted: msg })
  }
}