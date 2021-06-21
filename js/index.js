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

function createInputSettingLine(port,key,io)
{
    let pLine = createElem("p", {});
    let emTitle = createElem("em");
    emTitle.textContent = port;
    pLine.appendChild(emTitle);

    let activateMidiCheckbox = createElem("input",{"type":"checkbox",name: key + "on", "id": "midiInActive" + io + key});
    pLine.appendChild(activateMidiCheckbox );
    let labelActivateMidiCheckbox = createElem("label",{"for": "midiInActive" + key});
    labelActivateMidiCheckbox.textContent = "Activer";
    pLine.appendChild(labelActivateMidiCheckbox);


    let labelVolume = createElem("label",{"for": "volume" + io  + key});
    labelVolume.textContent = "Volume:";
    let inputVolume = createElem("input",{"type":"number","min":0,"max":100,"name":"volume" + key, "id" : "volume" + io  + key});

    pLine.appendChild(labelVolume);
    pLine.appendChild(inputVolume);
    
    let labelChanelToUse = createElem("label",{"for": "channel" + io  + key});
    labelChanelToUse.textContent = "Midi chanel to use:";
    pLine.appendChild(labelChanelToUse);
    let selectChannelToUse = createElem("select",{"name": "channel" + io  + key, "id": "channel" + io + key});
    for(let i=0; i < 16; i++ ){
        let option = createElem("option",{"value":i});
        option.textContent = i;
        selectChannelToUse.appendChild(option);
    }
    pLine.appendChild(selectChannelToUse);

    return pLine

}

function onMIDISuccess(midiAccess) {

    
    var inputs = midiAccess.inputs;

    //settings container
    let settingsSection = document.getElementById("settingsSection");

    let midiIOList = createElem("article",{"class":"midiIOlist"});

    let midiIOListTitle = createElem("H2",{});
    midiIOListTitle.textContent = "Input midi devices";
    midiIOList.appendChild(midiIOListTitle);

    inputs.forEach( function( port, key ) {
       midiIOList.appendChild(createInputSettingLine(port,key,"in")); 
        
    });
    settingsSection.appendChild(midiIOList);

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
