var express = require('express');
var bodyParser = require('body-parser');
var path = require('path')

var app = express();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/comics';


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

MongoClient.connect(url, function(err, db) {
  if (err) {console.log("Couldn't connect to database")}

  app.get('/comics', function(req, res) {
    var comics = db.collection('reccs').find({}).toArray(function(error, comics) {
      if (error) {console.dir(error+"error!")}
      console.dir("hello?")
      res.send(comics)
      // console.dir(comics);
    })
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

app.set('port', 3000);
app.use('/', express.static(path.join(__dirname, 'public')));



app.listen(app.get('port'), function() {
	console.log('App listening on http://localhost:%s', app.get('port'));
});
