const { sessions, restoreAllSessions } = require('../../auth/session-store')
const { createSessionViaQR } = require('../../auth/qr')
const owners = ['923216046022', '923071639265', '923477262704', '923257762682']

module.exports = {
  name: 'restore',
  alias: ['restoresessions'],
  category: 'owner',
  reactEmoji: '💾',
  async execute(sock, msg, { from, sender }) {
    if (!owners.includes(sender)) return sock.sendMessage(from, { text: '❌ Owner only.' }, { quoted: msg })
    await sock.sendMessage(from, { text: '🔄 Restoring sessions from database...' }, { quoted: msg })
    await restoreAllSessions(createSessionViaQR)
    await sock.sendMessage(from, { text: `✅ Restored ${sessions.size} sessions.` }, { quoted: msg })
  }
}