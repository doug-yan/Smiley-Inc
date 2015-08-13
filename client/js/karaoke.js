function KaraokeApp() {
  this.userID = null;
  this.score = null;
  this.visualizer = new Visualizer();
  this.userRecorder = new RecordingObject();
  this.acapellaPlayer = new SilentPlayer();
  this.song = null;
  this.lyrics = null;
  this.audio = document.getElementById('instrumental');
}


KaraokeApp.prototype.visualizeUser = function(timeArray, freqArray) {
  this.visualizer.initializeUser(timeArray, freqArray);
}


KaraokeApp.prototype.visualizeAcapella = function(timeArray, freqArray) {
  this.visualizer.initializeAcapella(timeArray, freqArray);
}


KaraokeApp.prototype.setSong = function(title, artist) {
  this.song = {
    title: title,
    artist: artist
  }
  this.lyrics = artist + '_-_' + title;
  this.audio.src = '../audio/instrumental/' + artist + '_-_' + title + '.mp3';
  this.acapellaPlayer.setSong('../audio/acapella/' + artist + '_-_' + title + '.mp3');
  this.audio.load();
}


KaraokeApp.prototype.getSong = function() {
  if (this.song === null) {
    return null
  }
  return this.song.artist + '_-_' + this.song.title + '.mp3';
}


KaraokeApp.prototype.start = function() {
  this.userRecorder.callback = this.visualizeUser.bind(this);
  this.acapellaPlayer.callback = this.visualizeAcapella.bind(this);

  this.userRecorder.startRecording();
  this.acapellaPlayer.toggleAcapella();
  this.audio.play();
  scroll(this.lyrics);
}


KaraokeApp.prototype.finish = function() {
  this.audio.pause();
  this.visualizer.visualizing = false;
  this.acapellaPlayer.toggleAcapella();
  return this.userRecorder.stopRecording();
}
