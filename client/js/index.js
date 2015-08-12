var micInit = false;
var karaoke = null;

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


// add search results and click handler
function addSearchResults(results) {
  noSongError(false);
  results.forEach(function(song) {
    $('<li/>').append(
      $('<span/>', {
        text: song.title + ' - ' + song.artist + ' (' + song.genre + ')',
        click: function() {
          clearSearchResults();
          noSongError(false);
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


function initMic() {
  micInit = true;
  if (!navigator.getUserMedia)
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({audio:true}, success, function(e) {
      console.warn('Error capturing audio.');
    });
  }
  else {
    console.warn('getUserMedia not supported in this browser.');
  }
}

function success(e) {
  karaoke.userRecorder.setupAudioStream(e);
}


$(document).ready(function() {
  karaoke = new KaraokeApp();

  $('#signOut').hide();

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
    if (searchCategory == 'bygenre') {
      $.get('/songs-by-genre', {genre: searchGenre})
        .done(function(data) {
          addSearchResults(data);
        });
    }
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
    if (!micInit) {
      initMic();
    }
    karaoke.start();
  })

  $('#stopRecordingButton').bind('click', function() {
    userRecording = karaoke.finish();
    var fd = new FormData();
    fd.append('recording', userRecording);

    $.ajax({
      type: 'POST',
      url: '/user-recording',
      data: fd,
      processData: false,
      contentType: false
    }).done(function(data) {});
  });
});
