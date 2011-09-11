exports.controller = function(app, render) {
	app.get('/', function(req, res) {
		render(res, 'home/index', {
		});
	});
};
