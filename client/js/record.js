// variables
var leftchannel = rightchannel = [];
var recorder = volume = audioInput = sampleRate = audioContext = context = null;
var recordingLength = 0;

// Ask user if we can use the microphone.
if (!navigator.getUserMedia)
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia || navigator.msGetUserMedia;

if (navigator.getUserMedia) {
  navigator.getUserMedia({audio:true}, success, function(e) {
    console.warn('Error capturing audio.');
  });
}
else {
  console.warn('getUserMedia not supported in this browser.');
}

function stopRecording() {
  recording = false;

  // get left and right audio buffers and flatten them, then
  // interleave the channels together
  var leftBuffer = mergeBuffers ( leftchannel, recordingLength );
  var rightBuffer = mergeBuffers ( rightchannel, recordingLength );
  var interleaved = interleave ( leftBuffer, rightBuffer );

  // create wav file buffer
  var buffer = new ArrayBuffer(44 + interleaved.length * 2);
  var view = new DataView(buffer);

  // RIFF chunk descriptor
  writeUTFBytes(view, 0, 'RIFF');
  view.setUint32(4, 44 + interleaved.length * 2, true);
  writeUTFBytes(view, 8, 'WAVE');
  // FMT sub-chunk
  writeUTFBytes(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  // stereo (2 channels)
  view.setUint16(22, 2, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  // data sub-chunk
  writeUTFBytes(view, 36, 'data');
  view.setUint32(40, interleaved.length * 2, true);

  // write the PCM samples
  var lng = interleaved.length;
  var index = 44;
  var volume = 1;
  for (var i = 0; i < lng; i++) {
    view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
    index += 2;
  }

  // binary blob file containing audio information
  // goes to the server for uploading
  var blob = new Blob ( [ view ], { type : 'audio/wav' } );
  return blob;
}

function record() {
  recording = true;

  // reset buffers for new recording
  leftchannel.length = rightchannel.length = 0;
  recordingLength = 0;
}

function interleave(leftChannel, rightChannel) {
  var length = leftChannel.length + rightChannel.length;
  var result = new Float32Array(length);

  var inputIndex = 0;

  for (var index = 0; index < length; ){
    result[index++] = leftChannel[inputIndex];
    result[index++] = rightChannel[inputIndex];
    inputIndex++;
  }
  return result;
}

function mergeBuffers(channelBuffer, recordingLength) {
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

function writeUTFBytes(view, offset, string) {
  var lng = string.length;
  for (var i = 0; i < lng; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function success(e) {
  // creates the audio context
  audioContext = window.AudioContext || window.webkitAudioContext;
  context = new audioContext();

  // we query the context sample rate (varies depending on platforms)
  sampleRate = context.sampleRate;

  // creates a gain node
  volume = context.createGain();

  // creates an audio node from the microphone incoming stream
  audioInput = context.createMediaStreamSource(e);

  // connect the stream to the gain node
  audioInput.connect(volume);

  /* From the spec: This value controls how frequently the audioprocess event is
  dispatched and how many sample-frames need to be processed each call.
  Lower values for buffer size will result in a lower (better) latency.
  Higher values will be necessary to avoid audio breakup and glitches */
  var bufferSize = 2048;
  recorder = context.createScriptProcessor(bufferSize, 2, 2);

  recorder.onaudioprocess = function(e) {
    if (!recording) return;
    var left = e.inputBuffer.getChannelData (0);
    var right = e.inputBuffer.getChannelData (1);
    // it is necessary to copy the samples as they occur
    // otherwise they are never kept
    leftchannel.push (new Float32Array (left));
    rightchannel.push (new Float32Array (right));
    recordingLength += bufferSize;
  }
  // we connect the recorder
  volume.connect (recorder);
  recorder.connect (context.destination);
}
