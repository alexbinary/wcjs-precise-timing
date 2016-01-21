# wcjs-precise-timing

> Node.js module to attach callbacks to specific time in a WebChimera playback with high accuracy.

This module makes smart use of the events provided by WebChimera and combine them with native javascript timeouts to always stay in perfect sync with the playback, so it can trigger callbacks with high temporal accuracy.

## Usage

```javascript
const vlc = require('wcjs-renderer').init(canvas);

const timing = require('wcjs-precise-timing').for(vlc);

timing.onTime(12500, function() {
  console.log('hello');  // will trigger at exactly 12 sec and 500 ms,
                         // every time playback reaches that time.
});

timing.onTime(14200, function() {
  console.log('hi');
}, {
  singleShot: true,   // will trigger only once, i.e. if playback gets
                      // e.g. rewinded it will not trigger the second time
});

```


## Know limitations

Because of the way WebChimera send its events, actions cannot be executed reliably when the playback is jumped less than 10 ms before their scheduled execution time.
