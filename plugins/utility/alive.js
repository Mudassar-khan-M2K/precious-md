module.exports = {
  name: 'alive',
  alias: ['health'],
  category: 'utility',
  reactEmoji: '✅',
  async execute(sock, msg, { from, sessionNumber, allSessions }) {
    const uptime = process.uptime()
    const hrs = Math.floor(uptime / 3600)
    const mins = Math.floor((uptime % 3600) / 60)
    const secs = Math.floor(uptime % 60)
    const text = `✅ *PRECIOUS-MD is ALIVE*\n⏱️ Uptime: ${hrs}h ${mins}m ${secs}s\n👥 Active sessions: ${allSessions.size}\n🤖 Bot session: +${sessionNumber}`
    await sock.sendMessage(from, { text }, { quoted: msg })
  }
}