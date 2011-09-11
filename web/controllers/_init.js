var controllers = [
	'home',
	'api'
];

var render = function(controller, res, path, vars, options) {
	vars = vars || {};
	options = options || {};
	
	vars.controller = controller;
	vars.res = res;

	try {
		var style_stat = fs.statSync('./public/styles/helpers/' + controller + '.css');
		vars.controllerStyle = true;
	} catch (e) {
		vars.controllerStyle = false;
	}
	
	try {
		var script_stat = fs.statSync('./public/scripts/helpers/' + controller + '.js');
		vars.controllerScript = true;
	} catch (e) {
		vars.controllerScript = false;
	}
	
	var params = {
		locals: vars
		,res: res
	};

	if (typeof options.layout == 'undefined') {
		params.layout = true;
	} else {
		params.layout = options.layout;
	}

	res.render(path, params);
};

exports.init = function(app) {
	controllers.forEach(function(controllerName, i) {
		var controller = require('./' + controllerName);
		controller.controller(app, function(res, path, vars, options) {
			render(controllerName, res, path, vars, options);
		});
	});
};
