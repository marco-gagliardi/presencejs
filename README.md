## PresenceJS

A JavaScript library that uses HTML5 controllers to detect whether someone is in front of the computer. 

AMD, Node and browser ready

#### Dependencies: 
Requires [Resemble.js](http://huddle.github.io/Resemble.js/) image analysis library


### Development
Issue `npm install && bower install` to resolve dependencies.

Use `grunt build` to build minified version.

### Demo
You can find a demo [here](http://marco-gagliardi.github.io/presencejs/)


### Installation
Install Presence using [Bower](http://bower.io/)

`$ bower install presencejs --save`

or manually include dependencies and source:

``` javascript
<script src="../bower_components/resemblejs/resemble.js"></script>
<script src="presence.js"></script>
```

and then configure Presence:

```javascript
<script>
    Presence.showSnapshots = true; //show frames elaboration snapshots
    Presence.dropElement = document.getElementById("dropper"); //set snapshots container
    Presence.canvas = document.getElementById("canvas"); //set canvas
    Presence.video = document.getElementById("video"); //set video
    
    /* override default event handlers */
    Presence.onEnter = function(data) {
        console.log("Welocome!")
    }
    Presence.onLeave = function(data) {
        console.log("Goodbye")
    }
    Presence.isPresent = function(data) {
        document.getElementById("present").style.display = "block";
        document.getElementById("notPresent").style.display = "none";
        document.getElementById("stats").innerHTML = "Difference: " + data.mismatch + "% Red: " + data.red + "% Blue:" + data.blue + "% Green:" + data.green + " Brightness: " + data.brightness + "%";

    }
    Presence.isNotPresent = function(data) {
        document.getElementById("notPresent").style.display = "block";
        document.getElementById("present").style.display = "none";
        document.getElementById("stats").innerHTML = "";
    }
</script>
```

### Coding guidelines
Follow [github](https://github.com/styleguide/) guidelines

### Authors
Project created and released by

* [Marco Gagliardi](mailto:marcogagliardi84@gmail.com)
* [Massimiliano Sartoretto](mailto:massimilianosartoretto@gmail.com) ([Twitter](http://twitter.com/___Sarto))

##### Feedback
Use the [issue tracker](https://github.com/marco-gagliardi/presencejs/issues) for bugs. Mail or Tweet us for any idea that can improve the project.

### License
Released under The MIT License.
