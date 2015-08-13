function scroll(lyricsPath) {
  // Gives access to the lyrics
  $('body').append('<script id=\"lyricsYo\" src=\"../audio/lyrics/' + lyricsPath + '.js\"></script>');
  displayLyrics(0);
}

function displayLyrics(idx) {
  setTimeout(function() {
    $('#lyricsContainer').empty();
    $('#lyricsContainer').html(lyrics[idx].words);
    $('#lyricsContainer').fadeOut({duration: 0});
    $('#lyricsContainer').fadeIn();

    if(lyrics[++idx])
      displayLyrics(idx);
    else
      delayedRemoval(lyrics[idx - 1].removalDelay);
  }, (lyrics[idx].delay - .08) * 1000);
}

function delayedRemoval(delay) {
  setTimeout(function() {
    $('#lyricsContainer').fadeOut({duration: 1000});
  }, delay * 1000);
}
