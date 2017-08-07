var app = require('express')();
var http = require('http').Server(app);
var io = module.exports.io = require('socket.io')(http);
const PORT = process.env.PORT || 3231
const SocketManager = require('./SocketManager')
 
io.on('connection', SocketManager);


http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});

