'use strict';

module.exports = {

  for: function(wcjs) {

    let timeouts = [];

    wcjs.events.on('TimeChanged', function(time) {
      stopTimeouts();
      for (let i in timeouts) {
        const timeout = timeouts[i];
        if (timeout.triggered && timeout.singleShot) {
          // this timeout is dead
        } else {
          const timespan = timeout.time - time;
          if (timespan >= 0) {
            timeout.nativeTimeout = setTimeout(function() {
              timeout.callback();
              timeout.triggered = true;
            }, (timespan) / wcjs.input.rate)
          }
        }
      }
    });
    wcjs.events.on('Buffering', stopTimeouts);
    wcjs.events.on('Paused', stopTimeouts);
    wcjs.events.on('Opening', stopTimeouts);
    wcjs.events.on('Stopped', stopTimeouts);
    wcjs.events.on('EndReached', stopTimeouts);
    wcjs.events.on('EncounteredError', stopTimeouts);

    function stopTimeouts() {
      for (let i in timeouts) {
        clearTimeout(timeouts[i].nativeTimeout);
      }
    }

    return {

      onTime: function(time, callback, opts) {
        const timeout = {
          time: time,
          callback: callback,
          singleShot: (opts||{}).singleShot !== undefined ? opts.singleShot : true,
          triggered: false,
        };
        timeouts.push(timeout);
      }
    };

  }
}
