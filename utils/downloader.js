const fs = require('fs-extra')
const path = require('path')
const ytdlp = require('yt-dlp-exec')

const TMP_DIR = path.join(__dirname, '..', 'tmp')
fs.ensureDirSync(TMP_DIR)

function detectPlatform(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('tiktok.com')) return 'tiktok'
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('pinterest.com') || url.includes('pin.it')) return 'pinterest'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter'
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook'
  return null
}

async function downloadMedia(url, platform) {
  const outputTemplate = path.join(TMP_DIR, '%(title).50s_%(id)s.%(ext)s')
  const options = {
    output: outputTemplate,
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: ['User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36']
  }
  if (platform === 'youtube') options.format = 'bestvideo+bestaudio/best'
  else if (platform === 'tiktok') options.format = 'mp4'
  else if (platform === 'instagram') options.format = 'mp4'
  else if (platform === 'pinterest') options.format = 'jpg'
  else options.format = 'best'
  
  const result = await ytdlp(url, options)
  let filePath = result.output.split('\n').pop().trim()
  if (!filePath) filePath = path.join(TMP_DIR, `${Date.now()}.mp4`)
  const title = path.basename(filePath).replace(/\.[^.]+$/, '')
  const isVideo = ['.mp4', '.mkv', '.webm'].some(ext => filePath.endsWith(ext))
  return { filePath, title, isVideo }
}

async function downloadYouTubeMP3(url) {
  const outputTemplate = path.join(TMP_DIR, '%(title).50s_%(id)s.%(ext)s')
  const options = {
    output: outputTemplate,
    extractAudio: true,
    audioFormat: 'mp3',
    audioQuality: 0,
    noCheckCertificates: true,
    noWarnings: true
  }
  const result = await ytdlp(url, options)
  const filePath = result.output.split('\n').pop().trim()
  const title = path.basename(filePath).replace('.mp3', '')
  return { filePath, title, duration: 0 }
}

async function searchAndDownloadAudio(query) {
  const searchUrl = `ytsearch1:${query}`
  const outputTemplate = path.join(TMP_DIR, '%(title).50s_%(id)s.%(ext)s')
  const options = {
    output: outputTemplate,
    extractAudio: true,
    audioFormat: 'mp3',
    audioQuality: 0,
    noCheckCertificates: true,
    noWarnings: true
  }
  const result = await ytdlp(searchUrl, options)
  const filePath = result.output.split('\n').pop().trim()
  const title = path.basename(filePath).replace('.mp3', '')
  return { filePath, title, duration: 0 }
}

module.exports = { detectPlatform, downloadMedia, downloadYouTubeMP3, searchAndDownloadAudio }