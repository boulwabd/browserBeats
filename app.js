var context;

window.addEventListener('load', init, false);
function init() {
  //context = new (window.AudioContext || window.webkitAudioContext)();
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
  }
  catch (e) {
    alert('Web Audio API is not supported in this browser');
  }
}

function Sampler(drpArea, buffer) {
  
  this.dropArea = drpArea;
  this.sampleBuffer = buffer;

  dropArea.onclick = function () { 
    try {
      playSound(sampleBuffer)
    }
    catch (error) {
      alert('Drag a sample onto the pad!');
    }
    dropArea.classList.add("flash");
    setTimeout(function() {dropArea.classList.remove("flash")},100);
  };

  dropArea.addEventListener('drop', handleDrop, false);

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });
  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight(e) {
    dropArea.classList.add('highlight');
  }

  function unhighlight(e) {
    dropArea.classList.remove('highlight');
  }

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);
  }

  function handleFiles(fileList) {
    let reader = new FileReader();
    reader.onload = function (ev) {
      context.decodeAudioData(ev.target.result, function (buffer) {
        sampleBuffer = buffer;
      });
    };
    reader.readAsArrayBuffer(fileList[0]);
  }

  function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
    // note: on older systems, may have to use deprecated noteOn(time);
  }
}

init();

var playButton = document.getElementById('btn1')
var dropArea = document.getElementById('drop-area1');
var audioBuffer = 0;

var sampler1 = new Sampler(playButton, dropArea, audioBuffer);