module.exports = {
  name: 'repo',
  alias: ['github', 'source', 'code'],
  category: 'utility',
  reactEmoji: '📚',
  desc: 'Get bot GitHub repository link',
  async execute(sock, msg, { from }) {
    
    const repoText = `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃      *📚 PRECIOUS-MD BOT - GitHub*       
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

*📦 Repository:* precious-md
*👤 Owner:* Mudassar-khan-M2K
*⭐ Stars:* ⭐ Star to support!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*🚀 Features Included:*
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ✅ Multi-Device WhatsApp Bot    ┃
┃ ✅ 50+ Working Commands         ┃
┃ ✅ Group Moderation Tools       ┃
┃ ✅ Media Downloader (YT, IG, FB)┃
┃ ✅ Auto Status Viewer 🍂        ┃
┃ ✅ Anti-Link Protection         ┃
┃ ✅ Welcome/Goodbye Messages     ┃
┃ ✅ AI Chat & Image Generation   ┃
┃ ✅ Games & Fun Commands         ┃
┃ ✅ Owner Control Panel          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*📌 How to Deploy Your Own Bot:*

1️⃣ *Star & Fork* ⭐
   Visit the repo and give a star

2️⃣ *Deploy to Heroku*
   Click deploy button or use CLI

3️⃣ *Set Environment Variables*
   • MONGODB_URI
   • OWNER_NUMBER
   • ADMIN_PASSWORD

4️⃣ *Connect WhatsApp*
   Scan QR code from dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*🔗 Quick Links:*
📦 Repository:
https://github.com/Mudassar-khan-M2K/precious-md

🐛 Report Issues:
https://github.com/Mudassar-khan-M2K/precious-md/issues

💬 Support:
https://github.com/Mudassar-khan-M2K

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> *PRECIOUS-MD v3.0* | Made with ❤️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

    await sock.sendMessage(from, { text: repoText }, { quoted: msg })
  }
}
