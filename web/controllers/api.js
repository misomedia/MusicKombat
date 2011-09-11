var Game = global.models.Game;
var User = global.models.User;

var openGames = {};

exports.controller = function(app, render) {
	app.post('/games/new', function(req, res) {
		User.auth(req, function(user) {
			if (!user) {
				res.send(0);
				return;
			}
			
			Game.join(user, function(game) {
				if (openGames[game.id]) {
					var otherType = (game.user_id != user.id) ? 'user' : 'opponent';
					openGames[game.id]otherType.socket.emit('game_update', {
						game: game
					});
				}
				
				res.send(game.toJSON());
			});
		});
	});
	
	app.get('/games/:id', function(req, res) {
		var id = Number(req.params.id);
		User.auth(req, function(user) {
			if (!user) {
				res.send(0);
				return;
			}
			
			Game.find(id).on('success', function(game) {
				if (!game) {
					res.send(0);
					return;
				}
				
				if (!game.hasAccess(user)) {
					res.send(0);
					return;
				}
				
				res.send(game.toJSON());
			});
		});
	});
	
	app.post('/games/:id/loss', function(req, res) {
		var id = Number(req.params.id);
		User.auth(req, function(user) {
			if (!user) {
				res.send(0);
				return;
			}
			
			Game.find(id).on('success', function(game) {
				if (!game) {
					res.send(0);
					return;
				}
				
				if (!game.hasAccess(user)) {
					res.send(0);
					return;
				}
				
				game.losses++;
				game.save().on('success', function() {
					if (openGames[game.id]) {
						var otherType = (game.user_id != user.id) ? 'user' : 'opponent';
						openGames[game.id]otherType.socket.emit('game_update', {
							game: game
						});
					}
					
					res.send(game.toJSON());
				});
			});
		});
	});
	
	app.post('/games/:id/tie', function(req, res) {
		var id = Number(req.params.id);
		User.auth(req, function(user) {
			if (!user) {
				res.send(0);
				return;
			}
			
			Game.find(id).on('success', function(game) {
				if (!game) {
					res.send(0);
					return;
				}
				
				if (!game.hasAccess(user)) {
					res.send(0);
					return;
				}
				
				game.ties++;
				game.save().on('success', function() {
					if (openGames[game.id]) {
						var otherType = (game.user_id != user.id) ? 'user' : 'opponent';
						openGames[game.id]otherType.socket.emit('game_update', {
							game: game
						});
					}
					
					res.send(game.toJSON());
				});
			});
		});
	});
	
	app.post('/games/:id/win', function(req, res) {
		var id = Number(req.params.id);
		User.auth(req, function(user) {
			if (!user) {
				res.send(0);
				return;
			}
			
			Game.find(id).on('success', function(game) {
				if (!game) {
					res.send(0);
					return;
				}
				
				if (!game.hasAccess(user)) {
					res.send(0);
					return;
				}
				
				game.wins++;
				game.save().on('success', function() {
					if (openGames[game.id]) {
						var otherType = (game.user_id != user.id) ? 'user' : 'opponent';
						openGames[game.id]otherType.socket.emit('game_update', {
							game: game
						});
					}
					
					res.send(game.toJSON());
				});
			});
		});
	});
	
	app.post('/users/new', function(req, res) {
		var user = User.build();
		user.date_created = new Date();
		user.date_updated = new Date();
		user.auth_token = global.utils.md5(Math.random());
		user.save().on('success', function() {
			res.send(user.toJSON());
		});
	});
	
	app.get('/users/:id', function(req, res) {
		var id = Number(req.params.id);
		User.find(id).on('failure', function() {
			res.send(0);
		}).on('success', function(user) {
			if (!user) {
				res.send(0);
				return;
			}
			
			res.send(user.toJSON());
		});
	});
	
	var onGameUser = function(socket, game, user) {
		if (!game || !user) {
			return;
		}
		
		if (!openGames[game.id]) {
			openGames[game.id] = {user: null, opponent: null};
		}
		
		var type = (game.user_id == user.id) ? 'user' : 'opponent';
		openGames[game.id][type] = socket;
		socket.emit('game_update', {
			game: game
		});
	};
	
	io.on('connection', function(socket) {
		var game = null;
		var user = null;
		socket.on('auth', function(data) {
			Game.find(data.game_id).on('success', function(thisGame) {
				game = thisGame;
				
				if (user) {
					onGameUser(socket, game, user);
				}
			});
			User.auth({
				user_id: data.user_id,
				auth_token: data.auth_token
			}, function(thisUser) {
				user = thisUser;
				
				if (game) {
					onGameUser(socket, game, user);
				}
			});
		});
		socket.on('disconnect', function() {
			if (!game || !user) {
				return;
			}
			
			if (!openGames[game.id]) {
				return;
			}
			
			var otherType = (game.user_id != user.id) ? 'user' : 'opponent';
			openGames[game.id]otherType.socket.emit('other_player_disconnect', {
				game: game
			});
			delete openGames[game.id];
		})
	});
};
