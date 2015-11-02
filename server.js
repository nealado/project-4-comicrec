var express = require('express');
var bodyParser = require('body-parser');
var path = require('path')


var app = express();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var uri = process.env.TEST_MONGODB;


MongoClient.connect(uri, function(err, db) {
  if (err) {console.log("Couldn't connect to database")}

  // Provides title + genre to fill in relevant ComicsList component, depending on user's selected checkboxes, represented in query variable
  app.get('/comics', function(req, res) {
    var query = req.query.test;
    var randomNumber = Math.floor((Math.random() * 3) + 1)

    //Not working -- randomly select the number to skip by in Mongo query, by counting the number that already exist in callback function.

        // var countComics = db.collection('reccs').count({ genre: { $in: req.query.test}}, function(error, count) {
        //   console.log(count)
        // })

        // var collection = db.collection('reccs');

    // Temporary solution using a random number 1 through 5.
    var comics = db.collection('reccs').find( { genre: { $in: query} } ).limit(4).skip(randomNumber).toArray(function(error, comics) {
          if (error) {console.dir(error+"error!")}

          console.log("What's being sent by req: ",query)
          console.log("What's being sent by comics: ",comics)

          res.send(comics)
        })
  })

  //Provides appropriate URL to execute AJAX calls
  app.get('/comic', function(req, res) {
    var comic = db.collection('reccs').findOne( { name: { $in: [req.query.title]} }, function(err, comic) {
      if (err) {console.dir(err+"error!")}
      console.log("What's being sent by res: ",comic.url);
      res.send(comic.url)
    });
  })

});


app.use(bodyParser.urlencoded({ extend: false}));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));
app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function() {
	console.log('App listening on http://localhost:%s', app.get('port'));
});
