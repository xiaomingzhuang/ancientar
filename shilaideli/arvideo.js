var getUserMedia = function (t, onsuccess, onerror) {
	if (navigator.getUserMedia) {
		return navigator.getUserMedia(t, onsuccess, onerror);
	} else if (navigator.webkitGetUserMedia) {
		return navigator.webkitGetUserMedia(t, onsuccess, onerror);
	} else if (navigator.mozGetUserMedia) {
		return navigator.mozGetUserMedia(t, onsuccess, onerror);
	} else if (navigator.msGetUserMedia) {
		return navigator.msGetUserMedia(t, onsuccess, onerror);
	} else {
		onerror(new Error("No getUserMedia implementation found."));
	}
};

var URL = window.URL || window.webkitURL;
var createObjectURL = URL.createObjectURL || webkitURL.createObjectURL;
if (!createObjectURL) {
	throw new Error("URL.createObjectURL not found.");
}
var threshHold = 128;
var video = document.createElement('video');
video.width = 640;
video.height = 480;
video.loop = true;
video.volume = 0;
video.autoplay = true;
video.controls = true;

getUserMedia({
	'video' : true
}, function (stream) {
	var url = createObjectURL(stream);
	video.src = url;
}, function (error) {
	alert("Couldn't access webcam.");
});

var canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 240;
var videoCanvas = document.createElement('canvas');
videoCanvas.width = video.width;
videoCanvas.height = video.height;
var ctx = canvas.getContext('2d');
var raster = new NyARRgbRaster_Canvas2D(canvas);
var param = new FLARParam(320, 240);
var resultMat = new NyARTransMatResult();
var detector = new FLARMultiIdMarkerDetector(param, 120);
detector.setContinueMode(true);
var tmp = new Float32Array(16);