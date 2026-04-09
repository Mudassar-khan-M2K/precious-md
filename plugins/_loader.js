const fs = require('fs')
const path = require('path')
const { sessions } = require('../auth/qr')
const { reactToMessage, sendOwnerMentionAudio } = require('../utils/message-helper')
const { isRateLimited } = require('../utils/rate-limit')
const logger = require('../utils/logger')

const commands = new Map()
const categories = new Map()

function loadPlugins() {
  const categoriesDir = __dirname
  const dirs = fs.readdirSync(categoriesDir).filter(f => 
    fs.statSync(path.join(categoriesDir, f)).isDirectory() && f !== '_loader.js'
  )
  
  for (const cat of dirs) {
    const catPath = path.join(categoriesDir, cat)
    const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'))
    
    for (const file of files) {
      try {
        const plugin = require(path.join(catPath, file))
        
        if (plugin.name) {
          commands.set(plugin.name, { ...plugin, category: cat })
          
          if (plugin.alias) {
            for (const a of plugin.alias) {
              commands.set(a, { ...plugin, category: cat, isAlias: true })
            }
          }
          
          if (!categories.has(cat)) categories.set(cat, [])
          categories.get(cat).push(plugin.name)
          logger.info(`[PLUGIN] Loaded: ${cat}/${plugin.name}`)
        }
      } catch (err) {
        logger.error(`[PLUGIN] Failed to load ${cat}/${file}:`, err.message)
      }
    }
  }
  
  logger.info(`[PLUGIN] Total commands loaded: ${commands.size}`)
}

async function handleIncomingMessage(sock, msg, sessionMap) {
  try {
    // Extract message text
    const body =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      ''
    
    const from = msg.key.remoteJid
    const sender = (msg.key.participant || msg.key.remoteJid || '').replace('@s.whatsapp.net', '')
    
    // ✅ CHECK FOR MENTIONS - Send audio when bot is mentioned (only in groups)
    try {
      const botNumber = sock.user.id.split(':')[0]
      const mentionedJids = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
      const isMentioned = body.includes(`@${botNumber}`) || mentionedJids.includes(`${botNumber}@s.whatsapp.net`)
      
      if (isMentioned && from.endsWith('@g.us')) {
        const mention = require('../plugins/automation/mention')
        if (mention.handleMention) {
          await mention.handleMention(sock, msg, from, sender, botNumber)
        }
      }
    } catch (err) {
      console.log('[MENTION] Error:', err.message)
    }
    
    // ✅ AutoReact feature (reacts to ALL messages, even non-commands)
    try {
      const sessionNumber = sessionMap ? [...sessionMap.keys()][0] : null
      if (sessionNumber) {
        const autoreact = require('../plugins/automation/autoreact')
        const reactEmoji = autoreact.getAutoReact && autoreact.getAutoReact(sessionNumber)
        
        if (reactEmoji && reactEmoji !== 'off') {
          await sock.sendMessage(from, { 
            react: { 
              text: reactEmoji, 
              key: msg.key 
            } 
          }).catch(err => console.log('AutoReact error:', err.message))
        }
      }
    } catch (err) {
      // Silent fail for autoreact
    }
    
    // Only respond to messages starting with .
    if (!body.startsWith('.')) return

    const parts = body.trim().split(/\s+/)
    let cmdName = parts[0].toLowerCase().slice(1)
    
    // Get command
    const command = commands.get(cmdName)
    if (!command) return

    // Rate limiting
    if (isRateLimited(sender)) {
      await sock.sendMessage(from, { text: '⏳ *Slow down!* Please wait a few seconds.' }, { quoted: msg })
      return
    }

    // React to message if emoji specified in command
    if (command.reactEmoji) {
      await reactToMessage(sock, msg, command.reactEmoji)
    }

    // Execute command (supports both 'execute' and 'exec')
    try {
      const cmdFunc = command.execute || command.exec
      if (!cmdFunc) {
        throw new Error(`Command ${cmdName} has no execute/exec method`)
      }
      
      await cmdFunc(sock, msg, {
        from,
        sender,
        args: parts.slice(1),
        sessionNumber: sessionMap ? [...sessionMap.keys()][0] : null,
        allSessions: sessionMap || sessions
      })
    } catch (err) {
      logger.error(`Error in ${cmdName}:`, err)
      await sock.sendMessage(from, { text: `❌ *Error:* ${err.message}` }, { quoted: msg })
    }

    // Owner mention audio (optional)
    await sendOwnerMentionAudio(sock, msg, from)
    
  } catch (err) {
    logger.error('handleIncomingMessage error:', err)
  }
}

function getCategories() { return categories }
function getCommands() { return commands }

module.exports = { loadPlugins, handleIncomingMessage, getCategories, getCommands }
