// application wide settings
var express = require('express');

var app = express.createServer();

exports.app = app;

exports.appPort = process.env.IG_APP_PORT || process.env.PORT || 3000;
exports.CLIENT_ID = process.env.IG_CLIENT_ID || '211543125f05499e9717f9abd1db9530'
exports.CLIENT_SECRET = process.env.IG_CLIENT_SECRET || 'f62e138f53394121b181458da6ec9982';
exports.httpClient = (process.env.IG_USE_INSECURE ? require('http') : require('https'));
exports.apiHost = process.env.IG_API_HOST || 'api.instagram.com';
exports.apiPort = process.env.IG_API_PORT || null;
exports.basePath = process.env.IG_BASE_PATH || '';
exports.REDIS_PORT = 9927; // for local - 6486;
exports.REDIS_HOST = '127.0.0.1';
exports.REDISTOGO_URL = process.env.REDISTOGO_URL || 'redis://redistogo:6f47379c13a75a923c3c6e04df6b6631@tetra.redistogo.com:9927/';
exports.MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/';
exports.TWITTER_CHANNEL = 'twitter';
exports.INSTAGRAM_CHANNEL = 'instagram';
exports.debug = true;

app.set('view engine', 'jade');

app.configure(function(){
    app.use(express.methodOverride());
	app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/public/'));
});
app.configure('development', function(){
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
    app.use(express.errorHandler());
});