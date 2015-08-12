function displayLeaderboard() {
  $('.sing').hide();
  $('.leaderboard').show();
  $('#viewToggle').html('Sing');
  $('#viewToggle').unbind('click');
  $('#viewToggle').bind('click', function() {
    displayKaraoke();
  });

  populateLeaderboard('/highscores-by-score');
}


function displayKaraoke() {
  $('.sing').show();
  $('.leaderboard').hide();
  $('#viewToggle').html('Leaderboards');
  $('#viewToggle').unbind('click');
  $('#viewToggle').bind('click', function() {
    displayLeaderboard();
  });
}


function populateLeaderboard(metric) {
  clearLeaderboard();

  $.get(metric)
    .done(function(data) {
      populateHelper(data);
    });
}


function populateHelper(data) {
  for(key in data[0]) {
    if(key !== 'picture')
      $('#leaderboardHeaders').append('<th>' + key[0].toUpperCase() + key.slice(1) + '</th>');
  }

  data.forEach(function(entry) {
    var tuple = '<tr>';

    for(key in entry) {
      switch(key) {
        case 'name':
          tuple += '<td><img class=\"userPic picture\" src=\"' + entry.picture + '\"</img>' + entry.name + '</td>';
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
  $('#leaderboardBody').html('');
}
