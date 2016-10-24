var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);



app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//Sends Current users to provided socket

function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
	var users = [];
	if(typeof info === 'undefine') {
		return;
	}

	Object.keys(clientInfo).forEach(function (socktId) {
		var userInfo = clientInfo[socktId];

		if(info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users ' + users.join(', '),
		timestamp: moment().valueOf()
	})
}

io.on('connection', function(socket) {
	console.log('User Connect Via socket.io');

	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id];
		if (typeof userData !== 'undefine') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left the Room',
				timestamp: moment.valueOf()
			});

			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has Joined!',
			timestamp: moment().valueOf()
		});
	});

	socket.on('message', function(message) {
		console.log('Message Received ' + message.text);
		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the Chat Application',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function() {
	console.log('Server Started');
});