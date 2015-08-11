// play acapella in the background for the visualizer
// the user doesn't hear it
function handleAudioStreamSP(e) {
  karaoke.acapellaPlayer.handleAudioStream(e);
}

function SilentPlayer(audioSource) {
  this.audio = new Audio();
  this.audio.src = audioSource;
  this.audio.controls = false;
  $('#audioContainer').append(this.audio);

  this.isPlaying = false;
  this.volume = this.audioInput = this.analyserNode = this.amplitudeArray = null;
}


SilentPlayer.prototype.visualize = function(amplitudeArray) {
  this.callback(this.amplitudeArray);
}


SilentPlayer.prototype.startAudioStream = function() {
  // creates the audio context
  var audioContext = window.AudioContext || window.webkitAudioContext;
  var context = new audioContext();

  // creates a gain node
  this.volume = context.createGain();

  // creates an audio node from the audio
  this.audioInput = context.createMediaElementSource(this.audio);

  // connect the stream to the gain node
  this.audioInput.connect(this.volume);
  this.volume.connect(context.destination);
  this.audioInput.connect(context.destination);


  // create script processor with correct buffer size and 2 inputs
  var recorder = context.createScriptProcessor(2048, 2, 2);
  this.analyserNode = context.createAnalyser();
  this.audioInput.connect(this.analyserNode);
  this.amplitudeArray = new Uint8Array(this.analyserNode.frequencyBinCount);
  this.analyserNode.getByteFrequencyData(this.amplitudeArray);

  // handle audio stream
  recorder.onaudioprocess = handleAudioStreamSP;

  // connect recorder to the context
  recorder.connect(context.destination);
}


SilentPlayer.prototype.handleAudioStream = function(e) {
  if (!this.isPlaying) {
    return;
  }
  this.volume.gain.value = 0.05;
  this.analyserNode.getByteTimeDomainData(this.amplitudeArray);
  this.visualize(this.amplitudeArray);
}


SilentPlayer.prototype.toggleAcapella = function() {
  if (this.isPlaying) {
    this.isPlaying = false;
    this.audio.pause();
  }
  else {
    this.isPlaying = true;
    this.audio.play();
    this.startAudioStream();
  }
}
