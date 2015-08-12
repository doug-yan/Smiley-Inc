var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();


createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    $('#canvasContainer').append(canvas);
    return $("#canvas").get()[0].getContext("2d");
}


function Visualizer() {
  this.canvasHeight = 400;
  this.canvasWidth = 1000;
  this.context = createHiDPICanvas(1000, 400);
  this.freqArrayUser = null;
  this.timeArrayUser = null;
  this.freqArrayAcapella = null;
  this.timeArrayAcapella = null;
}


Visualizer.prototype.initializeUser = function(timeArray, freqArray) {
  this.freqArrayUser = freqArray;
  this.timeArrayUser = timeArray
  this.visualizeStuff();
}


Visualizer.prototype.initializeAcapella = function(timeArray, freqArray) {
  this.freqArrayAcapella = freqArray;
  this.timeArrayAcapella = timeArray;
}


Visualizer.prototype.visualizeStuff = function() {
  this.context.lineWidth = 2;
  this.clearCanvas();

  for (var i = 0; i < this.freqArrayAcapella.length; i++) {
    this.context.strokeStyle = 'rgba(255,0,0,0.4)';
    this.context.beginPath();
    this.context.moveTo(i, 400);
    this.context.lineTo(i, 400 - (this.freqArrayAcapella[i]*2));
    this.context.closePath();
    this.context.stroke();
  }

  for (var i = 0; i < this.timeArrayAcapella.length; i++) {
    this.context.strokeStyle = 'rgba(255,0,255,0.3)';
    this.context.beginPath();
    this.context.moveTo(i, 250);
    this.context.lineTo(i, 250 - this.timeArrayAcapella[i]);
    this.context.closePath();
    this.context.stroke();
    // var value = this.timeArrayAcapella[i] / 400;
    // var y = this.canvasHeight - (this.canvasHeight * value) - 1;
    // this.context.fillStyle = 'rgba(255,0,255,0.4)';
    // this.context.fillRect(i, y, 2, 2);
  }

  for (var i = 0; i < this.freqArrayUser.length; i++) {
    this.context.strokeStyle = 'rgba(255,215,0,0.4)';
    this.context.beginPath();
    this.context.moveTo(i, 400);
    this.context.lineTo(i, 400 - (this.freqArrayUser[i]*2));
    this.context.closePath();
    this.context.stroke();
  }

  for (var i = 0; i < this.timeArrayUser.length; i++) {
    this.context.strokeStyle = 'rgba(255,0,0,0.25)';
    this.context.beginPath();
    this.context.moveTo(i, 250);
    this.context.lineTo(i, 250 - this.timeArrayUser[i]);
    this.context.closePath();
    this.context.stroke();
    // var value = this.timeArrayUser[i] / 400;
    // var y = this.canvasHeight - (this.canvasHeight * value) - 1;
    // this.context.fillStyle = 'rgba(255,0,0,0.3)';
    // this.context.fillRect(i, y, 2, 2);
  }
}


Visualizer.prototype.clearCanvas = function() {
  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
}
