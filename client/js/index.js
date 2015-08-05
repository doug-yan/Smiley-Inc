var instrumentalAudio = document.getElementById('instrumental');

/*
 * type - 'instrumental' or 'acapella'
 * title - 'The_Kill'
 * artist - '30_Seconds_to_Mars'
 */
function playSong(type, title, artist) {
  instrumentalAudio.src = '../audio/' + type + '/' + artist + '_-_' + title + '.mp3';
  instrumentalAudio.load();
  instrumentalAudio.play();
}


// clear previous results
function clearSearchResults() {
  $('#searchResults').empty();
  $('#searchResultsContainer').hide();
}


// add search results and click handler
function addSearchResults(results) {
  results.forEach(function(song) {
    $('<li/>').append(
      $('<span/>', {
        text: song.title + ' - ' + song.artist + ' (' + song.genre + ')',
        click: function() {
          clearSearchResults();
          playSong('instrumental', song.title, song.artist);
        }
      }))
        .appendTo('#searchResults');
  $('#searchResultsContainer').css('display','inline-block');
  });
}


// send search input
$(document).ready(function() {
  $('#searchForm').bind('submit', function() {
    event.preventDefault();
    clearSearchResults();

    //parse form
    var formData = $(this).serializeArray();
    console.log(formData);
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
    record();
  })

  $('#stopRecordingButton').bind('click', function() {
    userRecording = stopRecording();
    var fd = new FormData();
    fd.append('recording', userRecording, recording);

    $.ajax({
        type: 'POST',
        url: '/user-recording',
        data: fd,
        processData: false,
        contentType: false
    }).done(function(data) {
        console.log(data);
    });
  });
});

