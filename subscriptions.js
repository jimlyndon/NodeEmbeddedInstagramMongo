var $ = require("mongous").Mongous,
    mubsub = require('mubsub'),
    fs = require('fs'),
    jade = require('jade'),
    io = require('socket.io'),
    settings = require('./settings'),
    helpers = require('./helpers'),
    app = settings.app,
    subscriptionPattern = 'channel:*',
    socket = io.listen(app);

// Heroku won't actually allow us to use WebSockets so we have to setup polling instead, unless deploying on a different host
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
socket.configure(function () {
  socket.set("transports", ["xhr-polling"]);
  socket.set("polling duration", 10);
});


var ms_client = mubsub(settings.MONGODB_URL + 'test');
    
ms_client.channel(settings.INSTAGRAM_CHANNEL).subscribe(function(doc) {
    var data = doc.data;
    
    // Store individual media JSON
    for(index in data) {
        var media = data[index];
        media.meta = {};
        $("test.instagrammedia").save({'media': media});
    }
    
    // Send out whole update to the listeners
    var update = {
      //'type': 'newMedia',
      'media': data,
      'channel': settings.INSTAGRAM_CHANNEL
    };
        
    socket.sockets.emit('message', JSON.stringify(update));
});

ms_client.channel(settings.TWITTER_CHANNEL).subscribe(function(doc) {
    var data = doc.data;
    
    // Store individual media JSON
    for(index in data) {
        var media = data[index];
        media.meta = {};
        $("test.twittermedia").save({'media': media});
    }

    // Send out whole update to the listeners
    var update = {
      //'type': 'newMedia',
      'media': data,
      'channel': settings.TWITTER_CHANNEL
    };

    socket.sockets.emit('message', JSON.stringify(update));
});