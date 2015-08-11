function scroll(lyricsPath) {
  // Gives access to the lyrics
  $('body').append('<script id=\"lyricsYo\" src=\"../audio/lyrics/' + lyricsPath + '.js\"></script>');
  displayLyrics(0);
}

function highlight(idx, spaces) {
  var pauseDuration = 1000;

  setTimeout(function() {
    var all = $('marquee').html();
    var word = all.substr(0, all.indexOf('&nbsp'));
    var rest = all.substr(all.indexOf('&nbsp') + 6);

    if(all.substr('&nbsp') !== -1)
      $('marquee').html("<span class='highlighted'>" + word + ' </span>' + rest);


    if(idx++ < spaces)
      highlight(idx, spaces);
  }, pauseDuration);
}

function displayLyrics(idx) {
  setTimeout(function() {
    // Resetting position of marquee by element death
    if($('marquee'))
      $('marquee').remove();

    $('#lyricsContainer').append('<marquee>');
    $('marquee').html(lyrics[idx].words);

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
