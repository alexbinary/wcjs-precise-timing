# wcjs-time-callback

> Node.js module to attach callbacks to specific time in a WebChimera playback with high accuracy.

This module makes smart use of the events provided by WebChimera and combine them with native javascript timeouts to trigger callbacks at very specific times.

## Usage

```javascript
const vlc = require('wcjs-renderer').init(canvas);

const timing = require('wcjs-time-callback').for(vlc);

timing.onTime(12500, function() {
  console.log('hello');  // will trigger at exactly 12 sec and 500 ms,
                         // every time playback reaches that time.
});

timing.onTime(14200, function() {
  console.log('hi');
}, {
  singleShot: true,   // will trigger at 14 sec and 200ms
                      // but only the first time playback reaches that time
});

```

## License

The MIT License (MIT) - Copyright (c) 2016 Alexandre Bintz <alexandre@bintz.io>  
See [LICENSE](LICENSE) file for full text.
