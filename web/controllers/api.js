exports.controller = function(app, render) {
	socket.on('connection', function(client) {
		client.on('message', function(data) {
			client.send('From Server!!! You said: ' + data);
		})
	
		client.on('disconnect', function(){})
	});
};
