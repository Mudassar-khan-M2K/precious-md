let autoViewActive = false
let autoViewSessions = new Set()

module.exports = {
  name: 'autoview',
  alias: ['viewstatus'],
  category: 'automation',
  reactEmoji: '👁️',
  async execute(sock, msg, { from, args, sessionNumber }) {
    const action = args[0]?.toLowerCase()
    if (action === 'on') {
      autoViewSessions.add(sessionNumber)
      if (!autoViewActive) {
        autoViewActive = true
        // Status listener attached globally once (to avoid multiple listeners)
        // In production, attach once per session. Simplified here.
        sock.ev.on('messages.upsert', async ({ messages }) => {
          for (const m of messages) {
            if (m.message?.protocolMessage?.type === 7) { // status broadcast
              await sock.readMessages([m.key])
              await sock.sendMessage(m.key.remoteJid, { react: { text: '❤️', key: m.key } })
            }
          }
        })
      }
      await sock.sendMessage(from, { text: '👁️ Auto-view & like enabled for statuses.' }, { quoted: msg })
    } else if (action === 'off') {
      autoViewSessions.delete(sessionNumber)
      await sock.sendMessage(from, { text: '👁️ Auto-view disabled.' }, { quoted: msg })
    } else {
      await sock.sendMessage(from, { text: 'Usage: `.autoview on` or `.autoview off`' }, { quoted: msg })
    }
  }
}