const autoReactMap = new Map()

module.exports = {
  name: 'autoreact',
  alias: ['autoreaction', 'ar'],
  category: 'automation',
  reactEmoji: '🤖',
  desc: 'Auto react to messages with custom emoji',
  async execute(sock, msg, { from, args, sessionNumber }) {
    const emoji = args[0]
    if (!emoji) {
      const current = autoReactMap.get(sessionNumber) || '❌ Disabled'
      return sock.sendMessage(from, { text: `🤖 *AutoReact Status*\n\nCurrent: ${current}\n\n*Usage:*\n.autoreact 🍂- Set reaction\n.autoreact off - Disable` }, { quoted: msg })
    }
    
    if (emoji.toLowerCase() === 'off') {
      autoReactMap.delete(sessionNumber)
      await sock.sendMessage(from, { text: '🤖 *AutoReact Disabled* ✅\n\nWill no longer react to messages.' }, { quoted: msg })
    } else {
      autoReactMap.set(sessionNumber, emoji)
      await sock.sendMessage(from, { text: `✅ *AutoReact Enabled*\n\nReaction: ${emoji}\n\nI will react to all messages with ${emoji}` }, { quoted: msg })
    }
  },
  getAutoReact: (sessionNumber) => autoReactMap.get(sessionNumber)
}
