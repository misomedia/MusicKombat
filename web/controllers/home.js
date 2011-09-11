exports.controller = function(app, render) {
	app.get('/', function(req, res) {
		console.log('foo');
		render(res, 'home/index', {
		});
	});
};
