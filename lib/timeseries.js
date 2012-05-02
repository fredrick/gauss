/**
 * TimeSeries: Nested array
 * Facilitates analysis of time series
 * @author Fredrick Galoso
 */
var Vector = require('./vector');

/**
 * Sorting algorithms
 */
Array.prototype.byValue = function(a, b) {
  return ((a[1] < b[1]) ? -1 : ((a[1] > b[1]) ? 1 : 0));
}

Array.prototype.byDate = function(a, b) {
  return ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0));
}

Array.prototype.times = function(callback) {
  var times = new Vector(Array.prototype.map.call(this, function(i) {
    return i[0];
  }));
  if (callback)
    return callback(times);
  else
    return times;
};

Array.prototype.values = function(callback) {
  var values = new Vector(Array.prototype.map.call(this, function(i) {
    return i[1];
  }));
  if (callback)
    return callback(values);
  else
    return values;
};

exports = module.exports = Array;
