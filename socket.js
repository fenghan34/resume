const { WebSocketServer } = require('ws')

function initSocketServer() {
  const socketPort = 8009
  const socket = new WebSocketServer({ port: socketPort })

  function broadcast(data) {
    socket.clients.forEach((client) => client.send(JSON.stringify(data)))
  }

  return { broadcast, socketPort, socket }
}

module.exports = initSocketServer
