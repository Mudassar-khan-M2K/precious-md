module.exports = {
  name: 'dl',
  alias: [
    'download', 'vid', 'video',
    'yt', 'youtube', 'ytmp4', 'ytvideo',
    'ig', 'instagram', 'insta', 'igdl',
    'tt', 'tiktok', 'tik tok',
    'fb', 'facebook', 'meta',
    'tw', 'twitter', 'x',
    'pin', 'pinterest', 'pt',
    'sc', 'snapchat',
    'likee', 'sharechat',
    'reddit', 'rd',
    'telegram', 'tl'
  ],
  category: 'media',
  desc: 'Download videos from YouTube, Instagram, TikTok, Facebook, Twitter, Pinterest & more',
  reactEmoji: '📥',
  execute: async (sock, msg, { from, args }) => {
    
    if (!args.length) {
      await sock.sendMessage(from, { 
        text: `❌ *Usage:* .dl [URL]\n\n*Examples:*\n📹 .dl https://youtu.be/xxxxx\n📸 .dl https://instagram.com/p/xxxxx\n🎵 .dl https://tiktok.com/@user/video/xxxxx\n📘 .dl https://facebook.com/watch?v=xxxxx\n🐦 .dl https://twitter.com/user/status/xxxxx\n📌 .dl https://pinterest.com/pin/xxxxx\n\n*Supported Platforms:*\nYouTube, Instagram, TikTok, Facebook, Twitter, Pinterest, Reddit, Likee, Snapchat & more` 
      })
      return
    }

    const url = args[0]
    
    // Detect platform for custom message
    let platformEmoji = '📥'
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
      platformName = 'Twitter'
    } else if (url.includes('pinterest.com') || url.includes('pin.it')) {
      platformEmoji = '📌'
      platformName = 'Pinterest'
    } else if (url.includes('reddit.com')) {
      platformEmoji = '🤖'
      platformName = 'Reddit'
    } else if (url.includes('likee.com')) {
      platformEmoji = '🎭'
      platformName = 'Likee'
    } else if (url.includes('snapchat.com')) {
      platformEmoji = '👻'
      platformName = 'Snapchat'
    }
    
    await sock.sendMessage(from, { 
      text: `${platformEmoji} *Downloading from ${platformName}...*\n⏳ Please wait.` 
    })

    try {
      const apiUrl = `https://batgpt.vercel.app/api/alldl?url=${encodeURIComponent(url)}`
      console.log('[DL] Fetching:', apiUrl)
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      console.log('[DL] Success:', data.success, 'Platform:', data.platform)

      if (!data.success) {
        let errorMsg = `❌ *${platformName} Download Failed!*\n\n`
        
        if (platformName === 'Instagram') {
          errorMsg += 'Instagram has strict restrictions.\nTry these alternatives:\n• Reels: Use .dl with reel URL\n• Posts: Try public Instagram downloader websites\n• Stories: Limited support'
        } else if (platformName === 'Facebook') {
          errorMsg += 'Facebook videos may require login.\nTry using "fb.watch" short URLs or public Facebook downloaders.'
        } else if (platformName === 'Twitter') {
          errorMsg += 'Twitter/X videos often work.\nTry using the direct tweet URL.'
        } else {
          errorMsg += `Error: ${data.message || 'Could not fetch media'}\n\nTry with a different URL or platform.`
        }
        
        await sock.sendMessage(from, { text: errorMsg })
        return
      }

      const downloadLinks = data.links || []
      
      if (downloadLinks.length === 0) {
        throw new Error('No download links found')
      }

      // Try each link until one works
      let downloaded = false
      for (const link of downloadLinks) {
        try {
          console.log('[DL] Trying link:', link.substring(0, 50) + '...')
          
          await sock.sendMessage(from, {
            video: { url: link },
            caption: `${platformEmoji} *${platformName} Download Complete!*\n\n📥 *Quality:* HD\n📱 *Platform:* ${platformName}\n\n> PRECIOUS-MD BOT`
          })
          downloaded = true
          break
        } catch (sendErr) {
          console.log('[DL] Link failed, trying next...')
          continue
        }
      }

      if (!downloaded) {
        // Send links as text
        let linksText = `${platformEmoji} *${platformName} Download Links*\n\n`
        downloadLinks.forEach((link, i) => {
          linksText += `${i + 1}. ${link}\n`
        })
        linksText += `\n⚠️ Couldn't send as video. Copy links manually.`
        
        await sock.sendMessage(from, { text: linksText })
      }

    } catch (err) {
      console.error('[DL] Error:', err)
      
      let errorMsg = `❌ *Download Failed!*\n\n`
      errorMsg += `Platform: ${platformName}\n`
      errorMsg += `Error: ${err.message}\n\n`
      errorMsg += `*Tips:*\n`
      errorMsg += `• Check if URL is correct\n`
      errorMsg += `• Try using the original video link\n`
      errorMsg += `• Some platforms have restrictions\n\n`
      errorMsg += `*Supported platforms:*\nYouTube, TikTok, Instagram, Facebook, Twitter, Pinterest, Reddit, Likee`
      
      await sock.sendMessage(from, { text: errorMsg })
    }
  }
}
