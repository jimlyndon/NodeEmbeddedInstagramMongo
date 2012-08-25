var $ = require("mongous").Mongous,
  mubsub = require('mubsub'),
  settings = require('./settings'),
  crypto = require('crypto'),
  _ = require('underscore');
  

// makes sure subscription request is actually from Instagram
function isValidRequest(request) {
    // First, let's verify the payload's integrity by making sure it's
    // coming from a trusted source. We use the client secret as the key
    // to the HMAC.
    var hmac = crypto.createHmac('sha1', settings.CLIENT_SECRET);
    // TODO rawBody is broken/removed in latest express version, need to find workaround
    hmac.update(request.rawBody);
    var providedSignature = request.headers['x-hub-signature'];
    var calculatedSignature = hmac.digest(encoding='hex');
    
    // If they don't match up or we don't have any data coming over the
    // wire, then it's not valid.
    debug("providedSignature: " + providedSignature);
    debug("calculatedSignature: " + calculatedSignature);
    return !((providedSignature != calculatedSignature) || !request.body)
}
exports.isValidRequest = isValidRequest;

// Retrieve from store
function getInstagrams(callback) {
  $("test.instagrammedia").find(10, function(reply) {
    callback(null, reply.documents);
  });
}
exports.getInstagrams = getInstagrams;

// Retrieve from store
function getTweets(callback) {
  $("test.twittermedia").find(10, function(reply) {
    
    var sample1 = JSON.parse('{ "media" : { "retweet_count": 10, "favorite_count": 3, "user": { "id": 179215882, "name": "Rowing1839", "id_str": "179215882", "screen_name": "ROWING1839" }, "id_str": "238076220334555136", "entities": { "hashtags": [ { "indices": [ 45, 52 ], "text": "rowing" }, { "indices": [ 92, 106 ], "text": "brandbuilding" } ], "user_mentions": [ { "name": "CEO/Fashion Designer", "indices": [ 3, 19 ], "id_str": "55902631", "screen_name": "CLAUDE_MICHELLE", "id": 55902631 }, { "name": "Rowing1839", "indices": [ 33, 44 ], "id_str": "179215882", "screen_name": "ROWING1839", "id": 179215882 }, { "name": "✈ProducTivE ✈ Chandy", "indices": [ 85, 91 ], "id_str": "410520464", "screen_name": "cibmw", "id": 410520464 } ], "urls": [] }, "id": 238076220334555140, "created_at": "Wed Aug 22 00:52:48 +0000 2012", "text": "RT @CLAUDE_MICHELLE: Fitting new @ROWING1839 #rowing pieces for NYFW show with model @cibmw #brandbuilding" }}')
    
    var sample2 = JSON.parse('{ "media" : { "retweet_count": 5, "favorite_count": 2, "user": { "id": 454238834, "name": "Design Dove", "id_str": "454238834", "screen_name": "Design_Dove" }, "id_str": "238075405632958465", "entities": { "hashtags": [ { "indices": [ 0, 8 ], "text": "FASHION" } ], "user_mentions": [], "urls": [ { "url": "http://t.co/w6t01FgM", "display_url": "designdove.com/2012/02/16/10-…", "indices": [ 50, 70 ], "expanded_url": "http://designdove.com/2012/02/16/10-nyfw-nail-looks-that-blew-our-minds/" } ] }, "id": 238075405632958460, "created_at": "Wed Aug 22 00:49:34 +0000 2012", "text": "#FASHION : 10 NYFW Nail Looks That Blew Our Minds http://t.co/w6t01FgM" }}');
    
    var sample3 = JSON.parse('{ "media" : { "retweet_count": 2, "favorite_count": 0, "user": { "id": 278169648, "name": "Brii", "id_str": "278169648", "screen_name": "sabrina_ramdath" }, "id_str": "238075063629398017", "entities": { "hashtags": [], "user_mentions": [ { "name": "Christian Allaire", "indices": [ 3, 17 ], "id_str": "128385844", "screen_name": "chrisjallaire", "id": 128385844 }, { "name": "FLARE Magazine", "indices": [ 33, 46 ], "id_str": "33920830", "screen_name": "FLAREfashion", "id": 33920830 } ], "urls": [] }, "id": 238075063629398000, "created_at": "Wed Aug 22 00:48:13 +0000 2012", "text": "RT @chrisjallaire: Team Posh! RT @FLAREfashion Katie Holmes vs Victoria Beckham: The two celeb designers will show on the same day at NY ..." }}');
    
    var sample4 = JSON.parse('{ "media" : { "retweet_count": 2, "favorite_count": 0, "user": { "id": 15160438, "name": "Vince Fields", "id_str": "15160438", "screen_name": "TheMrApollo" }, "id_str": "238074963033210880", "entities": { "hashtags": [ { "indices": [ 89, 94 ], "text": "NYFW" } ], "user_mentions": [ { "name": "Tom + Lorenzo®", "indices": [ 3, 17 ], "id_str": "16190305", "screen_name": "tomandlorenzo", "id": 16190305 } ], "urls": [] }, "id": 238074963033210880, "created_at": "Wed Aug 22 00:47:49 +0000 2012", "text": "RT @tomandlorenzo: I can\'t believe I actually enjoy doing abs now. I\'ve always hated it. #NYFW does that to you. Oh, and Fire Island. L" }}');
    
    var sample5 = JSON.parse('{ "media" : { "retweet_count": 0, "favorite_count": 0, "user": { "id": 492550001, "name": "Fashion Week11", "id_str": "492550001", "screen_name": "FashionWeek11" }, "id_str": "238074620211773440", "entities": { "hashtags": [ { "indices": [ 55, 67 ], "text": "ifollowback" }, { "indices": [ 68, 73 ], "text": "nyfw" } ], "user_mentions": [], "urls": [ { "url": "http://t.co/Sw1CyD8D", "display_url": "bit.ly/PUT2Ji", "indices": [ 34, 54 ], "expanded_url": "http://bit.ly/PUT2Ji" } ] }, "id": 238074620211773440, "created_at": "Wed Aug 22 00:46:27 +0000 2012", "text": "Scotch &amp; Soda Plots Expansion http://t.co/Sw1CyD8D #ifollowback #nyfw" }}');
    
    var sample6 = JSON.parse('{ "media" : { "retweet_count": 0, "favorite_count": 0, "user": { "id": 492550001, "name": "Fashion Week11", "id_str": "492550001", "screen_name": "FashionWeek11" }, "id_str": "238074619372904448", "entities": { "hashtags": [ { "indices": [ 63, 75 ], "text": "ifollowback" }, { "indices": [ 76, 81 ], "text": "nyfw" } ], "media": [], "user_mentions": [], "urls": [ { "url": "http://t.co/Fl6S5obs", "display_url": "bit.ly/PUT43U", "indices": [ 42, 62 ], "expanded_url": "http://bit.ly/PUT43U" } ] }, "id": 238074619372904450, "created_at": "Wed Aug 22 00:46:27 +0000 2012", "text": "Best Bet: ModCloth Do As You Pleats Dress http://t.co/Fl6S5obs #ifollowback #nyfw" }}');


    var sample7 = JSON.parse('{ "media" : { "retweet_count": 0, "favorite_count": 0, "user": { "id": 17126946, "name": "Korey Shrum", "id_str": "17126946", "screen_name": "KoreyShrum" }, "id_str": "238074326501433345", "entities": { "hashtags": [ { "indices": [ 26, 31 ], "text": "NYFW" } ], "user_mentions": [], "urls": [ { "url": "http://t.co/REsdMHyc", "display_url": "instagr.am/p/OnDEk2QVbv/", "indices": [ 82, 102 ], "expanded_url": "http://instagr.am/p/OnDEk2QVbv/" } ] }, "id": 238074326501433340, "created_at": "Wed Aug 22 00:45:17 +0000 2012", "text": "Got my new show cards for #NYFW yesterday. Damn near neked on the back ;) hey mom http://t.co/REsdMHyc" }}');

    var documents = [];
    documents.push(sample1, sample2, sample3, sample4, sample5, sample6, sample7);
    
    callback(null, documents);
  });
}
exports.getTweets = getTweets;


