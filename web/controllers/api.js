exports.controller = function(app, render) {
	io.on('connection', function(client) {
		console.log('connection');
		client.on('message', function(data) {
			console.log('message');
			client.send('From Server!!! You said: ' + data);
		});
	
		client.on('disconnect', function(){})
	});
};
