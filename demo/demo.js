(function (window, navigator, document, MIDIClock) {
    'use strict';

    var button = document.getElementById('send'),
        tempoInput = document.getElementById('tempo'),
        clock = new MIDIClock();

    function setupChooser(midi) {
        var outputs = {'-' : null},
            chooser = document.createElement('select'),
            output = outputs['-'];
        chooser.appendChild(createOption('-'));
        midi.outputs().forEach(function (output) {
            outputs[output.name] = output;
            chooser.appendChild(createOption(output.name));
        });
        document.body.appendChild(chooser);
        chooser.addEventListener('change', function () {
            output = outputs[this.value];
        });
        clock.onmidimessage = function (event) {
            if (output) {
                try {
                    output.send(event.data);
                } catch (e) {
                    window.console.error(e);
                }
            }
        };
    }

    function setupMIDI(midi) {
        setupChooser(midi);
    }

    clock.onmidimessage = function (event) {
        window.console.log(event.toString());
    };

    function setTempo() {
        clock.tempo = tempoInput.value;
    }

    function sendClock() {
        if (button.innerHTML === 'Start') {
            clock.start();
            button.innerHTML = 'Stop';
        } else if (button.innerHTML === 'Stop') {
            clock.stop();
            button.innerHTML = 'Start';
        }
    }

    tempoInput.addEventListener('change', setTempo, false);
    button.addEventListener('click', sendClock, false);

    function createOption(label) {
        var option = document.createElement('option');
        option.innerHTML = label;
        return option;
    }

    if (typeof navigator.requestMIDIAccess === 'function') {
        navigator.requestMIDIAccess().then(function (midi) {
            setupMIDI(midi);
        }, function (error) {
            window.console.log('Error', error);
            document.getElementById('status').innerHTML = 'Error attempting to access MIDI.';
        });
    } else {
        document.getElementById('status').innerHTML = 'Your browser does not support MIDI access.';
    }
}(this.window, this.navigator, this.document, this.MIDIClock));
