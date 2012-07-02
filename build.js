#!/usr/bin/env node

/**
 * Build Gauss for web browser
 */

var exec = require('child_process').exec;

var collection = function(next) {
  exec('node_modules/.bin/uglifyjs -nc lib/collection.js > gauss.min.js', next);
};

var vector = function(next) {
  exec('node_modules/.bin/uglifyjs -nc lib/vector.js >> gauss.min.js', next);
};

var timeseries = function() {
  exec('node_modules/.bin/uglifyjs -nc lib/timeseries.js >> gauss.min.js');
};

(function() {
  collection(function() { return vector(timeseries); });
})();
