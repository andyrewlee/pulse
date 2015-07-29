var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.urlencoded());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
   res.render('index');
});

var server = app.listen(app.get('port'), function() {
  console.log('listening on port', app.get('port'));
});

var io = require('socket.io').listen(server);

var lastFiveResponses = [0,0,0,0,0];
var lastFiveRespondents = [null,null,null,null,null];

function shiftAndPush(vote, socketId) {
  lastFiveResponses.shift();
  lastFiveRespondents.shift();

  lastFiveResponses.push(vote);
  lastFiveRespondents.push(socketId);
}

function tooMuchVotingFor(socketId) {
  var count = 0;

  for(var i=0; i<lastFiveRespondents.length; i++) {
    if(lastFiveRespondents[i] == socketId) {
      count++;
    }
  }

  if(count > 2) {
    return true;
  } else {
    return false;
  }
}

function sumOfResponses() {
  var sum = 0;

  for(var i=0; i<lastFiveResponses.length; i++) {
    sum += lastFiveResponses[i];
  }

  return sum;
}

function currentPulse() {
  var sum = sumOfResponses();

  if(sum == 0) {
    return "green";
  } else if(sum == 1) {
    return "yellow";
  } else if(sum == 2) {
    return "orange";
  } else if(sum >= 3) {
    return "red";
  }
}

io.sockets.on('connection', function (socket) {
  console.log('SERVER::WE ARE USING SOCKETS!');

  socket.on('arrowPressed', function(tag, device) {
    if(tooMuchVotingFor(device) {
      console.log("Too much voting for", device);
    } else {
      lastFiveResponses.shiftAndPush(parseInt(tag), device);
      io.sockets.emit(currentPulse());
      io.sockets.emit("check");
    }
  }
});
