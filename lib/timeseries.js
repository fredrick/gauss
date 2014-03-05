/**
 * TimeSeries: Nested array
 * Facilitates analysis of time series.
 * @author Fredrick Galoso
 */

(function() {
  var Collection = (typeof window === 'undefined') ?
    require('./collection') : window.gauss.Collection;
  Collection = new Collection();
  var Vector = (typeof window === 'undefined') ?
    require('./vector') : window.gauss.Vector;

  var TimeSeries = function(values) {
    "use strict";
    var timeseries = (arguments.length === 2) ?
      Array.prototype.slice.call(arguments) :
      values;

    if (Array.prototype.slice.call(arguments).length === 0) {
      timeseries = [];
    }

    var result = function(value, callback) {
      if (callback) {
        return callback(value);
      }
      else {
        return value;
      }
    };

    Object.defineProperty(timeseries, 'extend', {
      /**
       * Return a TimeSeries extended with named functions.
       * @param methods Object { 'functionName': function() {} }
       */
      value: function(methods, callback) {
        Collection.extend.bind(this);
        return Collection.extend.apply(this, arguments);
      },
      writable: true,
      enumerable: false
    });

    timeseries.extend({
      byValue: function(a, b) {
        return ((a[1] < b[1]) ? -1 : ((a[1] > b[1]) ? 1 : 0));
      },
      byDate: function(a, b) {
        return ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0));
      },
      times: function(callback) {
        var times = new Vector(Array.prototype.map.call(this, function(i) {
          return i[0];
        }));
        return result(times, callback);
      },
      values: function(callback) {
        var values = new Vector(Array.prototype.map.call(this, function(i) {
          return i[1];
        }));
        return result(values, callback);
      }
    });

    timeseries.extend({
      every: Collection.every,
      append: Collection.append
    });

    return timeseries;
  };

  Array.prototype.toTimeSeries = function() {
    return new TimeSeries(this);
  };

  if (typeof window !== 'undefined') {
    window.gauss = (typeof window.gauss === 'undefined' ? {} : window.gauss);
    window.gauss.TimeSeries = TimeSeries;
  }
  else {
    exports = module.exports = TimeSeries;
  }
})();
