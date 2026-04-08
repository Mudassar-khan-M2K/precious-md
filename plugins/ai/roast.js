const roasts = [
  "You're like a software update. I see you, but I ignore you.",
  "I'd agree with you, but then we'd both be wrong.",
  "You bring everyone so much joy… when you leave.",
  "Your secrets are safe with me. I wasn't listening anyway."
]

module.exports = {
  name: 'roast',
  alias: [],
  category: 'ai',
  reactEmoji: '🔥',
  async execute(sock, msg, { from, args }) {
    let target = args[0] || 'someone'
    const roast = roasts[Math.floor(Math.random() * roasts.length)]
    await sock.sendMessage(from, { text: `🔥 *Roast for ${target}:* ${roast}` }, { quoted: msg })
  }
}