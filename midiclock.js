/**
 * midiclock.js
 * (c) 2014 Michael Dominice
 * midiclock.js is freely distributable under the MIT license.
 */
this.MIDIClock = (function (window) {
    'use strict';

    var MS_PER_MINUTE = 1000 * 60,
        CLOCKS_PER_BEAT = 24,
        CLOCK_STATUS = 0xf8;

    function MIDIClock(tempo) {
        this.tempo = tempo || 120;
    }

    function MIDIClockMessage() {
        // TODO: how to determine the timestamp
        this.timestamp = window.performance.timing.navigationStart + window.performance.now();
        this.data = new Uint8Array([CLOCK_STATUS]);
    }

    MIDIClockMessage.prototype.toString = function () {
        return 'MIDIClockMessageEvent[' + [
            'timestamp=' + this.timestamp,
            'data=[0x' + this.data[0].toString(16) + ']'
        ].join(',') + ']';
    };

    function send(clock, handler, callback) {
        var clocksPerMinute = clock.tempo * CLOCKS_PER_BEAT,
            clockDuration = MS_PER_MINUTE / clocksPerMinute,
            clocksSent = 0;
        clearInterval(clock.interval);
        clock.interval = setInterval(function () {
            if (clocksSent < CLOCKS_PER_BEAT) {
                handler(new MIDIClockMessage());
                clocksSent = clocksSent + 1;
            } else {
                clearInterval(clock.interval);
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }.bind(clock), clockDuration);
    }

    MIDIClock.prototype.send = function (callback) {
        if (typeof this.onmidimessage === 'function') {
            // don't send if there's no one listening
            send(this, this.onmidimessage, callback);
        }
    };

    return MIDIClock;

}(this));
