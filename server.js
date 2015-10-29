var express = require('express');
var bodyParser = require('body-parser');
var path = require('path')


var app = express();
var comicDB = [
  {id: 1, name: 'Saga', genre: ['science fiction', 'romance'], age: 'M'},
  {id: 2, name: 'Pretty Deadly', genre: ['fantasy', 'western']}
];

console.log(comicDB[0].genre[0])

app.use(bodyParser.urlencoded({ extend: false}));
app.use(bodyParser.json());

app.set('port', 3000);
app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/comics', function(req, res) {
	res.send(comicDB);
});


app.listen(app.get('port'), function() {
	console.log('App listening on http://localhost:%s', app.get('port'));
});
