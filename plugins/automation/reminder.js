const { connectDB } = require('../../database')

module.exports = {
  name: 'reminder',
  alias: ['remind'],
  category: 'automation',
  reactEmoji: '⏰',
  async execute(sock, msg, { from, args, sender }) {
    const time = parseInt(args[0])
    const message = args.slice(1).join(' ')
    if (!time || isNaN(time) || !message) {
      return sock.sendMessage(from, { text: 'Usage: .reminder <seconds> <message>' }, { quoted: msg })
    }
    const db = await connectDB()
    const remindAt = Date.now() + time * 1000
    await db.collection('reminders').insertOne({
      jid: from,
      user: sender,
      message,
      remindAt,
      done: false
    })
    await sock.sendMessage(from, { text: `⏰ Reminder set for ${time} seconds.` }, { quoted: msg })
    // In production, run a cron job to check reminders
  }
}