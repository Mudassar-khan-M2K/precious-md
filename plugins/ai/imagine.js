const axios = require('axios')

module.exports = {
  name: 'imagine',
  alias: ['aiimg', 'generate'],
  category: 'ai',
  reactEmoji: '🎨',
  async execute(sock, msg, { from, args }) {
    const prompt = args.join(' ')
    if (!prompt) return sock.sendMessage(from, { text: '❌ Usage: .imagine <description>' }, { quoted: msg })
    await sock.sendMessage(from, { text: '🎨 Generating image...' }, { quoted: msg })
    try {
      // Placeholder – use a free image generation API or replicate
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
      await sock.sendMessage(from, { image: { url: imageUrl }, caption: `🎨 *${prompt}*` }, { quoted: msg })
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ Image generation failed: ${err.message}` }, { quoted: msg })
    }
  }
}