/*

    Each update that comes from Instagram merely tells us that there's new
    data to go fetch. The update does not include the data. So, we take the
    tag ID from the update, and make the call to the 'recent' API.

*/
var ms_client = mubsub(settings.MONGODB_URL + 'test');

function processInstagramUpdate(update) {  
  // build the URI to access instagram's 'recent' api
  var path = '/v1/tags/' + update.object_id + '/media/recent/';
  var channelName = 'instagram';
  
  // finish building the URI using the most recent instragram id that we already have
  getMinID(channelName, function(error, minID) {
    debug('minid ' + minID);
    var queryString = "?client_id="+ settings.CLIENT_ID;
    //TODO fix
    // if(minID) {
    //  queryString += '&min_id=' + minID;
    // } else {
    //     // If this is the first update, just grab the most recent.
       queryString += '&min_id=0';
    // }
    
    var options = {
      host: settings.apiHost,
      // Note that in all implementations, basePath will be ''. Here at
      // instagram, this aint true ;)
      path: settings.basePath + path + queryString
    };
    
    if(settings.apiPort) {
        options['port'] = settings.apiPort;
    }

    // Asynchronously ask the Instagram API for new media for a given tag.
    settings.httpClient.get(options, function(response) {
      var data = '';
      var newData = {};
      var newDataStr = '';
      
      response.on('data', function(chunk) {
        data += chunk;
      });
      
      response.on('end', function() {
          try {            
            var dataArray = JSON.parse(data).data;
            var newDataArray = [];
            _.each(dataArray, function(obj, idx){
                var images = {};
                images.standard_resolution = obj.images.standard_resolution;
                
                var cap = {};
                if(!!obj.caption && !!obj.caption.text)
                  cap = obj.caption;
                else
                  cap.text = '';
                  
                debug(obj.id);
                newDataArray.push({id : obj.id, images : images, caption : cap, created_time : obj.created_time });
            });
            newData = { "data": newDataArray };
            //newDataStr = JSON.stringify(newData);
            
          } catch (e) {
              // debug('Couldn\'t parse data. Malformed?');
              return;
          }
        
        setMinID(channelName, newData.data);

        // Let all the redis listeners know that we've got new media.
        //redisClient.publish('channel:' + channelName, newDataStr);

        ms_client.channel(settings.INSTAGRAM_CHANNEL).publish(newData);
        // ms_instagram_channel.publish(newData, function(err) {
        //     if (err) throw err;
        // });
      });
      
    }); // end settings.httpClient.get
    
  }); // end getMinID
}
exports.processInstagramUpdate = processInstagramUpdate;


