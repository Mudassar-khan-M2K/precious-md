const { sessions } = require('../../auth/session-store')
let cmdCount = 0
function incrementCmdCount() { cmdCount++ }

module.exports = {
  name: 'status',
  alias: ['stats'],
  category: 'utility',
  reactEmoji: '📈',
  async execute(sock, msg, { from }) {
    const uptime = process.uptime()
    const hrs = Math.floor(uptime / 3600)
    const mins = Math.floor((uptime % 3600) / 60)
    const text = `📊 *Bot Status*\n👥 Sessions: ${sessions.size}\n⚙️ Commands run: ${cmdCount}\n⏱️ Uptime: ${hrs}h ${mins}m`
    await sock.sendMessage(from, { text }, { quoted: msg })
  },
  incrementCmdCount
}