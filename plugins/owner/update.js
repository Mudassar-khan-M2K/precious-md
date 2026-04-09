const { exec } = require('child_process')

module.exports = {
  name: 'update',
  alias: ['gitpull', 'pull', 'upgrade'],
  category: 'owner',
  reactEmoji: '🔄',
  desc: 'Update bot from GitHub (Password: precious)',
  async execute(sock, msg, { from, args }) {
    const password = args[0]
    
    if (!password) {
      return sock.sendMessage(from, { 
        text: '🔐 *Password Required*\n\n📌 *Usage:* .update [password]\n\n*Example:* .update pass  _Main ne password ni dena baboo_ \n\n⚠️ This will pull latest updates from GitHub.' 
      }, { quoted: msg })
    }
    
    if (password !== 'preciousmk') {
      return sock.sendMessage(from, { 
        text: '❌ *Wrong Password!*\n\nAccess denied.' 
      }, { quoted: msg })
    }
    
    await sock.sendMessage(from, { 
      text: '🔄 *Pulling latest updates from GitHub...*\n⏳ Please wait...' 
    }, { quoted: msg })
    
    exec('git pull', (err, stdout, stderr) => {
      if (err) {
        console.error('Update error:', err)
        return sock.sendMessage(from, { 
          text: `❌ *Update Failed*\n\nError: ${err.message}` 
        }, { quoted: msg })
      }
      
      let response = '✅ *Update Successful!*\n\n'
      
      if (stdout.includes('Already up to date')) {
        response += '📌 Bot is already up to date!\n\nNo changes were pulled.'
      } else {
        response += `📦 *Changes pulled:*\n\`\`\`${stdout.slice(0, 500)}\`\`\``
        response += `\n\n⚠️ *Restart required!*\nUse .restart to apply updates.`
      }
      
      sock.sendMessage(from, { text: response }, { quoted: msg })
    })
  }
}
