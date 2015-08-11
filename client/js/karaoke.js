function KaraokeApp() {
  this.visualizerCanvas=  $("#canvas").get()[0].getContext("2d");
  this.visualizer = new Visualizer(this.visualizerCanvas);
  this.userRecorder = new RecordingObject();
  this.acapellaPlayer = null;
  this.song = null;
  this.audio = new Audio();
  $('#audioContainer').append(this.audio);
}


KaraokeApp.prototype.visualizeUser = function(amplitudeArray) {
  this.visualizer.initializeUser(amplitudeArray);
}


KaraokeApp.prototype.visualizeAcapella = function(amplitudeArray) {
  this.visualizer.initializeAcapella(amplitudeArray);
}


KaraokeApp.prototype.setSong = function(title, artist) {
  this.song = {
    title: title,
    artist: artist
  }
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
}


KaraokeApp.prototype.finish = function() {
  this.audio.pause();
  this.acapellaPlayer.toggleAcapella();
  return this.userRecorder.stopRecording();
}
