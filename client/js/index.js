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


function clearSearchResults() {
  //clear previous results
  this.searchResults.innerHTML = '';
  this.searchResultsContainer.style.display = 'none';
}


function search() {
  var results = [{title:'The_Kill', artist:'30_Seconds_to_Mars', type:'instrumental'}];
  clearSearchResults();

  //create result list
  results.forEach(function(result) {
    var songWrapper = document.createElement('li');
    var song = document.createElement('span');
    song.innerText = result.title + ' - ' + result.artist + '(' + result.type + ')';
    songWrapper.appendChild(song);

    songWrapper.addEventListener('click', function() {
      playSong(result.type, result.title, result.artist);
      clearSearchResults();
    });

    this.searchResults.appendChild(songWrapper);
    this.searchResultsContainer.style.display = 'block';
  });
  event.preventDefault();
}
