function Visualizer(canvasContext) {
  this.context = canvasContext;
  this.canvasHeight = 256;
  this.canvasWidth = 600;
  this.amplitudeArrayUser = null;
  this.amplitudeArrayAcapella = null;
}


Visualizer.prototype.initializeUser = function(amplitudeArray) {
  this.amplitudeArrayUser = amplitudeArray;
  this.visualizeStuff();
}


Visualizer.prototype.initializeAcapella = function(amplitudeArray) {
  this.amplitudeArrayAcapella = amplitudeArray;
}


Visualizer.prototype.visualizeStuff = function() {
  this.context.lineWidth = 1;
  this.clearCanvas();

  for (var i = 0; i < this.amplitudeArrayAcapella.length; i++) {
    this.context.strokeStyle = 'rgba(0,0,255,0.4)';
    this.context.beginPath();
    this.context.moveTo(i, 256);
    this.context.lineTo(i, 256 - this.amplitudeArrayAcapella[i] + 2);
    this.context.closePath();
    this.context.stroke();
    // var value = this.amplitudeArrayAcapella[i] / 256;
    // var y = this.canvasHeight - (this.canvasHeight * value) - 1;
    // this.context.fillStyle = '#ccc';
    // this.context.fillRect(i, y, 1, 1);
  }
  for (var i = 0; i < this.amplitudeArrayUser.length; i++) {
    this.context.strokeStyle = 'rgba(255,0,0,0.3)';
    this.context.beginPath();
    this.context.moveTo(i, 256);
    this.context.lineTo(i, 256 - this.amplitudeArrayUser[i]);
    this.context.closePath();
    this.context.stroke();
    // var value = this.amplitudeArrayUser[i] / 256;
    // var y = this.canvasHeight - (this.canvasHeight * value) - 1;
    // this.context.fillStyle = '#000000';
    // this.context.fillRect(i, y, 1, 1);
  }
}


Visualizer.prototype.clearCanvas = function() {
  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
}
