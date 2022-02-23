const { WebSocketServer } = require('ws')

function initSocketServer(config) {
  const socketPort = config.devServer.socketPort || 8008
  const socket = new WebSocketServer({ port: socketPort })

  function broadcast(data) {
    socket.clients.forEach((client) => client.send(JSON.stringify(data)))
  }

  return { broadcast, socketPort, socket }
}

module.exports = initSocketServer
