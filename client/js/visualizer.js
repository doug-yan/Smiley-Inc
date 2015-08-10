function Visualizer(canvasContext) {
  this.context = canvasContext;
  this.canvasHeight = 256;
  this.canvasWidth = 512;
  this.amplitudeArray = null;
}


Visualizer.prototype.initialize = function(amplitudeArray) {
  this.amplitudeArray = amplitudeArray;
  this.visualizeStuff();
}


Visualizer.prototype.visualizeStuff = function() {
  this.clearCanvas();
  for (var i = 0; i < this.amplitudeArray.length; i++) {
    var value = this.amplitudeArray[i] / 256;
    var y = this.canvasHeight - (this.canvasHeight * value) - 1;
    this.context.fillStyle = '#000000';
    this.context.fillRect(i, y, 1, 1);
  }
}


Visualizer.prototype.clearCanvas = function() {
  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
}
