/****************
 * SERVER LOGIC *
 ****************/
var express = require('express');
var app = express();
var path = require('path');
var sassMiddleware = require('node-sass-middleware');
var bodyParser = require('body-parser');

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'client/sass'),
    dest: path.join(__dirname, 'client/css'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/css'
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

var server = app.listen(process.env.PORT || 3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://localhost:3000');
});


/**************
 *  DATABASE  *
 **************/
var pg = require('pg');
var dburl = process.env.DATABASE_URL ? process.env.DATABASE_URL : 'pg://ointerns:tacos@localhost/originateidol';
var client = null;

// Establish connection
pg.connect(dburl, function(err, connectClient) {
  if(err)
    console.log(err);

  client = connectClient;
});



/**************
 *    API     *
 **************/
// Serving index.html to root
app.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/client/html/index.html');
});


// Selecting songs by genre
app.get('/songs-by-genre', function (req, res) {
  var genre = req.body.genre;
  console.log(req.body);
  if(!genre)
    res.send('Please enter parameters in your request to /songs-by-genre specifying genre.');

  client.query('SELECT * FROM songs WHERE genre = ' + genre, function(err, results) {
    if(err)
      res.send(err);
    else
      res.send(results.rows);
  });
});
