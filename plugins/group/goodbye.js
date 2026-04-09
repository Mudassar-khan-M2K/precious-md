const goodbyeSettings = new Map()

module.exports = {
  name: 'goodbye',
  alias: ['leftmsg', 'bye'],
  category: 'group',
  reactEmoji: '👋',
  desc: 'Toggle goodbye messages when members leave',
  async execute(sock, msg, { from, args }) {
    if (!from.endsWith('@g.us')) return
    
    const action = args[0]?.toLowerCase()
    
    if (action === 'on') {
      goodbyeSettings.set(from, true)
      await sock.sendMessage(from, { text: '👋 *Goodbye Message Enabled*\n\nWhen members leave, a goodbye message will be sent!' })
    } else if (action === 'off') {
      goodbyeSettings.set(from, false)
      await sock.sendMessage(from, { text: '👋 *Goodbye Message Disabled*' })
    } else {
      const status = goodbyeSettings.get(from) ? '✅ ON' : '❌ OFF'
      await sock.sendMessage(from, { text: `👋 *Goodbye Status:* ${status}\n\nUsage: .goodbye on/off` })
    }
  },
  isEnabled: (groupId) => goodbyeSettings.get(groupId) || false
}
