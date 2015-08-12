function displayLeaderboard() {
  $('.sing').hide();
  $('.leaderboard').show();
  $('#viewToggle').html('Sing');
  $('#viewToggle').bind('click', function() {
    displayKaraoke();
  });
}

function displayKaraoke() {
  $('.sing').show();
  $('.leaderboard').hide();
  $('#viewToggle').html('Leaderboards');
  $('#viewToggle').bind('click', function() {
    displayLeaderboard();
  });
}
