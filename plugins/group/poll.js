module.exports = {
  name: 'poll',
  alias: ['createpoll'],
  category: 'group',
  reactEmoji: '📊',
  async execute(sock, msg, { from, args }) {
    const question = args.join(' ')
    if (!question) return sock.sendMessage(from, { text: 'Usage: .poll "Question? option1, option2"' }, { quoted: msg })
    const match = question.match(/^"(.+)"\s+(.+)$/)
    if (!match) return sock.sendMessage(from, { text: 'Format: .poll "Question?" option1, option2' }, { quoted: msg })
    const [, q, opts] = match
    const options = opts.split(',').map(o => o.trim())
    await sock.sendMessage(from, { poll: { name: q, values: options } }, { quoted: msg })
  }
}