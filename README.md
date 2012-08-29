NodeEmbeddedInstagramMongo
==========================

Node Embedded Instagram and Twitter using MongoDB example

Steps for running the application:

1. git clone repo

2. open terminal and run 'npm install' within the project's directory

3. install mongodb on your machine (if it isn't already): http://www.mongodb.org/display/DOCS/Quickstart

4. run mongodb using the configuration from the application: ex., $/usr/local/Cellar/mongodb/2.0.7-x86_64/bin/mongod

5. Since mongodb is running you will need to open a second terminal and navigate to the application's directory. Once there, run node: node server.js

6. By the way, Procfile is just a file that tells Heroku how to start your application, just so you know.  It's not used otherwise.

7. Once the application is running you can set up subscriptions (see below).



Steps to set up a single subscription against Instagram's subscription API for tags:

1. If your application is not internet facing then you'll have to create a proxy.  I use localtunnel:  
npm install localtunnel

2. Run local tunnel command to get an internet facing URL:
localtunnel 3000

3. Open a terminal and add three variables - client id, client secret and a hostname (e.g., localtunnel URL) that instagram can send data to:
export IG_CLIENT_ID=1234124214124124124214124124
export IG_CLIENT_SECRET=234532432fdfdssdgs34534354
export IG_CALLBACK_HOST=http://58ab.localtunnel.com

4. Make a tag subscription request to instagram:
curl -F "client_id=$IG_CLIENT_ID" -F "client_secret=$IG_CLIENT_SECRET" -F 'object=tag' -F 'aspect=media' -F 'object_id=nyfw' -F "callback_url=$IG_CALLBACK_HOST/callbacks/tag/" https://api.instagram.com/v1/subscriptions

5. Note: until a new update happens, instagram WILL NOT send any notices.  Even if there is data out there that has already been sent, your code will have to make an initial call to get the most recent data (this is what I hard coded and is why you had data when you started the application).  You can also run this curl command to see most recent data:
curl "https://api.instagram.com/v1/tags/nyfw/media/recent?client_id=$IG_CLIENT_ID"


6. While debugging you're going to want to run utility commands to remove subscriptions, see recent tagged photos, etc:

// remove subscriptions
curl -X DELETE "https://api.instagram.com/v1/subscriptions?client_secret=$IG_CLIENT_SECRET&object=all&client_id=$IG_CLIENT_ID"

// view subscriptions
curl "https://api.instagram.com/v1/subscriptions?client_id=$IG_CLIENT_ID&client_secret=$IG_CLIENT_SECRET"

// view recent
curl "https://api.instagram.com/v1/tags/nyfw/media/recent?client_id=$IG_CLIENT_ID"

// clean mongo collection:
mongo instance --eval "db.collection.drop()"
