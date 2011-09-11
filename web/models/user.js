var Sequelize = global.Sequelize;

var User = global.sequelize.define('user', {
	date_created: Sequelize.DATE,
	date_updated: Sequelize.DATE,
	
	auth_token: Sequelize.STRING
}, {
	timestamps: false,
	
	classMethods: {
		auth: function(req, callback) {
			if (!req.query.user_id || !req.query.auth_token) {
				callback(false);
				return;
			}
			
			var user_id = Number(req.query.user_id);
			User.find(user_id).on('success', function(user) {
				if (!user) {
					callback(false);
					return;
				}
				
				if (user.auth_token != req.query.auth_token) {
					callback(false);
					return;
				}
				
				callback(user);
			});
		}
	},
	
	instanceMethods: {
		toJSON: function() {
			return JSON.stringify({
				id: this.id,
				date_created: this.date_created,
				date_updated: this.date_updated,
				auth_token: this.auth_token
			});
		}
	}
});

exports.User = User;