/*
    In order to only ask for the most recent media, we store the MAXIMUM ID
    of the media for every tag we've fetched. This way, when we get an
    update, we simply provide a min_id parameter to the Instagram API that
    fetches all media that have been posted *since* the min_id.   
*/

// get the latest record
function getMinID(channelName, callback){
  $("test.minid").find(1, function(reply) {
      callback(null, reply.documents[0]);
  });
  //redisClient.get('min-id:channel:' + channelName, callback);
}
exports.getMinID = getMinID;

// set the latest record
function setMinID(channelName, data){
    var sorted = data.sort(function(a, b) {
        return parseInt(b.id) - parseInt(a.id);
    });
    var nextMinID;
    try {
      nextMinID = parseInt(sorted[0].id);
      //redisClient.set('min-id:channel:' + channelName, nextMinID);
      $("test.minid").save({channelName:nextMinID});
    } catch (e) {
        // debug('Error parsing min ID');
        // debug(sorted);
    }
}
exports.setMinID = setMinID;

// debug utility function
function debug(msg) {
  if (settings.debug) {
    console.log(msg);
  }
}
exports.debug = debug;




// testing

// For TESTING ONLY (remove for production)
// E.g., example photo: http://distillery.s3.amazonaws.com/media/2011/02/02/f9443f3443484c40b4792fa7c76214d5_7.jpg
function testing_add_instagram() {  
  // fake instagram record
  var dataArray = JSON.parse('{"data": [{"caption": {"created_time": "1296703540","text": "#Snow","from": {"username": "emohatch","id": "1242695"},"id": "26589964"},"created_time": "1296703540", "images": {"standard_resolution": {"url": "http://distilleryimage1.instagram.com/5fb063b2e1c911e1b44322000a1e8c9f_7.jpg","width": 612,"height": 612}},"id": "261560384039219254_50900129"}]}').data;

  var newDataArray = [];
  _.each(dataArray, function(obj, idx){
      var images = {};
      images.standard_resolution = obj.images.standard_resolution;

      var cap = {};
      if(!!obj.caption && !!obj.caption.text)
        cap = obj.caption;
      else
        cap.text = '';

      newDataArray.push({"media" : {id : obj.id, images : images, caption : cap, created_time : obj.created_time }});
  });
  
  newData = { "data": newDataArray };

  // Let all the redis listeners know that we've got new media.
  //redisClient.publish('channel:' + 'instagram', JSON.stringify(newData));
  ms_client.channel(settings.INSTAGRAM_CHANNEL).publish(newData);
  // ms_instagram_channel.publish(newData, function(err) {
  //     if (err) throw err;
  // });
}
exports.testing_add_instagram = testing_add_instagram;



// For TESTING ONLY (remove for production)
function testing_add_tweet() {  

  var sample = JSON.parse('{ "media" : { "retweet_count": 0, "favorite_count": 0, "user": { "id": 543577544, "name": "Aushim Raswant", "id_str": "543577544", "screen_name": "Aushim3V" }, "id_str": "238074310797979649", "entities": { "hashtags": [ { "indices": [ 13, 25 ], "text": "FashionWeek" }, { "indices": [ 76, 81 ], "text": "nyfw" }, { "indices": [ 82, 87 ], "text": "MBFW" } ], "user_mentions": [], "urls": [] }, "id": 238074310797979650, "created_at": "Wed Aug 22 00:45:13 +0000 2012", "text": "Two days ago #FashionWeek looked quiet. Oh what a difference a day makes. #nyfw #MBFW" }}');

  var newDataArray = [];
  newDataArray.push(sample);
  
  newData = { "data": newDataArray };

  ms_client.channel(settings.TWITTER_CHANNEL).publish(newData);
}
exports.testing_add_tweet = testing_add_tweet;