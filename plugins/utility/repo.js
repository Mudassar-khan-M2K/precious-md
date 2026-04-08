module.exports = {
  name: 'repo',
  alias: ['github'],
  category: 'utility',
  reactEmoji: '📚',
  async execute(sock, msg, { from }) {
    await sock.sendMessage(from, { text: '📦 *GitHub Repository:*\nhttps://github.com/Mudassar-khan-M2K/precious-md' }, { quoted: msg })
  }
}