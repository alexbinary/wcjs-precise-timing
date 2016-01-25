'use strict';

module.exports = {

  for: function(wcjs) {

    let timeouts = [];

    wcjs.events.on('TimeChanged', function(time) {
      refreshTimeouts(time);
    });
    wcjs.events.on('Buffering', stopTimeouts);
    wcjs.events.on('Paused', stopTimeouts);
    wcjs.events.on('Opening', stopTimeouts);
    wcjs.events.on('Stopped', stopTimeouts);
    wcjs.events.on('EndReached', stopTimeouts);
    wcjs.events.on('EncounteredError', stopTimeouts);

    function addTimeout(time, callback, opts) {
      const timeout = {
        time: time,
        callback: callback,
        index: timeouts.length,
        singleShot: opts.singleShot !== undefined ? opts.singleShot : true,
      };
      timeouts.push(timeout);
    }

    function refreshTimeouts(time) {
      for (let i in timeouts) {
        if (timeouts[i] != null) {
          refreshTimeout(timeouts[i], time);
        }
      }
    }

    function refreshTimeout(timeout, time) {
      stopTimeout(timeout);
      startTimeout(timeout, time);
    }

    function stopTimeouts() {
      for (let i in timeouts) {
        if (timeouts[i] != null) {
          stopTimeout(timeouts[i]);
        }
      }
    }

    function stopTimeout(timeout) {
      clearTimeout(timeout.nativeTimeout);
    }

    function startTimeout(timeout, time) {
      const timespan = timeout.time - time;
      if (timespan >= 0) {
        timeout.nativeTimeout = setTimeout(function() {
          timeout.callback();
          if (timeout.singleShot) {
            timeouts[timeout.index] = null;
          }
        }, (timespan) / wcjs.input.rate)
      }
    }

    return {

      onTime: function(time, callback, opts) {
        addTimeout(time, callback, opts || {});
      }
    };

  }
}
