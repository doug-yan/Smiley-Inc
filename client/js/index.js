var instrumentalAudio = document.getElementById('instrumental');

/*
 * type - 'instrumental' or 'acapella'
 * title - 'The_Kill'
 * artist - '30_Seconds_to_Mars'
 */
function playSong(type, title, artist) {
  // instrumentalAudio.src = '../audio/' + type + '/' + artist + '_-_' + title + '.mp3';
  // instrumentalAudio.load();
  // instrumentalAudio.play();

  $.ajax({
    url: '/songs-by-genre',
    type: 'GET',
    data: {'genre': 'Alternative'},
    success: function(results) {
      console.log('success!');
      console.log(results);
    },
    dataType: 'application/json'
  });
}
