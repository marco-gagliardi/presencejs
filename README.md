## presencejs

A JavaScript library that uses HTML5 controllers to detect whether someone is in front of the computer.
####Dependencies: 
Requires [Resemble.js](http://huddle.github.io/Resemble.js/) image analysis library

##Usage

Include dependencies and scripts:
```HTML
<script src="lib/resemble.js"></script>
<script src="src/presence.js"></script>
```
Configure library:
```javascript
<script>
    var p = new Presence();
    p.showSnapshots = true; //show frames elaboration snapshots
    p.dropElement = document.getElementById("dropper"); //set snapshots container
    p.canvas = document.getElementById("canvas"); //set canvas
    p.video = document.getElementById("video"); //set video
    
    /* override default event handlers */
    p.onEnter = function(data) {
        console.log("Welocome!")
    }
    p.onLeave = function(data) {
        console.log("Goodbye")
    }
    p.isPresent = function(data) {
        document.getElementById("present").style.display = "block";
        document.getElementById("notPresent").style.display = "none";
        document.getElementById("stats").innerHTML = "Difference: " + data.mismatch + "% Red: " + data.red + "% Blue:" + data.blue + "% Green:" + data.green + " Brightness: " + data.brightness + "%";

    }
    p.isNotPresent = function(data) {
        document.getElementById("notPresent").style.display = "block";
        document.getElementById("present").style.display = "none";
        document.getElementById("stats").innerHTML = "";
    }
</script>
```
