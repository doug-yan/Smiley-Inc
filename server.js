/****************
 * SERVER LOGIC *
 ****************/
var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'client')));

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://localhost:3000');
});


/**************
 *    API     *
 **************/

// Serving index.html to root
app.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/client/html/index.html');
})
