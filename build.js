#!/usr/bin/env node

/**
 * Build Gauss for web browser
 */

var exec = require('child_process').exec;

var collection = function(next) {
  exec('node_modules/.bin/uglifyjs lib/collection.js -nc > gauss.min.js', next);
};

var vector = function(next) {
  exec('node_modules/.bin/uglifyjs lib/vector.js -nc >> gauss.min.js', next);
};

var timeseries = function() {
  exec('node_modules/.bin/uglifyjs lib/timeseries.js -nc >> gauss.min.js');
};

(function() {
  collection(function() { return vector(timeseries); });
})();
