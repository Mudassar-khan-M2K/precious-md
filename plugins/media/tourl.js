const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')

module.exports = {
  name: 'tourl',
  alias: ['upload'],
  category: 'media',
  reactEmoji: '🔗',
  async execute(sock, msg, { from }) {
    const mediaMsg = msg.message?.imageMessage || msg.message?.videoMessage || msg.message?.documentMessage
    if (!mediaMsg) {
      return sock.sendMessage(from, { text: '❌ Reply to an image/video/file with .tourl' }, { quoted: msg })
    }
    const buffer = await sock.downloadMediaMessage(msg)
    const form = new FormData()
    form.append('file', buffer, { filename: 'upload' })
    const res = await axios.post('https://tmp.ninja/api.php?action=upload', form, { headers: form.getHeaders() })
    const url = res.data.files[0].url
    await sock.sendMessage(from, { text: `🔗 *Uploaded URL:* ${url}` }, { quoted: msg })
  }
}