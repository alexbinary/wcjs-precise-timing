'use strict';

module.exports = {

  for: function(wcjs) {

    function currentWorldTime() {
      return (new Date()).getTime();
    }

    let worldTimeLastSync = undefined;
    let mediaTimeLastSync = undefined;

    let playing = false;

    let timeouts = [];

    wcjs.events.on('Playing', onStart);
    wcjs.events.on('TimeChanged', function(time) {
      mediaTimeLastSync = time;
      worldTimeLastSync = currentWorldTime();
      onStart();
    });
    wcjs.events.on('Buffering', function(p) {
      if (p === 100) {
        onStart();
      } else {
        onStop();
      }
    });
    wcjs.events.on('Paused', onStop);
    wcjs.events.on('Opening', onStop);
    wcjs.events.on('Stopped', onStop);
    wcjs.events.on('EndReached', onStop);
    wcjs.events.on('EncounteredError', onStop);

    function onStart() {
      playing = true;
      refreshTimeouts();
    }

    function onStop() {
      mediaTimeLastSync = getCurrentMediaTime();
      worldTimeLastSync = currentWorldTime();
      playing = false;
      stopTimeouts();
    }

    function getCurrentMediaTime () {
      if (playing) {
        return mediaTimeLastSync + (currentWorldTime() - worldTimeLastSync) * wcjs.input.rate;
      } else {
        return mediaTimeLastSync;
      }
    }

    function addTimeout(time, callback, opts) {
      const timeout = {
        time: time,
        callback: callback,
        index: timeouts.length,
        singleShot: opts.singleShot !== undefined ? opts.singleShot : true,
      };
      timeouts.push(timeout);
      if (playing) {
        startTimeout(timeout);
      }
    }

    function refreshTimeouts() {
      for (let i in timeouts) {
        if (timeouts[i] != null) {
          refreshTimeout(timeouts[i]);
        }
      }
    }

    function refreshTimeout(timeout) {
      stopTimeout(timeout);
      startTimeout(timeout);
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

    function startTimeout(timeout) {
      const timespan = timeout.time - getCurrentMediaTime();
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
