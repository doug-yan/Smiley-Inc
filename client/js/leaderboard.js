function displayLeaderboard() {
  $('.sing').hide();

  $('#viewToggle').html('Sing');
  $('#viewToggle').bind('click', function() {
    displayKaraoke();
  });
}

function displayKaraoke() {
  $('.sing').show();
  $('#viewToggle').html('Leaderboards');
  $('#viewToggle').bind('click', function() {
    displayLeaderboard();
  });
}
