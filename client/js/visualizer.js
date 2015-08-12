function Visualizer(canvasContext) {
  this.context = canvasContext;
  this.canvasHeight = 256;
  this.canvasWidth = 512;
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
  this.clearCanvas();
  for (var i = 0; i < this.amplitudeArrayAcapella.length; i++) {
    var value = this.amplitudeArrayAcapella[i] / 256;
    var y = this.canvasHeight - (this.canvasHeight * value) - 1;
    this.context.fillStyle = '#ccc';
    this.context.fillRect(i, y, 1, 1);
  }
  for (var i = 0; i < this.amplitudeArrayUser.length; i++) {
    var value = this.amplitudeArrayUser[i] / 256;
    var y = this.canvasHeight - (this.canvasHeight * value) - 1;
    this.context.fillStyle = '#000000';
    this.context.fillRect(i, y, 1, 1);
  }
}


Visualizer.prototype.clearCanvas = function() {
  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
}
