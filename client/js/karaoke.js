function KaraokeApp() {
  this.visualizer = new Visualizer();
  this.userRecorder = new RecordingObject();
  this.acapellaPlayer = null;
  this.song = null;
  this.lyrics = null;
  this.audio = new Audio();
  $('#audioContainer').append(this.audio);
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
  this.acapellaPlayer = new SilentPlayer('../audio/acapella/' + artist + '_-_' + title + '.mp3');
  this.audio.load();
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
  this.acapellaPlayer.toggleAcapella();
  return this.userRecorder.stopRecording();
}
