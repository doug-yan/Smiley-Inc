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
  $('#searchResultsContainer').show();
  });
}

// send search input
$(document).ready(function() {
  $('#searchForm').bind('submit', function() {
    event.preventDefault();
    clearSearchResults();

    //parse form
    var formData = $(this).serializeArray();
    searchInput = formData[0].value;
    searchCategory = formData[1].value;

    //send search by genre
    if (searchCategory == 'bygenre') {
      $.get('/songs-by-genre', {genre: searchInput})
        .done(function(data) {
          addSearchResults(data);
        });
    }
  });
});
