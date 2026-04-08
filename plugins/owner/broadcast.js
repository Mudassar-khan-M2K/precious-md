const { sessions } = require('../../auth/session-store')
const owners = ['923216046022', '923071639265', '923477262704', '923257762682']

module.exports = {
  name: 'broadcast',
  alias: ['bc'],
  category: 'owner',
  reactEmoji: '📢',
  async execute(sock, msg, { from, args, sender }) {
    if (!owners.includes(sender)) return sock.sendMessage(from, { text: '❌ Owner only.' }, { quoted: msg })
    const message = args.join(' ')
    if (!message) return sock.sendMessage(from, { text: 'Usage: .broadcast <message>' }, { quoted: msg })
    let sent = 0
    for (const [num, s] of sessions.entries()) {
      try {
        await s.sendMessage(num + '@s.whatsapp.net', { text: `📢 *Broadcast:* ${message}` })
        sent++
      } catch (err) {}
    }
    await sock.sendMessage(from, { text: `✅ Broadcast sent to ${sent} sessions.` }, { quoted: msg })
  }
}