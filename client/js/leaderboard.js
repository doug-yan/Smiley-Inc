function displayLeaderboard() {
  $('#sing').hide();
  $('#score').hide();
  $('#leaderboard').show();
  $('#viewToggle').html('Sing');
  $('#viewToggle').unbind('click');
  $('#viewToggle').bind('click', function() {
    displayKaraoke();
  });

  populateLeaderboard('/highscores-by-score', null);
}


function displayKaraoke() {
  $('#sing').show();
  if (appRunning == false) {
    resetApp();
  }
  $('#leaderboard').hide();
  $('#viewToggle').html('Leaderboards');
  $('#viewToggle').unbind('click');
  $('#viewToggle').bind('click', function() {
    displayLeaderboard();
  });
}


function populateLeaderboard(endpoint, data) {
  clearLeaderboard();

  $.get(endpoint, data)
    .done(function(data) {
      populateHelper(data);
    });
}


function populateHelper(data) {
  $('#leaderboardHeaders').append('<th>name</th>');

  for(key in data[0]) {
    if(key !== 'picture' && key !== 'name')
      $('#leaderboardHeaders').append('<th>' + key + '</th>');
  }

  data.forEach(function(entry) {
    var tuple = '<tr>';

    tuple += '<td><img class=\"userPic picture\" src=\"' + entry.picture + '\"</img>' + entry.name + '</td>';
    for(key in entry) {
      switch(key) {
        case 'name':
          break;
        case 'picture':
          break;
        default:
          tuple += '<td>' + entry[key].toString().replace(/_/g, ' ') + '</td>';
      }
    }

    tuple += '</tr>';
    $('#leaderboardBody').append(tuple);
  });
}


function clearLeaderboard() {
  $('#leaderboardHeaders').empty();
  $('#leaderboardBody').empty();
}


function leaderboardSelect() {
  var newVal;

  switch($('#leaderboardCategory').val()) {
    case '/highscores-by-userId':
      if(userId) {
        $('#leaderboardForm').trigger('reset');
        $('#myHighscores').attr('selected', 'selected');
        $('#leaderboardFilter').attr('value', userId);
        return;
      }

      newVal = 'Please sign in first';
      break;
    case '/highscores-by-song':
      $('#leaderboardFilter').attr('value', '');
      newVal = 'Taylor Swift - Shake it Off';
      break;
    case '/highscores-by-artist':
      $('#leaderboardFilter').attr('value', '');
      newVal = 'Taylor Swift';
      break;
    default:
      $('#leaderboardFilter').attr('value', '');
      newVal = 'No input needed';
  }

  $('#leaderboardFilter').attr('placeholder', newVal);
}


function filterSelection(endpoint) {
  switch(endpoint) {
    case '/highscores-by-userId':
      return 'userId';
    case '/highscores-by-song':
      return 'song';
    case '/highscores-by-artist':
      return 'artist';
    default:
      return null;
  }
}


// song = 'Taylor Swift - Shake it Off'
function filterBySong(song) {
  var artist = song.substr(0, song.indexOf('-') - 1);
  var title = song.substr(song.indexOf('-') + 2);

  return {'title': title.replace(/ /g, '_'), 'artist': artist.replace(/ /g, '_')};
}


function idCheck(filter, value) {
  return (filter === 'userId' && userId && !isNaN(value)) || filter !== 'userId';
}
