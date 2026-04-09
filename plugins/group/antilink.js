const warnMap = new Map()

module.exports = {
  name: 'antilink',
  alias: ['linkprotect'],
  category: 'group',
  reactEmoji: '🔗',
  desc: 'Protect group from links (3 warns = kick)',
  async execute(sock, msg, { from, args, sender }) {
    if (!from.endsWith('@g.us')) return
    
    const action = args[0]?.toLowerCase()
    const groupSettings = new Map()
    
    if (action === 'on') {
      groupSettings.set(from, true)
      await sock.sendMessage(from, { text: '🔗 *Anti-Link Enabled*\n\nAnyone sending links will be warned. 3 warnings = kicked!' })
    } else if (action === 'off') {
      groupSettings.set(from, false)
      warnMap.delete(from)
      await sock.sendMessage(from, { text: '🔗 *Anti-Link Disabled*' })
    } else {
      const status = groupSettings.get(from) ? '✅ ON' : '❌ OFF'
      await sock.sendMessage(from, { text: `🔗 *Anti-Link Status:* ${status}\n\nUsage: .antilink on/off` })
    }
  },
  checkAndWarn: async (sock, from, sender, message) => {
    const groupSettings = new Map()
    if (!groupSettings.get(from)) return false
    
    const linkPatterns = [/https?:\/\//i, /www\./i, /\.com/i, /\.net/i, /\.org/i]
    const hasLink = linkPatterns.some(p => p.test(message))
    
    if (!hasLink) return false
    
    let warns = warnMap.get(from)?.get(sender) || 0
    warns++
    
    if (!warnMap.has(from)) warnMap.set(from, new Map())
    warnMap.get(from).set(sender, warns)
    
    if (warns >= 3) {
      await sock.sendMessage(from, { text: `⚠️ @${sender.split('@')[0]} has been kicked for sending links after 3 warnings!`, mentions: [sender] })
      await sock.groupParticipantsUpdate(from, [sender], 'remove')
      warnMap.get(from).delete(sender)
    } else {
      await sock.sendMessage(from, { text: `⚠️ *Warning ${warns}/3* @${sender.split('@')[0]}\nNo links allowed in this group!`, mentions: [sender] })
    }
    return true
  }
}
