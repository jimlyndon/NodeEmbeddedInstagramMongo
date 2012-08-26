var url = require('url'),
  settings = require('./settings'),
  helpers = require('./helpers'),
  subscriptions = require('./subscriptions'),
  app = settings.app;
  
  var $ = require("mongous").Mongous;
  
// Bootstrap db connection
$("test.instagrammedia");
$("test.twittermedia");

// INSTAGRAM API USE ONLY - used to authenticate a subscription request from instagram servers
app.get('/callbacks/tag/', function(request, response){
  // Find the HTTPGET parameter called 'hub.challenge' received from instagram servers and reply with it
  var params = url.parse(request.url, true).query;
  response.send(params['hub.challenge'] || 'No hub.challenge present');
});

// INSTAGRAM API USE ONLY - used by instagram api to push update notices
app.post('/callbacks/tag/', function(request, response){
    
   // First, let's verify the payload's integrity
   // if(!helpers.isValidRequest(request)) {
   //   response.send('FAIL');
   //   return;
   // }
    
    // Go through and process each update. Note that every update doesn't
    // include the updated data - we use the data in the update to query
    // the Instagram API to get the data we want.
  var updates = request.body;
  for(index in updates) {
    helpers.processInstagramUpdate(updates[index]);
  }   
  response.send('OK');
});

// TESTING USE ONLY - used to add a test instagram record, e.g., http://localhost:3000/test/instagram/add/
app.get('/test/instagram/add/', function(request, response){
  helpers.testing_add_instagram();
  response.send('OK');
});
// TESTING USE ONLY - used to add a test tweet record, e.g., http://localhost:3000/test/tweet/add/
app.get('/test/twitter/add/', function(request, response){
  helpers.testing_add_tweet();
  response.send('OK');
});



// URI Routing

// Render the home page
app.get('/', function(request, response){
  response.render('index.jade');
});

// POST back list of instagrams
app.post('/instagrams/:id?', function(request, response) {
  // todo: use id to delimit the list of records to return
  var id = request.body.id;

  helpers.getInstagrams(function(error, media) {
    
    // TODO: remove, for testing only
    if(media.length == 0) {
      helpers.processInstagramUpdate({ object_id : 'nyfw' })
    }
    
    response.send(JSON.stringify(media));
  });
});

// POST back list of tweets
app.post('/tweets/:id?', function(request, response) {
  // todo: use id to delimit the list of records to return
  var id = request.body.id;
  
  helpers.getTweets(function(error, media) {
    response.send(JSON.stringify(media));
  });
});

// start application running on specified port
app.listen(settings.appPort);