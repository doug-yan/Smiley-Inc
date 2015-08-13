/****************
 * SERVER LOGIC *
 ****************/
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var sassMiddleware = require('node-sass-middleware');
var bodyParser = require('body-parser');
var pythonShell = require('python-shell');

pythonShell.defaultOptions = { scriptPath: '../python' };

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
app.use(require('multer')({dest: './client/uploads/'}).single('recording'));
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

// Establish connection and prepare statements
pg.connect(dburl, function(err, connectClient) {
  var preparedStatements = [
    "PREPARE songs_by_genre (text) AS SELECT * FROM songs WHERE genre = $1;",
    "PREPARE songs_by_artist (text) AS SELECT * FROM songs WHERE artist = $1;",
    "PREPARE songs_by_song (text) AS SELECT * FROM songs WHERE title = $1 AND artist = $2;",
    "PREPARE highscores_by_song (text) AS SELECT name, picture, score FROM highscores WHERE artist = $1 AND title = $2 ORDER BY score desc LIMIT 100;",
    "PREPARE highscores_by_userId (text) AS SELECT title, name, picture, artist, score FROM highscores WHERE userId = $1 ORDER BY score desc LIMIT 100;",
    "PREPARE highscores_by_artist (text) AS SELECT name, picture, title, score FROM highscores, " +
     "(SELECT MAX(score) AS highest FROM highscores WHERE artist = $1 GROUP BY title) AS highest " +
     "WHERE highest = score AND artist = $1 ORDER BY highest DESC;",
    "PREPARE new_highscore (integer, text) AS UPDATE highscores SET score = $1 WHERE userId = $2 AND title = $3 AND artist = $4;",
    "PREPARE highscore_check (text) AS SELECT score FROM highscores WHERE userId = $1 AND title = $2 AND artist = $3;",
    "PREPARE highscores_by_score AS SELECT name, picture, title, artist, score FROM highscores ORDER BY score desc LIMIT 100;"
  ];

  if(err)
    console.warn(err);

  client = connectClient;

  preparedStatements.forEach(function(statement) {
    client.query(statement, function(err, results) {
      if(err)
        console.warn(err);
    });
  });
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
  else
    query(res, "EXECUTE songs_by_genre ('" + genre + "');");
});


// Querying songs by artist
app.get('/songs-by-artist', function (req, res) {
  var artist = req.query.artist;

  if(!artist)
    res.send('Please enter parameters in your request to /songs-by-artist specifying artist.');
  else
    query(res, "EXECUTE songs_by_artist ('" + artist + "');");
});


// Querying songs by song
app.get('/songs-by-song', function (req, res) {
  var title = req.query.title;
  var artist = req.query.artist;

  if(!title || !artist)
    res.send('Please enter parameters in your request to /songs-by-artist specifying artist.');
  else
    query(res, "EXECUTE songs_by_song ('" + title + "', '" + artist + "');");
});


// Querying highscores by song
app.get('/highscores-by-song', function (req, res) {
  var title = req.query.title;
  var artist = req.query.artist;

  if(!title || !artist)
    res.send('Please enter parameters in your request to /highscores-by-song specifying title and artist.');
  else
    query(res, "EXECUTE highscores_by_song ('" + artist + "', '" + title + "');");
});


// Querying highscores by user
app.get('/highscores-by-userId', function(req, res) {
  var userId = req.query.userId;

  if(!userId)
    req.send('Please enter parameters in your request to /highscores-by-user specifying userId.');
  else
    query(res, "EXECUTE highscores_by_userId ('" + userId + "');");
});


// Query highscores by all songs of an artist
app.get('/highscores-by-artist', function(req, res) {
  var artist = req.query.artist;

  if(!artist)
    req.send('Please enter parameters in your request to /highscores-by-artist specifying artist.');
  else
    query(res, "EXECUTE highscores_by_artist ('" + artist + "');");
});


// Query highscores by score
app.get('/highscores-by-score', function(req, res) {
  query(res, "EXECUTE highscores_by_score;");
});


app.get('/song-notes', function(req, res) {
  pythonShell.run('grade.py', { args: [req.song] }, function (err, results) {
    res.send({notes: results});
  });
});


app.post('/grade', function(req, res) {
  pythonShell.run('grade.py', { args: [req.reference, req.karaoke], function (err, results) {
    res.send({grade: results});
  }})
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

  serverQuery("EXECUTE highscore_check ('" + userId + "', '" + title + "', '" + artist + "');", function(err, results) {
    // New Highscore
    if(!results.rowCount || score > results.rows[0].score) {
      query(null, "EXECUTE new_highscore (" + score + ", '" + userId + "', '" + title + "', '" + artist + "');");
      res.send({status: 'updated', score: score});
    }
    else
      res.send(false);
  });
});


app.post('/user-recording', function(req, res) {
  var tmp_path = req.file.path;
  var target_path = 'client/uploads/recording.wav';

  fs.rename(tmp_path, target_path, function(err) {
    if (err) {
      throw err;
    }
    fs.unlink(tmp_path, function() {
      if (err) {
        throw err;
      }
      else {
        res.send('Recording uploaded.');
      }
    })
  })
});
