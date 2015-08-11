function KaraokeApp() {
  var canvasContext =  $("#canvas").get()[0].getContext("2d");
  this.userRecorder = new RecordingObject();
  this.userRecorder.visualizer = new Visualizer(canvasContext);
  this.song = null;
  this.audio = new Audio();
  $('#audioContainer').append(this.audio);
}


KaraokeApp.prototype.setSong = function(title, artist) {
  this.song = {
    title: title,
    artist: artist
  }
  this.audio.src = '../audio/instrumental/' + '/' + artist + '_-_' + title + '.mp3';
  this.audio.load();
}


KaraokeApp.prototype.start = function() {
  this.userRecorder.startRecording();
  this.audio.play();
}


KaraokeApp.prototype.finish = function() {
  this.audio.pause();
  return this.userRecorder.stopRecording();
}