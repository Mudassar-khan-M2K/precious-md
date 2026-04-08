const { commands, categories } = require('../_loader')

module.exports = {
  name: 'menu',
  alias: ['help', 'commands', 'cmdlist'],
  category: 'utility',
  desc: 'Show all available commands',
  async exec(sock, msg, { from, sender, args }) {
    
    let menuText = `╭━━━━━━━━━━━━━━━━━╮\n`
    menuText += `┃ *🌸 PRECIOUS-MD BOT* ┃\n`
    menuText += `╰━━━━━━━━━━━━━━━━━╯\n\n`
    menuText += `*🤖 Status:* ✅ Active\n`
    menuText += `*📊 Total Commands:* ${commands.size}\n`
    menuText += `*⚡ Prefix:* .\n\n`
    
    const cats = [...categories.keys()]
    
    for (const cat of cats) {
      menuText += `\n┏━━━ *${cat.toUpperCase()}* ━━━┓\n`
      const cmds = categories.get(cat)
      for (const cmd of cmds) {
        const cmdData = commands.get(cmd)
        if (cmdData && !cmdData.isAlias) {
          menuText += `┃  .${cmd}\n`
        }
      }
      menuText += `┗━━━━━━━━━━━━━━━━━┛\n`
    }
    
    menuText += `\n*📌 Example:* .ping\n`
    menuText += `*💡 Info:* .alive | .about | .status\n`
    
    await sock.sendMessage(from, { text: menuText })
  }
      }
