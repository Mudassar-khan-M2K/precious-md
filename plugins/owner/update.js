const { exec } = require('child_process')
const owners = ['923216046022', '923071639265', '923477262704', '923257762682']

module.exports = {
  name: 'update',
  alias: ['gitpull'],
  category: 'owner',
  reactEmoji: '🔄',
  async execute(sock, msg, { from, sender }) {
    if (!owners.includes(sender)) return sock.sendMessage(from, { text: '❌ Owner only.' }, { quoted: msg })
    await sock.sendMessage(from, { text: '🔄 Pulling latest updates from GitHub...' }, { quoted: msg })
    exec('git pull', (err, stdout, stderr) => {
      if (err) return sock.sendMessage(from, { text: `❌ Update failed: ${err.message}` }, { quoted: msg })
      sock.sendMessage(from, { text: `✅ Updated:\n${stdout}` }, { quoted: msg })
    })
  }
}