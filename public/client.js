var socket = io();

var connectionCount = document.getElementById('connection-count');
var statusMessage = document.getElementById('status-message');
var lists = document.querySelectorAll('#vote-count li')

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', function (message) {
  statusMessage.innerText = message;
});

socket.on('voteCount', function (votes) {
  for (var i = 0; i < lists.length; i++){
    if(votes[lists[i].id] !== undefined){
      lists[i].innerHTML = lists[i].id + ": " + votes[lists[i].id];
    } else{
      lists[i].innerHTML = lists[i].id + ": 0";
    }
  }
  console.log(votes);
})

var buttons = document.querySelectorAll('#choices button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    socket.send('voteCast', this.innerText);
  });
}
