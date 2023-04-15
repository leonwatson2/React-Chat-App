const express = require(
  'express'
)
const app = express()
const socketio = require("socket.io");

const PORT = process.env.PORT || 3231

const server = require('http').createServer(app)
const io = module.exports.io = socketio(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});
const SocketManager = require('./SocketManager')



app.get('/', function (req, res) {
  res.send('ok');
})
io.on('connection', SocketManager);

app.listen(PORT, function () {
  console.log('listening on *:' + PORT);
});

