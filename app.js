var audioBuffer;
var arrayBuffer;
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

function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                               // note: on older systems, may have to use deprecated noteOn(time);
  }


var kickFile;
var fileReader;

var fileKick = document.getElementById('fileKick');
fileKick.addEventListener("change", function() {
  var reader = new FileReader();
  reader.onload = function(ev) {
    context.decodeAudioData(ev.target.result, function(buffer) {
      arrayBuffer = buffer;
    });
  };
  reader.readAsArrayBuffer(this.files[0]);
} , false);

init();

var btnKick = document.querySelector('#btnKick');
var btnChooseKick = document.querySelector('#btnChooseKick');

btnKick.onclick = function(){playSound(arrayBuffer)};
