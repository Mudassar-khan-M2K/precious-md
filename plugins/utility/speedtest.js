module.exports = {
  name: 'speedtest',
  alias: ['speed'],
  category: 'utility',
  reactEmoji: '📡',
  async execute(sock, msg, { from }) {
    await sock.sendMessage(from, { text: '📡 Running speedtest... (simulated)\n⬇️ Download: 48 Mbps\n⬆️ Upload: 12 Mbps\n⏱️ Ping: 24 ms' }, { quoted: msg })
  }
}