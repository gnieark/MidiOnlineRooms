var displayMidiLogs = false;
window.onload = function () {

    


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
    /*
    .check{ grid-area:check;}
.labelCheck{ grid-area: labelCheck;}
.labelVolume{ grid-area: labelVolume;}
.inputVolume{ grid-area: inputVolume;}
.labelChanel{ grid-area: labelChanel;}
.chanelInput{ grid-area: chanelInput;}

*/
    let container = createElem("div", {"class":"blIODevice"});
    let emTitle = createElem("h3",{"class":"t"});
    emTitle.textContent = port.name;
    container.appendChild(emTitle);

    let activateMidiCheckbox = createElem("input",{"class": "check","type":"checkbox",name: key + "on", "id": "midiInActive" + io + key});
    container.appendChild(activateMidiCheckbox );
    let labelActivateMidiCheckbox = createElem("label",{"class" : "labelCheck", "for": "midiInActive" + key});
    labelActivateMidiCheckbox.textContent = "Activate";
    container.appendChild(labelActivateMidiCheckbox);


    let labelVolume = createElem("label",{"class":"labelVolume","for": "volume" + io  + key});
    labelVolume.textContent = "Volume:";
    let inputVolume = createElem("input",{"class":"inputVolume","type":"number","min":0,"max":100,"name":"volume" + key, "id" : "volume" + io  + key});

    container.appendChild(labelVolume);
    container.appendChild(inputVolume);
    
    let labelChanelToUse = createElem("label",{"class":"labelChanel", "for": "channel" + io  + key});
    labelChanelToUse.textContent = "Midi chanel to use:";
    container.appendChild(labelChanelToUse);
    let selectChannelToUse = createElem("select",{"class": "chanelInput", "name": "channel" + io  + key, "id": "channel" + io + key});
    for(let i=0; i < 16; i++ ){
        let option = createElem("option",{"value":i});
        option.textContent = i;
        selectChannelToUse.appendChild(option);
    }
    container.appendChild(selectChannelToUse);

    return container

}

function onMIDISuccess(midiAccess) {

    
    var inputs = midiAccess.inputs;

    //settings container
    let settingsSection = document.getElementById("settingsSection");

    let midiInList = createElem("article",{"class":"midiIOlist"});

    let midiInputListTitle = createElem("H2",{});
    midiInputListTitle.textContent = "Input midi devices";
    midiInList.appendChild(midiInputListTitle);

    inputs.forEach( function( port, key ) {
       midiInList.appendChild(createInputSettingLine(port,key,"in")); 
        
    });
    settingsSection.appendChild(midiInList);

    let midiOutList = createElem("article",{"class":"midiIOlist"});
    let midiOutputListTitle = createElem("H2",{});
    midiOutputListTitle.textContent = "Output midi devices";
    midiOutList.appendChild(midiOutputListTitle);

    var outputs = midiAccess.outputs;
    outputs.forEach( function(port, key) {
        midiOutList.appendChild( createInputSettingLine(port,key,"out") );
    });
    settingsSection.appendChild(midiOutList);



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
function showHideSettings(){
    if (document.getElementById("settingsSection").style.display == "none")
    {
        document.getElementById("settingsSection").style.display = "";
    }else{
        document.getElementById("settingsSection").style.display = "none";
    }
}
