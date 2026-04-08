module.exports = {
  name: 'ping',
  alias: ['pong'],
  category: 'utility',
  reactEmoji: '✅',
  async execute(sock, msg, { from }) {
    const start = Date.now()
    await sock.sendMessage(from, { text: '🏓 Pinging...' }, { quoted: msg })
    const ms = Date.now() - start
    await sock.sendMessage(from, { text: `🏓 *Pong!*\nLatency: *${ms}ms*` }, { quoted: msg })
  }
}