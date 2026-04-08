module.exports = {
  name: 'about',
  alias: ['info'],
  category: 'utility',
  reactEmoji: 'ℹ️',
  async execute(sock, msg, { from }) {
    const text = `🌸 *PRECIOUS-MD 🍂*\n\n🤖 Multi-session WhatsApp bot\n📥 Media downloader (YT, TT, IG, PT, FB, X)\n❤️ Channel reactions & polls\n👁️ Auto status view\n🔐 QR & Pairing login\n📦 200+ commands\n\n👨‍💻 Developer: Mudassar Khan\n📍 Mianwali, Pakistan`
    await sock.sendMessage(from, { text }, { quoted: msg })
  }
}