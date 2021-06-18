var displayMidiLogs = false;
window.onload = function () {

    var displayMidiLogsCheckbox = document.querySelector("input[name=displayMidiCodeCheckbox]");
    displayMidiLogsCheckbox.addEventListener('change', function() {
    if (this.checked) {
        displayMidiLogs = true;
        document.getElementById("midilogs").style.display = "";
    } else {
        displayMidiLogs = false;
        document.getElementById("midilogs").style.display = "none";
    }
    });

    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        onprogress: function(state, progress) {
            console.log(state, progress);
        },
        onsuccess: function() {

        }
    });
};






if (navigator.requestMIDIAccess) {
    console.log('WebMIDI is supported in this browser.');
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

} else {
    console.log('WebMIDI is not supported in this browser.');
    document.querySelector('.note-info').textContent = 'Error: This browser does not support WebMIDI.';
}

function onMIDISuccess(midiAccess) {

    var inputs = midiAccess.inputs;
    let ulContainer = document.getElementById("midiInList");
    ulContainer.textContent = '';
    inputs.forEach( function( port, key ) {

        let liElem = createElem("li",{});
        liElem.textContent = port.name;
        ulContainer.appendChild(liElem);
      });

    var outputs = midiAccess.outputs;
    ulContainer = document.getElementById("midiOutList");
    ulContainer.textContent = '';
    outputs .forEach( function( port, key ) {

        let liElem = createElem("li",{});
        liElem.textContent = port.name;
        ulContainer.appendChild(liElem);
      });  


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
    if(displayMidiLogs){
        addMidilog(message);
    }
   switch (command) {
        case 144: // noteOn
            MIDI.noteOn(0, note, velocity);
            break;
        case 128:
            MIDI.noteOff(0,note,0.01);
  }
}

function addMidilog(message)
{
    let pmessage = createElem("p");
    pmessage.innerHTML = message.data[0] + ' ' + message.data[1]  + ' ' + message.data[2];
    document.getElementById("midilogs").appendChild(pmessage);
}
function createElem(type,attributes){
    var elem=document.createElement(type);
    for (var i in attributes)
    {elem.setAttribute(i,attributes[i]);}
    return elem;
}
