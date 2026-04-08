const owners = ['923216046022', '923071639265', '923477262704', '923257762682']

module.exports = {
  name: 'owner',
  alias: ['creator'],
  category: 'utility',
  reactEmoji: '👑',
  async execute(sock, msg, { from }) {
    const text = `👑 *Bot Owner:*\n${owners.map(o => `+${o}`).join('\n')}\n\n_Developed by Mudassar Khan_`
    await sock.sendMessage(from, { text }, { quoted: msg })
  }
}