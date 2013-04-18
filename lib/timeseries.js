/**
 * TimeSeries: Nested array
 * Facilitates analysis of time series.
 * @author Fredrick Galoso
 */

(function() {
  var Collection = (typeof window === 'undefined') ?
    require('./collection') : window.gauss.Collection;
  Collection = Collection();
  var Vector = (typeof window === 'undefined') ?
    require('./vector') : window.gauss.Vector;

  var TimeSeries = function(values) {
    "use strict";
    var timeseries = (arguments.length === 2) ?
      Array.prototype.slice.call(arguments) :
      values;

    if (Array.prototype.slice.call(arguments).length === 0)
      timeseries = [];

    Object.defineProperties(timeseries, {
      // Sorting primatives
      'byValue': {
        value: function(a, b) {
          return ((a[1] < b[1]) ? -1 : ((a[1] > b[1]) ? 1 : 0));
        },
        writable: true,
        enumerable: false
      },
      'byDate': {
        value: function(a, b) {
          return ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0));
        },
        writable: true,
        enumerable: false
      },
      'times': {
        value: function(callback) {
          var times = new Vector(Array.prototype.map.call(this, function(i) {
            return i[0];
          }));
          if (callback)
            return callback(times);
          else
            return times;
        },
        writable: true,
        enumerable: false
      },
      'values': {
        value: function(callback) {
          var values = new Vector(Array.prototype.map.call(this, function(i) {
            return i[1];
          }));
          if (callback)
            return callback(values);
          else
            return values;
        },
        writable: true,
        enumerable: false
      },
      /**
       * Return a TimeSeries extended with named functions.
       * @param methods Object { 'functionName': function() {} }
       */
      'extend': {
        value: function(methods, callback) {
          Collection.extend.bind(this);
          return Collection.extend.apply(this, arguments);
        },
        writable: true,
        enumerable: false
      }
    });

    timeseries.extend({
      'every': Collection.every,
      'append': Collection.append
    });

    return timeseries;
  }

  if (typeof window !== 'undefined') {
    window.gauss = (typeof window.gauss === 'undefined' ? {} : window.gauss);
    window.gauss.TimeSeries = TimeSeries;
  } else {
    exports = module.exports = TimeSeries;
  }
})();
