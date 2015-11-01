var express = require('express');
var bodyParser = require('body-parser');
var path = require('path')

var app = express();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var uri = process.env.TEST_MONGODB;


var findComics = function(db, callback) {
   var cursor =db.collection('reccs').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.log(doc);
      } else {
         callback();
      }
   });
};

MongoClient.connect(uri, function(err, db) {
  if (err) {console.log("Couldn't connect to database")}

  app.get('/comics', function(req, res) {
    var query = req.query.test
    var comics = db.collection('reccs').find( { genre: { $in: req.query.test} } ).toArray(function(error, comics) {
      if (error) {console.dir(error+"error!")}
      console.dir("hello?")
      console.log("What's being sent by req: ",req.query.test)
      console.log("What's being sent by comics: ",comics)

      res.send(comics)
      // console.dir(comics);
    })
  })

  app.get('/comic', function(req, res) {
    var comic = db.collection('reccs').findOne( { name: { $in: [req.query.title]} }, function(err, comic) {
      if (err) {console.dir(err+"error!")}
      console.log("What's being sent by res: ",comic.url);
      res.send(comic.url)
    });
  })

  // findComics(db, function() {
  //     db.close();
  // });
});

var comicDB = [
  {id: 1, name: 'Saga', genre: ['science fiction', 'romance'], age: 'M'},
  {id: 2, name: 'Pretty Deadly', genre: ['fantasy', 'western']}
];

app.use(bodyParser.urlencoded({ extend: false}));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));
app.use('/', express.static(path.join(__dirname, 'public')));



app.listen(app.get('port'), function() {
	console.log('App listening on http://localhost:%s', app.get('port'));
});
