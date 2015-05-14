/**
 * Author:  Marco Gagliardi
 * Email:   marcogagliardi84@gmail.com
 */

var Presence = function () {

    var self = this;

    /* Configuration */
    self.rate = 400; //refresh rat in ms
    self.mismatchThreshold = 0.01; //minimum  mismatch rate between two consecutive frames in order to consider presence
    self.canvas = null;
    self.context = null;
    self.video = null;
    self.showSnapshots = false;
    self.dropElement = null;
    var videoObj = { "video": true };

    self.errBack = function(error) {
        console.log("Video capture error: ", error.code);
    };
    self.resembleControl = null;
    self.frames = [];
    self.present = false;


    /* EVENT HANDLERS  */

    self.onEnter = function() {
        console.log("You Entered!");
    };
    self.onLeave = function() {
        console.log("You Left!");
    };
    self.isPresent = function() {
        console.log("You are there!");
    };
    self.isNotPresent = function() {
        console.log("You are not there!");
    };

    /* CONTROLLERS */
    self.stop = function () {
        if (self.interval) window.clearInterval(self.interval);
    };

    self.start = function() {
        if(!resemble) console.error("Resamble lib not found");
        if(!self.canvas || !self.video) console.error("Configure canvas and video elements");
        self.context = self.canvas.getContext("2d");

        // Start video listeners
        if(navigator.getUserMedia) { // Standard
            navigator.getUserMedia(videoObj, function(stream) {
                self.video.src = stream;
                self.video.play();
            }, self.errBack);
        } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
            navigator.webkitGetUserMedia(videoObj, function(stream){
                self.video.src = window.URL.createObjectURL(stream);
                self.video.play();
            }, self.errBack);
        }
        else if(navigator.mozGetUserMedia) { // Firefox-prefixed
            navigator.mozGetUserMedia(videoObj, function(stream){
                self.video.src = window.URL.createObjectURL(stream);
                self.video.play();
            }, self.errBack);
        }

        self.interval = window.setInterval(function() {
            self.context.drawImage(video, 0, 0, 640, 480);
            self.compare(self.canvas.toDataURL('image/png'));
        },self.rate)
    };

    self.compare = function  (elem) {
        self.frames.push(elem);
        if(self.frames.length > 2) self.frames.shift();

        resemble(elem).onComplete(function(data){

            self.red = data.red;
            self.green = data.green;
            self.blue = data.blue;
            self.brightness = data.brightness;
        });

        if(self.frames.length == 2){
            self.resembleControl = resemble(self.frames[0]).compareTo(self.frames[1]).onComplete(onComplete);
        }
    };

    function onComplete(data){
        var diffImage = new Image();
        diffImage.src = data.getImageDataUrl();
        if (self.showSnapshots) {
            if(self.dropElement) {
                self.dropElement.innerHTML = "";
                self.dropElement.appendChild(diffImage);
            }
        }
        self.mismatch = data.misMatchPercentage;

        if(data.misMatchPercentage > self.mismatchThreshold){//threshold passed: PRESENT
            if (!self.present) self.onEnter(self);
            self.present = true;
            self.isPresent(self)
        } else { //threshold not passed: NOT PRESENT
            if (self.present) self.onLeave(self);
            self.present = false;
            self.isNotPresent(self);
        }
    }
};