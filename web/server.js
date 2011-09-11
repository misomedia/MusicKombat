var express = require('express');
var io = require('socket.io');
var app = express.createServer();
io.listen(app);

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
});

global.fs = require('fs');
global.utils = require('./lib/helpers/utils');

var hooks = require('./lib/hooks');
hooks.events.init(app);

// init controllers
var controllers = require('./controllers/_init');
controllers.init(app);

//var port = process.argv[2] || 41019;
var port = process.argv[2] || 80;
var server = process.argv[3] || 'localhost';
app.listen(port, server);
