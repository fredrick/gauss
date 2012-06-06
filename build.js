#!/usr/bin/env node

/**
 * Build Gauss for web browser
 */

var exec = require('child_process').exec;

(function(next) {
  exec('node_modules/.bin/uglifyjs -nc lib/vector.js > gauss.min.js', next);
})(function() {
  exec('node_modules/.bin/uglifyjs -nc lib/timeseries.js >> gauss.min.js');
});
