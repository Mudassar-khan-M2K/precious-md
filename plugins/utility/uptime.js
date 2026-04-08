module.exports = {
  name: 'uptime',
  alias: [],
  category: 'utility',
  reactEmoji: '⏱️',
  async execute(sock, msg, { from }) {
    const uptime = process.uptime()
    const hrs = Math.floor(uptime / 3600)
    const mins = Math.floor((uptime % 3600) / 60)
    const secs = Math.floor(uptime % 60)
    await sock.sendMessage(from, { text: `⏱️ *Bot Uptime:* ${hrs}h ${mins}m ${secs}s` }, { quoted: msg })
  }
}