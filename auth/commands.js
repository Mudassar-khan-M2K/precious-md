const { handleIncomingMessage } = require('../plugins/_loader')

async function handleCommand(msg, sock, sessions) {
  await handleIncomingMessage(sock, msg, sessions)
}

module.exports = { handleCommand }
