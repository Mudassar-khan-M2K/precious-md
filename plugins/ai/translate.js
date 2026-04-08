const axios = require('axios')

module.exports = {
  name: 'translate',
  alias: ['tr'],
  category: 'ai',
  reactEmoji: '🌐',
  async execute(sock, msg, { from, args }) {
    const text = args.join(' ')
    if (!text) return sock.sendMessage(from, { text: '❌ Usage: .translate <text>' }, { quoted: msg })
    await sock.sendMessage(from, { text: '🌐 Translating...' }, { quoted: msg })
    try {
      // Free translation API (LibreTranslate)
      const response = await axios.post('https://translate.argosopentech.com/translate', {
        q: text,
        source: 'auto',
        target: 'en'
      })
      const translated = response.data.translatedText
      await sock.sendMessage(from, { text: `🌐 *Translation:* ${translated}` }, { quoted: msg })
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ Translation failed: ${err.message}` }, { quoted: msg })
    }
  }
}