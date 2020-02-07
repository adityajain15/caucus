// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

let users = []

// Create socket connection
let io = require('socket.io').listen(server);
// Listen for individual clients to connect
io.sockets.on('connection',
	// Callback function on connection
  // Comes back with a socket object
	function (socket) {
		console.log("We have a new client: " + socket.id);
    const user = {id: socket.id, x: Math.random(), y: Math.random()}
    users.push(user)
    io.sockets.emit('users', users)
    // Listen for data from this client
		socket.on('positionChange', function(data) {
      // Data can be numbers, strings, objects
			console.log("Received: 'data' " + data);

      for(let i = 0; i < users.length; i++) {
        if(users[i].id === socket.id) {
          users[i].x = data.x
          users[i].y = data.y
        }
      }
    
      io.sockets.emit('users', users)

      // Send it to all other clients, not including this one
      //socket.broadcast.emit('data', data);

      // Send it just this client
      // socket.emit('data', data);
		});

    // Listen for this client to disconnect
		socket.on('disconnect', function() {
      users = users.filter(d=>d.id!==socket.id)
      io.sockets.emit('users', users)
		});
  }
);
