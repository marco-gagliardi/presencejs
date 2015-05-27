/**
 * Author:  Marco Gagliardi
 * Email:   marcogagliardi84@gmail.com
 */


// AMD with global, Node, or global
;(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['Presence'], function(Presence) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.Presence = factory(Presence));
        });
    } else if(typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('presence_js'));
    } else {
        // Browser globals (root is window)
        root.Presence = factory(root.Presence);
    }
} (this, function(Presence) {

    var self = this || global;

    /* Configuration */
    self.rate = 400; // refresh rate in ms
    self.mismatchThreshold = 0.01; // minimum mismatch rate between two consecutive frames in order to consider presence
    self.canvas = null;
    self.context = null;
    self.video = null;
    self.showSnapshots = false;
    self.dropElement = null;
    var localStream = null;
    var videoObj = { "video": true };
    var url = window.URL || window.webkitURL;

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
        if (self.interval){
            window.clearInterval(self.interval);
        }
        localStream.stop();
    };

    self.start = function() {
        if(!resemble)
            console.error("Resemble lib not found");
        if(!self.canvas || !self.video)
            console.error("Configure canvas and video elements");

        self.context = self.canvas.getContext("2d");

        navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

        // Start video listeners
        if(navigator.getUserMedia) {
            navigator.getUserMedia(videoObj, function(stream) {
                localStream = stream;
                self.video.src = url ? url.createObjectURL(stream) : stream;
                self.video.play();
            }, self.errBack);
        }

        self.interval = window.setInterval(function() {
            self.context.drawImage(self.video, 0, 0, 320, 240);
            compare(self.canvas.toDataURL('image/png'));
        }, self.rate);


        setup(document.body);
    };

    function compare(elem) {
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
    }

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

        if(data.misMatchPercentage > self.mismatchThreshold) {
            //threshold passed: PRESENT
            setPresence(true);
        } else {
            //threshold not passed: NOT PRESENT
            setPresence(false);
        }
    }

    function setPresence(presence) {
        if(presence) {
            self.isPresent(self);
            if(!self.present)
                self.onEnter(self);
        } else {
            self.isNotPresent(self);
            if(self.present)
                self.onLeave(self);
        }
        self.present = presence;
    }

    /* * * * * * * * *
     * INPUT EVENTS  *
     * * * * * * * * */

    /* TODO
     * - bind these events to webcam's one, maybe keeping two different states and resolving presence depending on them
     * - expose api for delay before inactivity
     * - (?) expose api defining which events should be Presence listen to
     */

    var timeoutID;

    function setup(target) {
        var el = target || document.body;

        el.addEventListener("keypress", resetTimer, false);
        el.addEventListener("mousemove", resetTimer, false);
        el.addEventListener("mousedown", resetTimer, false);
        el.addEventListener("DOMMouseScroll", resetTimer, false);
        el.addEventListener("mousewheel", resetTimer, false);
        el.addEventListener("touchmove", resetTimer, false);
        el.addEventListener("MSPointerMove", resetTimer, false);

        startTimer();
    }

    function startTimer() {
        timeoutID = window.setTimeout(goInactive, 4000);
    }

    function resetTimer(e) {
        window.clearTimeout(timeoutID);
        goActive();
    }

    function goActive() {
        setPresence(true);
        startTimer();
    }

    function goInactive() {
        setPresence(false);
    }

    return self;
}));
