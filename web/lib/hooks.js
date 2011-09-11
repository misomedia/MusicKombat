var hooks = {
	init: function() {
		var Sequelize = require('sequelize');
		global.Sequelize = Sequelize;
		global.sequelize = new Sequelize('music_kombat', 'music_kombat', '8733368c42a4b919cc641cec04acd776', {
			host: 'localhost',
			port: 3306
//			port: '/Applications/MAMP/tmp/mysql/mysql.sock'
		});
		global.models = {
			Game: require('../models/game').Game,
			User: require('../models/user').User
		};
	}
};

exports.events = hooks;
