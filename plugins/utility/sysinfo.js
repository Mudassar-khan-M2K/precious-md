const os = require('os')

module.exports = {
  name: 'sysinfo',
  alias: ['system'],
  category: 'utility',
  reactEmoji: '🖥️',
  async execute(sock, msg, { from }) {
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
    const cpuCount = os.cpus().length
    const text = `🖥️ *System Info*\n🧠 RAM: ${freeMem}GB / ${totalMem}GB\n⚙️ CPU Cores: ${cpuCount}\n📀 Platform: ${os.platform()}\n🕒 Uptime: ${(os.uptime() / 3600).toFixed(1)} hours`
    await sock.sendMessage(from, { text }, { quoted: msg })
  }
}