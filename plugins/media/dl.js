const axios = require('axios')

module.exports = {
  name: 'dl',
  alias: ['download', 'video'],
  category: 'media',
  desc: 'Download videos from YouTube, Instagram, TikTok, etc.',
  async exec(sock, msg, { from, args }) {
    if (!args.length) {
      await sock.sendMessage(from, { text: '❌ *Usage:* .dl [URL]\n\n*Example:* .dl https://youtu.be/dQw4w9WgXcQ' })
      return
    }

    const url = args[0]
    
    // Send processing message
    await sock.sendMessage(from, { text: '⏳ *Downloading...* Please wait.' })

    try {
      const apiUrl = `https://batgpt.vercel.app/api/alldl?url=${encodeURIComponent(url)}`
      console.log('[DL] Fetching:', apiUrl)
      
      const response = await axios.get(apiUrl, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      })
      
      console.log('[DL] Response:', JSON.stringify(response.data, null, 2))

      if (!response.data || !response.data.success) {
        throw new Error('API returned error: ' + JSON.stringify(response.data))
      }

      const { title, videoUrl, audioUrl, platform, thumbnail } = response.data.mediaInfo || response.data

      if (!videoUrl && !audioUrl) {
        throw new Error('No download URL found')
      }

      // Prefer video, fallback to audio
      const downloadUrl = videoUrl || audioUrl
      const mediaType = videoUrl ? 'video' : 'audio'

      // Send the media
      if (mediaType === 'video') {
        await sock.sendMessage(from, {
          video: { url: downloadUrl },
          caption: `📥 *Download Complete!*\n\n📌 *Title:* ${title || 'Unknown'}\n📱 *Platform:* ${platform || 'Unknown'}\n\n> PRECIOUS-MD BOT`
        })
      } else {
        await sock.sendMessage(from, {
          audio: { url: downloadUrl },
          mimetype: 'audio/mpeg',
          fileName: `${title || 'audio'}.mp3`,
          caption: `🎵 *Download Complete!*\n\n📌 *Title:* ${title || 'Unknown'}\n📱 *Platform:* ${platform || 'Unknown'}`
        })
      }

    } catch (err) {
      console.error('[DL] Error:', err.message)
      if (err.response) {
        console.error('[DL] Response data:', err.response.data)
      }
      
      let errorMsg = '❌ *Download Failed!*\n\n'
      if (err.code === 'ECONNABORTED') {
        errorMsg += 'Request timeout. Try again.'
      } else if (err.response?.status === 500) {
        errorMsg += 'Server error. The API might be down.\nTry again later.'
      } else {
        errorMsg += `Error: ${err.message}\n\nMake sure URL is valid and supported.\n\n*Supported platforms:* YouTube, Instagram, TikTok, Facebook, Twitter`
      }
      
      await sock.sendMessage(from, { text: errorMsg })
    }
  }
}
