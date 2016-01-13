const http = require('http');
const express = require('express');
const app = express();
const socketIo = require('socket.io');

app.use(express.static('public'));

var port = process.env.PORT || 3000;

var server = http.createServer(app)
                 .listen(port, function () {
                   console.log('Listening on port' + port + '.');
                 });

const io = socketIo(server);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
  });
});

module.exports = server;
