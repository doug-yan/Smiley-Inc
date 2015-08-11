function KaraokeApp() {
  this.visualizerCanvas=  $("#canvas").get()[0].getContext("2d");
  this.userRecorder = new RecordingObject();
  this.userRecorder.visualizer = new Visualizer(this.visualizerCanvas);
  this.acapellaPlayer = null;
  this.song = null;
  this.audio = new Audio();
  $('#audioContainer').append(this.audio);
}


KaraokeApp.prototype.setSong = function(title, artist) {
  this.song = {
    title: title,
    artist: artist
  }
  this.audio.src = '../audio/instrumental/' + artist + '_-_' + title + '.mp3';
  this.acapellaPlayer = new SilentPlayer('../audio/acapella/' + artist + '_-_' + title + '.mp3');
  this.acapellaPlayer.visualizer = new Visualizer(this.visualizerCanvas);
  this.audio.load();
}


KaraokeApp.prototype.start = function() {
  this.userRecorder.startRecording();
  this.acapellaPlayer.toggleAcapella();
  this.audio.play();
}


KaraokeApp.prototype.finish = function() {
  this.audio.pause();
  this.acapellaPlayer.toggleAcapella();
  return this.userRecorder.stopRecording();
}
