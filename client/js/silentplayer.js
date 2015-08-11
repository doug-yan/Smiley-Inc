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

  this.visualizer = null;
  this.isPlaying = false;
}

SilentPlayer.prototype.startAudioStream = function() {
  // creates the audio context
  this.audioContext = window.AudioContext || window.webkitAudioContext;
  this.context = new this.audioContext();

  // creates a gain node
  this.volume = this.context.createGain();


  // creates an audio node from the microphone incoming stream
  this.audioInput = this.context.createMediaElementSource(this.audio);

  // connect the stream to the gain node
  this.audioInput.connect(this.volume);

  // create script processor with correct buffer size and 2 inputs
  this.recorder = this.context.createScriptProcessor(2048, 2, 2);
  this.volume.gain.value = 2;
  // create some other nodes and connect them
  this.analyserNode = this.context.createAnalyser();
  this.javascriptNode = this.context.createScriptProcessor(this.bufferSize, 2, 2);
  this.amplitudeArray = new Uint8Array(this.analyserNode.frequencyBinCount);
  this.analyserNode.getByteFrequencyData(this.amplitudeArray);

  this.audioInput.connect(this.analyserNode);
  this.analyserNode.connect(this.javascriptNode);
  this.javascriptNode.connect(this.context.destination);

  // handle audio stream
  this.recorder.onaudioprocess = handleAudioStreamSP;

  // connect recorder to the context
  this.volume.connect(this.recorder);
  this.recorder.connect(this.context.destination);
}


SilentPlayer.prototype.handleAudioStream = function(e) {
  if (!this.isPlaying) {
    return;
  }
  this.analyserNode.getByteTimeDomainData(this.amplitudeArray);
  this.visualizer.initialize(this.amplitudeArray);
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
