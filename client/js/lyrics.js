function scroll(lyricsPath) {
  // Gives access to the lyrics
  $('body').append('<script id=\"lyricsYo\" src=\"../audio/lyrics/' + lyricsPath + '.js\"></script>');
  displayLyrics(0);
}

function displayLyrics(idx) {
  setTimeout(function() {
    // Resetting position of marquee by element death
    if($('marquee'))
      $('marquee').remove();

    $('#lyricsContainer').append('<marquee>');
    $('marquee').html(lyrics[idx].words);
    $('marquee').attr('scrollamount', 8);
    $('marquee').attr('loop', 1);

    if(lyrics[++idx])
      displayLyrics(idx);
    else
      delayedRemoval($('marquee'), lyrics[idx - 1].removalDelay);
  }, lyrics[idx].delay * 1000);
}

function delayedRemoval(element, delay) {
  setTimeout(function() {
    element.remove();
  }, delay * 1000);
}
