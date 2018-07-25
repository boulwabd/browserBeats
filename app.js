var context;
var padCount = 0 ;
var pads;

window.addEventListener('load', init, false);
function init() {
  //context = new (window.AudioContext || window.webkitAudioContext)();
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    pads = [new Sampler(0)];
  }
  catch (e) {
    alert('Web Audio API is not supported in this browser');
  }
}

//sampler module
function Sampler(padID) {
  var dropArea = document.getElementById('drop-area' + padID);
  var keyBindBtn = document.getElementById('keyBindBtn' + padID);
  var sampleBuffer;

  var keyBindToggle = 0;
  var keyBind;

  //Button to assign keybinding
  keyBindBtn.onclick = function () {
    keyBindToggle = 1;
    dropArea.classList.add('select');
    this.classList.add('select');

    if (keyBindToggle) {
      document.addEventListener("keydown", function keyDownInput(e) {
        keyBind = e.keyCode;
        keyBindToggle = 0;
        dropArea.classList.remove('select');
        keyBindBtn.classList.remove('select');
        keyBindBtn.innerHTML = String.fromCharCode(e.keyCode);
        document.removeEventListener("keydown", keyDownInput);
      });
    }
  }

  //listener for key press to play sample
  if (keyBindToggle == 0) {
    document.addEventListener("keydown", function (e) {
      if (e.keyCode == keyBind) {
        try {
          playSound(sampleBuffer)
        }
        catch (error) {
          alert('Drag a sample onto the pad!');
        }
        dropArea.classList.add("flash");
        setTimeout(function () { dropArea.classList.remove("flash") }, 100);
      }
    });
  }


  //drop Area code
  //adding listeners
  dropArea.addEventListener('drop', handleDrop, false); //handles the actual file drop

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });
  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  //functions for css modifying
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

  //drop handler to get file
  function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);
  }

  //reads files, decodes them, adds to buffer
  function handleFiles(fileList) {
    let reader = new FileReader();
    reader.onload = function (ev) {
      context.decodeAudioData(ev.target.result, function (buffer) {
        sampleBuffer = buffer;
      });
    };
    reader.readAsArrayBuffer(fileList[0]);
  }

  //plays the sound from passed buffer
  function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
  }
}

init();

//initializes parent container and newBtn for adding pads
var moduleContainer = document.getElementById('moduleContainer');
var newBtn = document.getElementById('new-btn');

//listener for adding pads with incremental ids and correct classes
newBtn.addEventListener("click", function() {
  padCount ++;
  var newPad = document.createElement("div");
  newPad.classList.add('drop-area');
  newPad.id = "drop-area" + padCount;
  moduleContainer.insertBefore(newPad, newBtn);
  var newLabel = document.createElement("label");
  newLabel.classList.add('button');
  newLabel.id = "keyBindBtn" + padCount;
  newLabel.innerHTML = "N/A";
  newPad.appendChild(newLabel);
  pads[padCount] = new Sampler(padCount);
});

//initializes pads array and adds first pad

init();
