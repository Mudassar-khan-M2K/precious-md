const { backupSessions } = require('../../utils/backup')
const owners = ['923216046022', '923071639265', '923477262704', '923257762682']

module.exports = {
  name: 'backup',
  alias: ['manualbackup'],
  category: 'owner',
  reactEmoji: '💾',
  async execute(sock, msg, { from, sender }) {
    if (!owners.includes(sender)) return sock.sendMessage(from, { text: '❌ Owner only.' }, { quoted: msg })
    await backupSessions()
    await sock.sendMessage(from, { text: '✅ Manual backup completed.' }, { quoted: msg })
  }
}