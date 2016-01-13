const http = require('http');
const express = require('express');
const app = express();
const socketIo = require('socket.io');
var _ = require('lodash');

app.use(express.static('public'));

var port = process.env.PORT || 3000;

var server = http.createServer(app)
                 .listen(port, function () {
                   console.log('Listening on port' + port + '.');
                 });

var votes = {};

const io = socketIo(server);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('voteCount', countVotes(votes));

  socket.emit('statusMessage', 'You have connected.');

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    io.sockets.emit('voteCount', countVotes(votes));
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      io.sockets.emit('voteCount', countVotes(votes));
    }
  });
});

function countVotes(votes) {
  return _.countBy(votes, function(value, key) {
    return value;
  });
}

module.exports = server;
