const autoReactMap = new Map()

module.exports = {
  name: 'autoreact',
  alias: [],
  category: 'automation',
  reactEmoji: '🤖',
  async execute(sock, msg, { from, args, sessionNumber }) {
    const emoji = args[0]
    if (!emoji) {
      const current = autoReactMap.get(sessionNumber) || 'off'
      return sock.sendMessage(from, { text: `🤖 Autoreact: ${current}\nUsage: .autoreact <emoji> or .autoreact off` }, { quoted: msg })
    }
    if (emoji.toLowerCase() === 'off') {
      autoReactMap.delete(sessionNumber)
      await sock.sendMessage(from, { text: '🤖 Autoreact disabled.' }, { quoted: msg })
    } else {
      autoReactMap.set(sessionNumber, emoji)
      await sock.sendMessage(from, { text: `✅ Autoreact set to ${emoji}` }, { quoted: msg })
    }
  },
  getAutoReact: (sessionNumber) => autoReactMap.get(sessionNumber)
}