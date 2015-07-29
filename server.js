var io = require('socket.io')(process.env.PORT || 5000);

io.on('connection', function(socket) {
  console.log('SERVER::WE ARE USING SOCKETS!');
  console.log(socket.id);
});

process.env.PORT || 5000
