function handleAudioStream(e) {
  karaoke.userRecorder.handleAudioStream(e);
}

/*
  Recording Object
  - sets up audio context on mic success
  - collects audio information on start recording
  - writes to wav file on stop recording
  - returns wav file in a blob
*/
function RecordingObject() {
  this.recording = false;
  this.leftChannel = [];
  this.rightChannel = [];
  /* From the spec: This value controls how frequently the audioprocess event is
  dispatched and how many sample-frames need to be processed each call.
  Lower values for buffer size will result in a lower (better) latency.
  Higher values will be necessary to avoid audio breakup and glitches */
  this.bufferSize = 2048;
  this.recordingLength = 0;
  this.analyserNode = this.javascriptNode = null;
  this.volume = this.sampleRate = this.timeArray = this.freqArray = null;
  this.context = this.audioInput = this.audioContext = this.recorder = null;
}


// start collecting recording data
RecordingObject.prototype.startRecording = function() {
  this.recording = true;
  this.leftChannel.length = this.rightChannel.length = 0;
  this.recordingLength = 0;
}


RecordingObject.prototype._interleave = function(leftBuffer, rightBuffer) {
  var length = leftBuffer.length + rightBuffer.length;
  var result = new Float32Array(length);

  var inputIndex = 0;

  for (var index = 0; index < length; ){
    result[index++] = leftBuffer[inputIndex];
    result[index++] = rightBuffer[inputIndex];
    inputIndex++;
  }
  return result;
}


RecordingObject.prototype._mergeBuffers = function(channelBuffer, recordingLength) {
  var result = new Float32Array(recordingLength);
  var offset = 0;
  var lng = channelBuffer.length;
  for (var i = 0; i < lng; i++){
    var buffer = channelBuffer[i];
    result.set(buffer, offset);
    offset += buffer.length;
  }
  return result;
}


RecordingObject.prototype._writeUTFBytes = function(view, offset, string) {
  var lng = string.length;
  for (var i = 0; i < lng; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}


RecordingObject.prototype._writePCMSamples = function(view, interleavedChannels) {
  var lng = interleavedChannels.length;
  var index = 44;
  var volume = 1;
  for (var i = 0; i < lng; i++) {
    view.setInt16(index, interleavedChannels[i] * (0x7FFF * volume), true);
    index += 2;
  }
  return view;
}


RecordingObject.prototype._setView = function(view, interleaveLength) {
  this._writeUTFBytes(view, 0, 'RIFF');
  view.setUint32(4, 44 + interleaveLength * 2, true);
  this._writeUTFBytes(view, 8, 'WAVE');
  this._writeUTFBytes(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, this.sampleRate, true);
  view.setUint32(28, this.sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  this._writeUTFBytes(view, 36, 'data');
  view.setUint32(40, interleaveLength * 2, true);
  return view;
}

RecordingObject.prototype.visualize = function(timeArray, freqArray) {
  this.callback(timeArray, freqArray);
}

// stops collecting recording data and writes the wav file
RecordingObject.prototype.stopRecording = function() {
  this.recording = false;

  var leftBuffer = this._mergeBuffers(this.leftChannel, this.recordingLength);
  var rightBuffer = this._mergeBuffers(this.rightChannel, this.recordingLength);
  interleavedChannels = this._interleave(leftBuffer, rightBuffer);

  var buffer = new ArrayBuffer(44 + interleavedChannels.length * 2);
  view = new DataView(buffer);
  view = this._setView(view, interleavedChannels.length);
  view = this._writePCMSamples(view, interleavedChannels);

  var userRecording = new Blob ( [ view ], { type : 'audio/wav' } );
  return userRecording;
}


// collects the adio information in the left and right channels
// do stuff with the audio stream as we store it (for example visualize it)
RecordingObject.prototype.handleAudioStream = function(e) {
  if (!this.recording) {
    return;
  }
  this.analyserNode.getByteTimeDomainData(this.timeArray);
  this.analyserNode.getByteFrequencyData(this.freqArray);

  this.visualize(this.timeArray, this.freqArray);
  var left = e.inputBuffer.getChannelData (0);
  var right = e.inputBuffer.getChannelData (1);

  // it is necessary to copy the samples as they occur
  // otherwise they are never kept
  this.leftChannel.push (new Float32Array (left));
  this.rightChannel.push (new Float32Array (right));
  this.recordingLength += this.bufferSize;
}


// setup up audio context and nodes on successful mic connection
RecordingObject.prototype.setupAudioStream = function(e) {
  // creates the audio context
  this.audioContext = window.AudioContext || window.webkitAudioContext;
  this.context = new this.audioContext();

  // we query the context sample rate (varies depending on platforms)
  this.sampleRate = this.context.sampleRate;

  // creates a gain node
  this.volume = this.context.createGain();

  // creates an audio node from the microphone incoming stream
  this.audioInput = this.context.createMediaStreamSource(e);

  // connect the stream to the gain node
  this.audioInput.connect(this.volume);

  // create script processor with correct buffer size and 2 inputs
  this.recorder = this.context.createScriptProcessor(this.bufferSize, 2, 2);

  // create some other nodes and connect them
  this.analyserNode = this.context.createAnalyser();
  this.javascriptNode = this.context.createScriptProcessor(this.bufferSize, 2, 2);
  this.timeArray = new Uint8Array(this.analyserNode.frequencyBinCount);
  this.freqArray = new Uint8Array(this.analyserNode.frequencyBinCount);

  this.audioInput.connect(this.analyserNode);
  this.analyserNode.connect(this.javascriptNode);
  this.javascriptNode.connect(this.context.destination);

  // handle audio stream
  this.recorder.onaudioprocess = handleAudioStream;

  // connect recorder to the context
  this.volume.connect(this.recorder);
  this.recorder.connect(this.context.destination);
}
