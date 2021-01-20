(function () {
  // start by wrapping the whole script in an anonymous function to avoid global variables

  var width = 320; // We will scale the photo width to this
  var height = 0; // This will be computed based on the input stream

  var streaming = false;

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    //   startup() function is run when the page has finished loading
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("photo");
    startbutton = document.getElementById("startbutton");

    // Get the media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });

    video.addEventListener(
      "canplay",
      function (ev) {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth / width);

          video.setAttribute("width", width);
          video.setAttribute("height", height);
          canvas.setAttribute("width", width);
          canvas.setAttribute("height", height);
          streaming = true;
        }
      },
      false
    );
    // This callback does nothing unless it's the first time it's been called; this is tested by looking at the value of our streaming variable, which is false the first time this method is run.

    // capture a still photo each time the user clicks the startbutton
    startbutton.addEventListener(
      "click",
      function (ev) {
        takepicture();
        ev.preventDefault(); // prevent the click from being handled more than once.
      },
      false
    );

    clearphoto(); // clearing the photo box
  }

  //   Clearing the photo box involves creating an image,
  //   then converting it into a format usable by the <img> element that displays the most recently captured frame.
  function clearphoto() {
    var context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }

  //   capture the currently displayed video frame, convert it into a PNG file, and display it in the captured frame box
  function takepicture() {
    var context = canvas.getContext("2d"); // any time we need to work with the contents of a canvas, we start by getting the 2D drawing context for the hidden canvas
    if (width && height) {
      canvas.width = width;
      canvas.height = height;

    //   context.filter = 'contrast(5)';     // add effect

      context.drawImage(video, 0, 0, width, height);

      var data = canvas.toDataURL("image/png"); // convert it to PNG format
      photo.setAttribute("src", data);
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener("load", startup, false);
})();
