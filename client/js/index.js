var micInit = false;
var karaoke = null;
var appRunning = false;


function resetApp() {
  $('#canvasContainer').empty();
  $('#chosenSongContainer').hide();
  karaoke = null;
  micInit = false;
  karaoke = new KaraokeApp();
}


/*
 * type - 'instrumental' or 'acapella'
 * title - 'The_Kill'
 * artist - '30_Seconds_to_Mars'
 */

// clear previous results
function clearSearchResults() {
  $('#searchResults').empty();
  $('#searchResultsContainer').hide();
}


function addChosenSong(title, artist) {
  $('#chosenSongContainer').show();
  $('#chosenSongContainer').empty();
  $('<span/>', {text: 'You have chosen to sing: ' + title + ' - ' + artist})
    .appendTo('#chosenSongContainer');
  $('#chosenSongContainer').css('display', 'inline-block');
}


// add search results and click handler
function addSearchResults(results) {
  noSongError(false);
  console.log(results);
  results.forEach(function(song) {
    var title = song.title.replace(/_/g, ' ');
    var artist = song.artist.replace(/_/g, ' ');
    $('<li/>').append(
      $('<span/>', {
        text: title + ' - ' + artist + ' (' + song.genre + ')',
        click: function() {
          clearSearchResults();
          noSongError(false);
          addChosenSong(title, artist);
          karaoke.setSong(song.title, song.artist);
        }
      }))
        .appendTo('#searchResults');
  $('#searchResultsContainer').css('display','inline-block');
  });
}


function noSongError(error) {
  if (error) {
    $('#errorContainer').empty();
    $('<span/>', {
      text: 'You have not yet chosen a song to sing.'
    }).appendTo('#errorContainer');
    $('#errorContainer').css('display','inline-block');
  }
  else {
    $('#errorContainer').empty();
    $('#errorContainer').hide();
  }
}


function initMic(done) {
  if (!navigator.getUserMedia)
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      {audio:true},
      function(e) {
        micInit = true;
        karaoke.userRecorder.setupAudioStream(e);
        done();
      },
      function(e) {
        console.warn('Error capturing audio.');
      }
    );
  }
  else {
    console.warn('getUserMedia not supported in this browser.');
  }
}


function showScore(score) {
  var explainText = ''
  if (score[0] !== 'Y') {
    explainText = 'The average number of MIDI notes you were off by is:'
  }
  $('#scoreHolder').empty();
  $('<span/>', {
    text: score
  }).appendTo('#scoreHolder');
  $('<span/>', {
    text: explainText
  }).appendTo('#explanation');
  $('#sing').hide();
  $('#score').show();
}


$(document).ready(function() {
  karaoke = new KaraokeApp();
  $('#signOut').hide();
  $('#leaderboard').hide();
  $('#score').hide();


  $('#viewToggle').bind('click', function() {
    displayLeaderboard();
  });


  $('#searchForm').bind('submit', function() {
    event.preventDefault();
    clearSearchResults();

    //parse form
    var formData = $(this).serializeArray();
    searchInput = formData[0].value;
    searchGenre = formData[1].value;
    searchCategory = formData[2].value;

    //send search by genre
    if (searchCategory === 'bygenre') {
      $.get('/songs-by-genre', {genre: searchGenre})
        .done(function(data) {
          addSearchResults(data);
        });
    }

    //send search by artist
    if (searchCategory === 'byartist') {
      searchInput = toTitleCase(searchInput).replace(/ /g, '_');
      $.get('/songs-by-artist', {artist: searchInput})
        .done(function(data) {
          addSearchResults(data);
        });
    }

    //send search by song
    if (searchCategory === 'bysong') {
      song = toTitleCase(searchInput).replace(/ /g, '_');
      var artist = song.substr(0, song.indexOf('-') - 1);
      var title = song.substr(song.indexOf('-') + 2);
      $.get('/songs-by-song', {artist: artist, title: title})
        .done(function(data) {
          addSearchResults(data);
        });
    }
  });


  $('#retryButton').bind('click', function() {
    resetApp();
    $('#score').hide();
    $('#sing').show();
  });


  $('#leaderboardForm').bind('submit', function() {
    event.preventDefault();

    //parse form
    var formData = $(this).serializeArray();
    var input = formData[0].value;
    var endpoint = formData[1].value;
    var data = {};
    var filter = filterSelection(endpoint);

    // Build object
    data[filter] = input.replace(/ /g, '_');

    if(filter === 'song' && input)
      data = filterBySong(input);

    if(idCheck(filter, input))
      populateLeaderboard(endpoint, data);
  });


  $('#searchCategory').bind('change', function() {
    var category = $(this).serializeArray();
    if (category[0].value == 'bygenre') {
      $('#searchInput').hide();
      $('#searchGenre').show();
    }
    else if (category[0].value == 'byartist') {
      $('#searchGenre').hide();
      $('#searchInput').attr('placeholder','Search for a song to play by artist.').show();
    }
    else {
      $('#searchGenre').hide();
      $('#searchInput').attr('placeholder','Search for a song to play by song name.').show();
    }
  });


  $('#recordButton').bind('click', function() {
    if (karaoke.song === null) {
      noSongError(true);
      return;
    }
    $.get('/song-notes', {song: karaoke.getSong()})
      .done(function(data) {
        console.log(data);
        if (micInit) {
          karaoke.start();
          appRunning = true;
        }
        else {
          initMic(function done() { karaoke.start();
            appRunning = true;
          });
        }
      });
  })

  $('#submitScoreButton').bind('click', function() {
    if (!karaoke.userId) {
      return;
    }
    $.post('/new-highscore', {
      userId: karaoke.userId,
      score: karaoke.score,
      artist: karaoke.song.artist,
      title: karaoke.song.title,
    }).done(function(data) {

    });
  });

  // Enable this code and disable the below for a stop button
  // also enable stop button in index.html
  // $('#stopRecordingButton').bind('click', function() {
  //   userRecording = karaoke.finish();
  //   var fd = new FormData();
  //   fd.append('recording', userRecording);
  //   fd.append('reference', karaoke.getSong());
  //
  //   $.ajax({
  //     type: 'POST',
  //     url: '/user-recording',
  //     data: fd,
  //     processData: false,
  //     contentType: false
  //   }).done(function(data) {
  //     showScore(data.grade);
  //     karaoke.score = data.grade;
  //     appRunning = false;
  //   });
  // });

  $('#instrumental').bind('ended', function() {
    userRecording = karaoke.finish();
    var fd = new FormData();
    fd.append('recording', userRecording);
    fd.append('reference', karaoke.getSong());

    $.ajax({
      type: 'POST',
      url: '/user-recording',
      data: fd,
      processData: false,
      contentType: false
    }).done(function(data) {
      showScore(data.grade);
      karaoke.score = data.grade;
      appRunning = false;
    });
  });

});


function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
