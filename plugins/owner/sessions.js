const { sessions } = require('../../auth/session-store')
const owners = ['923216046022', '923071639265', '923477262704', '923257762682']

module.exports = {
  name: 'sessions',
  alias: ['listsessions'],
  category: 'owner',
  reactEmoji: '📊',
  async execute(sock, msg, { from, sender }) {
    if (!owners.includes(sender)) return sock.sendMessage(from, { text: '❌ Owner only.' }, { quoted: msg })
    const list = [...sessions.keys()].map((n, i) => `${i+1}. +${n}`).join('\n') || 'None'
    await sock.sendMessage(from, { text: `📱 *Connected Sessions:*\n${list}` }, { quoted: msg })
  }
}