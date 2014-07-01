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

    function MIDIClock(tempo) {
        this.tempo = tempo || 120;
        this._execute = this._execute.bind(this);
    }

    MIDIClock.prototype.start = function () {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(this._execute, this.getClockDuration());
    };

    MIDIClock.prototype.stop = function () {
        clearTimeout(this._timeout);
    };

    MIDIClock.prototype.getClockDuration = function () {
        var clocksPerMinute = this.tempo * CLOCKS_PER_BEAT;
        return MS_PER_MINUTE / clocksPerMinute;
    };

    MIDIClock.prototype._execute = function () {
        if (typeof this.onmidimessage === 'function') {
            this.onmidimessage(new MIDIClockMessage());
        }
        this._timeout = setTimeout(this._execute, this.getClockDuration());
    };

    MIDIClock.CLOCKS_PER_BEAT = CLOCKS_PER_BEAT;

    return MIDIClock;

}(this));
