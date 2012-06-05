#!/usr/bin/env node

var child_process = require('child_process');

(function(next) {
  child_process.exec('node_modules/.bin/uglifyjs -nc lib/vector.js > gauss.min.js', next);
})(function() {
  child_process.exec('node_modules/.bin/uglifyjs -nc lib/timeseries.js >> gauss.min.js');
});
