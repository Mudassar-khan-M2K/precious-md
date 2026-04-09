module.exports = {
  name: 'dl',
  alias: ['download', 'video'],
  category: 'media',
  desc: 'Download videos from YouTube, Instagram, TikTok, etc.',
  execute: async (sock, msg, { from, args }) => {  // Changed from exec to execute
    
    if (!args.length) {
      await sock.sendMessage(from, { text: '❌ *Usage:* .dl [URL]\n\n*Example:* .dl https://youtu.be/dQw4w9WgXcQ' })
      return
    }

    const url = args[0]
    
    await sock.sendMessage(from, { text: '⏳ *Downloading...* Please wait.' })

    try {
      const apiUrl = `https://batgpt.vercel.app/api/alldl?url=${encodeURIComponent(url)}`
      console.log('[DL] Fetching:', apiUrl)
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      console.log('[DL] Response:', JSON.stringify(data, null, 2))

      if (!data || !data.success) {
        throw new Error('API returned error')
      }

      const mediaInfo = data.mediaInfo || data
      const { title, videoUrl, audioUrl, platform } = mediaInfo

      const downloadUrl = videoUrl || audioUrl
      
      if (!downloadUrl) {
        throw new Error('No download URL found')
      }

      await sock.sendMessage(from, {
        video: { url: downloadUrl },
        caption: `📥 *Download Complete!*\n\n📌 *Title:* ${title || 'Video'}\n📱 *Platform:* ${platform || 'Unknown'}\n\n> PRECIOUS-MD BOT`
      })

    } catch (err) {
      console.error('[DL] Error:', err)
      await sock.sendMessage(from, { text: `❌ *Error:* ${err.message}\n\nTry again with a different URL.` })
    }
  }
}
