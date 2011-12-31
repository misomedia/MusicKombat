var Sequelize = global.Sequelize;

var Game = global.sequelize.define('game', {
	user_id: {type: Sequelize.INTEGER, defaultValue: 0},
	opponent_id: {type: Sequelize.INTEGER, defaultValue: 0},
	
	date_created: Sequelize.DATE,
	date_updated: Sequelize.DATE,
	
	turns: {type: Sequelize.INTEGER, defaultValue: 0},
	wins: {type: Sequelize.INTEGER, defaultValue: 0},
	ties: {type: Sequelize.INTEGER, defaultValue: 0},
	losses: {type: Sequelize.INTEGER, defaultValue: 0},
}, {
	timestamps: false,
	
	classMethods: {
		create: function(user, callback) {
			var game = Game.build();
			game.user_id = user.id;
			game.date_created = new Date();
			game.date_updated = new Date();
			game.save().on('success', function() {
				callback(game);
			});
		},
		
		join: function(user, callback) {
			Game.find({
				where: [
					'opponent_id = 0 AND user_id != ?',
					user.id
				]
			}).on('success', function(game) {
				if (!game) {
					Game.create(user, callback);
					return;
				}
				
				game.opponent_id = user.id;
				game.save().on('success', function() {
					callback(game);
				});
			});
		}
	},
	
	instanceMethods: {
		hasAccess: function(user) {
			if (!user) {
				return false;
			}
			
			if (user.id == this.user_id) {
				return true;
			}
			
			if (user.id == this.opponent_id) {
				return true;
			}
			
			return false;
		},
		
		toDictionary: function() {
			return {
				id: this.id,
				user_id: this.user_id,
				opponent_id: this.opponent_id,
				date_created: this.date_created,
				date_updated: this.date_updated,
				turns: this.turns,
				wins: this.wins,
				ties: this.ties,
				losses: this.losses
			};
		},
		
		toJSON: function() {
			return JSON.stringify(this.toDictionary());
		}
	}
});

exports.Game = Game;
