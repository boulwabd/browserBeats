var audioBuffer;
var context;

window.addEventListener('load', init, false);
function init() {
  //context = new (window.AudioContext || window.webkitAudioContext)();
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}


function loadKickSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      audioBuffer = buffer;
    });
  }
  request.send();
}

function playSound(buffer) {
    console.log("test");
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                               // note: on older systems, may have to use deprecated noteOn(time);
  }

var url = "http://localhost:8080/Bass-Drum-1.wav";
init();
loadKickSound(url);
var button = document.querySelector('button');
button.onclick = function(){playSound(audioBuffer)};