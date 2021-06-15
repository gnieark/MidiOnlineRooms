
if (navigator.requestMIDIAccess) {
    console.log('WebMIDI is supported in this browser.');
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

} else {
    console.log('WebMIDI is not supported in this browser.');
    document.querySelector('.note-info').textContent = 'Error: This browser does not support WebMIDI.';
}

function onMIDISuccess(midiAccess) {
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;

    for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
    }
}

function onMIDIFailure(m){

}
function getMIDIMessage(message) {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = message.data[2];

   switch (command) {
        case 144: // noteOn
            MIDI.noteOn(0, note, velocity);
            break;
  }
}
