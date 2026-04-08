const axios = require('axios')

module.exports = {
  name: 'summary',
  alias: ['summarize'],
  category: 'ai',
  reactEmoji: '📝',
  async execute(sock, msg, { from, args }) {
    const text = args.join(' ')
    if (!text) return sock.sendMessage(from, { text: '❌ Usage: .summary <long text>' }, { quoted: msg })
    await sock.sendMessage(from, { text: '📝 Summarizing...' }, { quoted: msg })
    try {
      // Using free Gemini API
      const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY', {
        contents: [{ parts: [{ text: `Summarize this: ${text}` }] }]
      })
      const summary = response.data.candidates[0].content.parts[0].text
      await sock.sendMessage(from, { text: `📄 *Summary:* ${summary}` }, { quoted: msg })
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ Summary failed: ${err.message}` }, { quoted: msg })
    }
  }
}