const axios = require('axios')
const { sendLoadingMessage } = require('../../utils/message-helper')

module.exports = {
  name: 'img',
  alias: ['image'],
  category: 'media',
  reactEmoji: '🖼️',
  async execute(sock, msg, { from, args }) {
    const query = args.join(' ')
    if (!query) return sock.sendMessage(from, { text: '❌ Usage: `.img <search query>`' }, { quoted: msg })
    const loading = await sendLoadingMessage(sock, from, `Searching images for "${query}"...`)
    try {
      // Using free unsplash API (no key required for demo, but limited)
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&client_id=YOUR_UNSPLASH_ACCESS_KEY`
      // For simplicity, we'll use a placeholder. Replace with actual key later.
      // Since Unsplash requires a key, we'll use a free placeholder API.
      const fallbackUrl = `https://source.unsplash.com/featured/400x300?${encodeURIComponent(query)}`
      for (let i = 0; i < 5; i++) {
        await sock.sendMessage(from, { image: { url: fallbackUrl }, caption: `🔍 ${query}` }, { quoted: msg })
        await new Promise(r => setTimeout(r, 500))
      }
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ ${err.message}` }, { quoted: msg })
    }
    if (loading) await sock.sendMessage(from, { delete: loading.key })
  }
}