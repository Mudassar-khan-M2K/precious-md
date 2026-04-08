const axios = require('axios')

module.exports = {
  name: 'ai',
  alias: ['gpt', 'chat'],
  category: 'ai',
  reactEmoji: '🤖',
  async execute(sock, msg, { from, args }) {
    const query = args.join(' ')
    if (!query) return sock.sendMessage(from, { text: '❌ Usage: .ai <question>' }, { quoted: msg })
    await sock.sendMessage(from, { text: '🤔 Thinking...' }, { quoted: msg })
    try {
      // Free Gemini API (replace with your key)
      const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY', {
        contents: [{ parts: [{ text: query }] }]
      })
      const reply = response.data.candidates[0].content.parts[0].text
      await sock.sendMessage(from, { text: `🤖 *AI:* ${reply}` }, { quoted: msg })
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ AI error: ${err.message}` }, { quoted: msg })
    }
  }
}