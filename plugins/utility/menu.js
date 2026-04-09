const fs = require('fs')
const path = require('path')

module.exports = {
  name: 'menu',
  alias: ['help', 'cmds'],
  category: 'utility',
  reactEmoji: '🌸',
  desc: 'Show bot menu with image',
  async execute(sock, msg, { from }) {
    
    const menuText = `╭━━━━━━━━━━━━━━━━━━━━━━╮
┃   *🌸 PRECIOUS-MD BOT*   
┃   *🤖 Version:* 3.0.0
╰━━━━━━━━━━━━━━━━━━━━━━╯

*⚡ Prefix:* . (dot)
*📊 Status:* ✅ Active
*🎯 Commands:* 50+

┏━━━━━━━ *📱 BASIC* ━━━━━━━┓
┃ .ping      - Check latency
┃ .alive     - Bot status  
┃ .menu      - Show menu
┃ .about     - Bot info
┃ .owner     - Owner contact
┃ .repo      - GitHub repo
┃ .status    - Bot stats
┗━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━ *🎵 DOWNLOADERS* ━━━━━━━┓
┃ .dl        - Any platform
┃ .yt        - YouTube video
┃ .ytmp3     - YouTube MP3
┃ .ig        - Instagram video
┃ .tt        - TikTok video
┃ .fb        - Facebook video
┃ .tw        - Twitter video
┃ .pin       - Pinterest video
┃ .sc        - Snapchat video
┃ .likee     - Likee video
┃ .reddit    - Reddit video
┗━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━ *🎨 MEDIA* ━━━━━━━┓
┃ .sticker   - Image to sticker
┃ .toimg     - Sticker to image
┃ .tourl     - Upload to URL
┃ .img       - Google images
┗━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━ *👥 GROUP* ━━━━━━━┓
┃ .tagall    - Mention all
┃ .welcome   - Toggle welcome
┃ .goodbye   - Toggle goodbye
┃ .antilink  - Toggle anti-link
┃ .kick      - Remove member
┃ .add       - Add member
┃ .promote   - Make admin
┃ .demote    - Remove admin
┃ .mute      - Mute group
┃ .poll      - Create poll
┃ .warn      - Warn member
┗━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━ *🤖 AI* ━━━━━━━┓
┃ .chat      - ChatGPT AI
┃ .imagine   - Generate image
┃ .tts       - Text to speech
┃ .translate - Translate text
┃ .roast     - Roast someone
┃ .summary   - Summarize text
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━ *🎮 GAMES* ━━━━━━━┓
┃ .dice      - Roll dice
┃ .quiz      - Play quiz
┃ .truth     - Truth question
┃ .dare      - Dare challenge
┃ .rps       - Rock paper scissors
┃ .tictactoe - TicTacToe
┃ .hangman   - Hangman game
┃ .8ball     - Magic 8 ball
┃ .coin      - Flip coin
┗━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━ *⚙️ AUTOMATION* ━━━━━━━┓
┃ .autoreact  - Auto reaction
┃ .autorespond- Auto response
┃ .autoview   - Auto status view
┃ .reminder   - Set reminder
┗━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━ *👑 OWNER* ━━━━━━━┓
┃ .broadcast - Broadcast message
┃ .sessions  - List sessions
┃ .restart   - Restart bot
┃ .logs      - View logs
┃ .update    - Update bot
┃ .backup    - Backup data
┗━━━━━━━━━━━━━━━━━━━━━━━┛

━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Example:* .ping
💡 *Download:* .dl [URL]
🎵 *Audio:* .ytmp3 [URL]
📦 *PRECIOUS-MD v3.0*
━━━━━━━━━━━━━━━━━━━━━━━━
> BY M U D A S S A R `

    // Try to send with image
    const imagePath = path.join(__dirname, '../../audio/menu.png')
    
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath)
      await sock.sendMessage(from, {
        image: imageBuffer,
        caption: menuText
      })
    } else {
      // Send without image if file not found
      await sock.sendMessage(from, { text: menuText })
    }
  }
}
