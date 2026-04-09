module.exports = {
  name: 'dl',
  alias: [
    'download', 'vid', 'video',
    'yt', 'youtube', 'ytmp4', 'ytvideo',
    'ig', 'instagram', 'insta', 'igdl',
    'tt', 'tiktok', 'tiktokdl',
    'fb', 'facebook', 'meta', 'fbdl',
    'tw', 'twitter', 'x', 'twitdl',
    'pin', 'pinterest', 'pt', 'pindl',
    'sc', 'snapchat', 'likee', 'reddit', 'rd'
  ],
  category: 'media',
  desc: 'Download videos from YouTube, Instagram, TikTok, Facebook, Twitter, Pinterest & more',
  reactEmoji: '📥',
  execute: async (sock, msg, { from, args }) => {
    
    if (!args.length) {
      await sock.sendMessage(from, { 
        text: `❌ *Usage:* .dl [URL]\n\n*Examples:*\n🎬 .dl https://youtu.be/xxxxx\n📸 .dl https://instagram.com/p/xxxxx\n🎵 .dl https://tiktok.com/@user/video/xxxxx\n📘 .dl https://facebook.com/watch?v=xxxxx\n🐦 .dl https://twitter.com/user/status/xxxxx\n📌 .dl https://pinterest.com/pin/xxxxx` 
      })
      return
    }

    const url = args[0]
    
    // Detect platform with better emojis
    let platformEmoji = '🌐'
    let platformName = 'Media'
    
    if (url.includes('youtu.be') || url.includes('youtube.com')) {
      platformEmoji = '🎬'
      platformName = 'YouTube'
    } else if (url.includes('instagram.com')) {
      platformEmoji = '📸'
      platformName = 'Instagram'
    } else if (url.includes('tiktok.com')) {
      platformEmoji = '🎵'
      platformName = 'TikTok'
    } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
      platformEmoji = '📘'
      platformName = 'Facebook'
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      platformEmoji = '🐦'
      platformName = 'Twitter/X'
    } else if (url.includes('pinterest.com') || url.includes('pin.it')) {
      platformEmoji = '📌'
      platformName = 'Pinterest'
    } else if (url.includes('snapchat.com')) {
      platformEmoji = '👻'
      platformName = 'Snapchat'
    } else if (url.includes('likee.com')) {
      platformEmoji = '🎭'
      platformName = 'Likee'
    } else if (url.includes('reddit.com')) {
      platformEmoji = '🤖'
      platformName = 'Reddit'
    }
    
    await sock.sendMessage(from, { 
      text: `${platformEmoji} *Downloading from ${platformName}...*\n⏳ Please wait.` 
    })

    try {
      const apiUrl = `https://batgpt.vercel.app/api/alldl?url=${encodeURIComponent(url)}`
      console.log('[DL] Fetching:', apiUrl)
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      console.log('[DL] Success:', data.success)

      if (!data.success) {
        throw new Error(data.message || 'Could not fetch media')
      }

      // ✅ FIX: Get video URL from mediaInfo (not links array)
      let videoUrl = null
      let title = 'Video'
      
      if (data.mediaInfo && data.mediaInfo.videoUrl) {
        videoUrl = data.mediaInfo.videoUrl
        title = data.mediaInfo.title || `${platformName} Video`
        console.log('[DL] Found videoUrl in mediaInfo')
      } else if (data.videoUrl) {
        videoUrl = data.videoUrl
        console.log('[DL] Found videoUrl directly')
      } else if (data.links && data.links.length > 0) {
        // Fallback to links if needed
        videoUrl = data.links[0]
        console.log('[DL] Using fallback link')
      }
      
      if (!videoUrl) {
        throw new Error('No video URL found')
      }

      // Download the video as buffer
      console.log('[DL] Downloading from:', videoUrl.substring(0, 100) + '...')
      const videoResponse = await fetch(videoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      const videoBuffer = Buffer.from(await videoResponse.arrayBuffer())
      console.log('[DL] Video size:', videoBuffer.length, 'bytes')

      if (videoBuffer.length < 5000) {
        throw new Error('Downloaded file too small')
      }

      // Send as document with proper mimetype (more reliable than video)
      const mimetype = videoResponse.headers.get('content-type') || 'video/mp4'
      
      await sock.sendMessage(from, {
        document: videoBuffer,
        mimetype: mimetype,
        fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`,
        caption: `${platformEmoji} *${platformName} Download Complete!*\n\n📌 *Title:* ${title}\n📦 *Size:* ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB\n\n> PRECIOUS-MD BOT`
      })
      
      console.log('[DL] Video sent successfully!')

    } catch (err) {
      console.error('[DL] Error:', err.message)
      
      let errorMsg = `❌ *Download Failed!*\n\n`
      errorMsg += `${platformEmoji} *Platform:* ${platformName}\n`
      errorMsg += `⚠️ *Error:* ${err.message}\n\n`
      errorMsg += `*Tips:*\n`
      errorMsg += `• Make sure the URL is correct\n`
      errorMsg += `• Try a different video\n`
      errorMsg += `• Some videos may be private or deleted\n`
      
      await sock.sendMessage(from, { text: errorMsg })
    }
  }
}
