var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();


socket.on('connect', function() {
	console.log('Connected to Socket.io server!');

	socket.emit('joinRoom', {
		name: name,
		room: room
	})
});

socket.on('message', function(message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = $('.messages');
	var $roomname = $('.room-title');
	console.log('New Message:');
	console.log(message.text);
	$roomname.text(room);
	$message.append("<p><strong>" + message.name + " " + momentTimestamp.local().format('h:mm a') + "</strong></p>");
	$message.append("<p>" + message.text + "</p>");
});

// Handels submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();
	var $message = $form.find('input[name=message]')
	socket.emit('message' , {
		name: name,
		text: $message.val()
	});

	$message.val("");
});