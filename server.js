/****************
 * SERVER LOGIC *
 ****************/
var express = require('express');
var app = express();
var path = require('path');
var sassMiddleware = require('node-sass-middleware');
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'client/sass'),
    dest: path.join(__dirname, 'client/css'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/css'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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
    console.warn(err);

  client = connectClient;
});


/**************
 *    API     *
 **************/
// Serving index.html to root
app.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/client/html/index.html');
});


// Query Thing
function query(res, query) {
  client.query(query, function(err, results) {
    if(err)
      res.send(err);
    else if(res)
      res.send(results.rows);
  });
}


function serverQuery(query, callback) {
  client.query(query, function(err, results) {
    callback(err, results);
  });
}

/* Querying songs by genre

   SAMPLE QUERY
 * $.get('/songs-by-genre', {'genre': 'Alternative'}, function(results, status) {
 *   console.log(results);
 * });


 * [{
 *     artist: "30_Seconds_to_Mars"
 *     difficulty: 6
 *     duration: 243
 *     genre: "Alternative"
 *     title: "The_Kill"
 *   }]
 */
app.get('/songs-by-genre', function (req, res) {
  var genre = req.query.genre;

  if(!genre)
    res.send('Please enter parameters in your request to /songs-by-genre specifying genre.');

  query(res, "SELECT * FROM songs WHERE genre = '" + genre + "';");
});


// Querying songs by artist
app.get('/songs-by-artist', function (req, res) {
  var artist = req.query.artist;

  if(!artist)
    res.send('Please enter parameters in your request to /songs-by-artist specifying artist.');

  query(res, "SELECT * FROM songs WHERE artist = '" + artist + "' LIMIT 100;");
});


// Querying highscores by song
app.get('/highscores-by-song', function (req, res) {
  var title = req.query.title;
  var artist = req.query.artist;

  if(!title || !artist)
    res.send('Please enter parameters in your request to /highscores-by-song specifying title and artist.');

  query(res, "SELECT userId, score FROM highscores WHERE artist = '" + artist + "' AND title = '" + title + "' LIMIT 100;");
});


// Querying highscores by user
app.get('/highscores-by-userId', function(req, res) {
  var userId = req.query.userId;

  if(!userId)
    req.send('Please enter parameters in your request to /highscores-by-user specifying userId.');

  query(res, "SELECT title, artist, score FROM highscores WHERE userId = '" + userId + "' LIMIT 100;");
});


// Query highscores by all songs of an artist
app.get('/highscores-by-artist', function(req, res) {
  var artist = req.query.artist;

  if(!artist)
    req.send('Please enter parameters in your request to /highscores-by-artist specifying artist.');

  query(res, "SELECT userId, title, highest FROM highscores, " +
   "(SELECT MAX(score) AS highest FROM highscores WHERE artist = '" + artist + "' GROUP BY title) AS highest " +
   "WHERE highest = score AND artist = '" + artist + "';");
});


// Checks to see if the user has a new high score for a song,
// if so the value is updated in the database
// Sends false if the high score is not updated
// Sends {status: 'updated', score: '583'} if the high score is updated
/* Example
  $.post('/new-highscore', {userId: '1234567890', score: 583, artist: 'Taylor_Swift', title: 'Blank_Space'})
    .done(function(data) {
      console.log(data);
    });
*/
app.post('/new-highscore', function(req, res) {
  var userId = req.body.userId;
  var score = req.body.score;
  var title = req.body.title;
  var artist = req.body.artist;

  serverQuery("SELECT score FROM highscores WHERE userId = '" + userId + "' AND title = '" + title +
   "' AND artist = '" + artist + "';", function(err, results) {
    // New Highscore
    if(!results.rowCount || score > results.rows[0].score) {
      query(null, "UPDATE highscores SET score = " + score + " WHERE userId = '" + userId + "' AND title = '" +
       title + "' AND artist = '" + artist + "';");
      res.send({status: 'updated', score: score});
    }
    else
      res.send(false);
  });
});



/**************
 *   Python   *
 **************/

/*** Running a Python Script ***/
/*
	PythonShell.run('my_script.py', function (err) {
	  if (err) throw err;
	  console.log('finished');
	});
*/

/*** Running a Python Script with Arguments and options ***/
/*
	var options = {
	  mode: 'text',
	  pythonPath: 'path/to/python',
	  pythonOptions: ['-u'],
	  scriptPath: 'path/to/my/scripts',
	  args: ['value1', 'value2', 'value3']
	};

	PythonShell.run('my_script.py', options, function (err, results) {
	  if (err) throw err;
	  // results is an array consisting of messages collected during execution
	  console.log('results: %j', results);
	});
*/

/*** Exchanging Data between Python and Node ***/
/*
	var pyshell = new PythonShell('my_script.py');

	// sends a message to the Python script via stdin
	pyshell.send('hello');

	pyshell.on('message', function (message) {
	  // received a message sent from the Python script (a simple "print" statement)
	  console.log(message);
	});

	// end the input stream and allow the process to exit
	pyshell.end(function (err) {
	  if (err) throw err;
	  console.log('finished');
});
*/
