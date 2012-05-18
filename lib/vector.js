/**
 * Vector: One dimensional array.
 * Extends upon the Array datatype to do some serious number crunching.
 * @author Fredrick Galoso
 */

var Vector = function(values) {
  "use strict";
  var vector = Array.isArray(values) ?
    values :
    Array.prototype.slice.call(arguments);

  if (Array.prototype.slice.call(arguments).length === 0)
    vector = [];

  // Initialize vector cache
  var cache = {
    'sum': 0.0,
    'product': 1.0,
    'variance': 0.0,
    'values': Array.prototype.slice.call(vector)
  };

  cache.sync = function() {
    cache.values = Array.prototype.slice.call(vector);
  }

  // Sorting primatives
  var asc = function(a, b) {
    return a - b;
  };

  var desc = function(a, b) {
    return b - a;
  };

  Object.defineProperties(vector, {
    'sum': {
      value: function(callback) {
        var sum = 0.0;
        if (vector.equal(cache.values) && cache.sum !== 0.0) {
          sum = cache.sum;
        } else {
            for (var i = 0; i < vector.length;) {
              sum += vector[i++];
            }
            // Memoize sum
            cache.sum = sum;
            cache.sync();
        }
        if (callback)
          return callback(sum);
        else
          return sum;
      },
      writable: true,
      enumerable: false
    },
    'product': {
      value: function(callback) {
        var product = 1.0;
        if (vector.equal(cache.values) && cache.product !== 1.0) {
          product = cache.product;
        } else {
          for (var i = 0; i < vector.length;) {
            product *= vector[i++];
            // Memoize product
            cache.product = product;
            cache.sync();
          }
        }
        if (callback)
          return callback(product);
        else
          return product;
      },
      writable: true,
      enumerable: false
    },
    'mean': {
      value: function(callback) {
        var mean = vector.sum() / vector.length;
        if (callback)
          return callback(mean);
        else
          return mean;
      },
      writable: true,
      enumerable: false
    },
    'gmean': {
      value: function(callback) {
        var gmean = Math.pow(Math.abs(vector.product()), 1 / vector.length);
        if (callback)
          return callback(gmean);
        else
          return gmean;
      },
      writable: true,
      enumerable: false
    },
    'hmean': {
      value: function(callback) {
        function reciprocalSum(set) {
          for (var i = 0, sum = 0.0; i < set.length;) {
            sum += 1 / Math.abs(set[i++]);
          }
          return sum;
        }
        var hmean = vector.length / reciprocalSum(vector);
        if (callback)
          return callback(hmean);
        else
          return hmean;
      },
      writable: true,
      enumerable: false
    },
    'qmean': {
      value: function(callback) {
        var qmean = Math.sqrt(vector.pow(2).sum() / vector.length)
        if (callback)
          return callback(qmean);
        else
          return qmean;
      },
      writable: true,
      enumerable: false
    },
    'median': {
      value: function(callback) {
        var buffer = vector.copy();
        buffer.sort(asc);
        var median = (vector.length % 2 === 0) ?
          (buffer[vector.length / 2 - 1] + buffer[vector.length / 2]) / 2 :
          buffer[parseInt(vector.length / 2)];
        if (callback)
          return callback(median);
        else
          return median;
      },
      writable: true,
      enumerable: false
    },
    'mode': {
      value: function(callback) {
        var map = {};
        var count = 1;
        var modes = new Vector();
        for (var i = 0; i < vector.length; i++) {
          var e = vector[i];
          if (map[e] == null)
            map[e] = 1;
          else
            map[e]++;
          if (map[e] > count) {
            modes = new Vector(e);
            count = map[e];
          } else if (map[e] == count) {
            modes.push(e);
            count = map[e];
          }
        }
        if (modes.length === 1)
          modes = modes[0];
        if (callback)
          return callback(modes);
        else
          return modes;
      },
      writable: true,
      enumerable: false
    },
    'range': {
      value: function(callback) {
        var range = vector.max() - vector.min();
        if (callback)
          return callback(range);
        else
          return range;
      },
      writable: true,
      enumerable: false
    },
    /* Returns a measure of how far a set of numbers are spread out from each other. */
    'variance': {
      value: function(callback) {
        var mean = 0.0,
            variance = 0.0;
        if (vector.equal(cache.values) && cache.variance !== 0.0) {
          variance = cache.variance;
        } else {
            for (var i = 0; i < vector.length; i++) {
              var _mean = mean;
              mean += (vector[i] - _mean) / (i + 1);
              variance += (vector[i] - _mean) * (vector[i] - mean);
            }
            variance /= vector.length;
            // Memoize variance
            cache.variance = variance;
            cache.sync();
        }
        if (callback)
          return callback(variance);
        else
          return variance;
      },
      writable: true,
      enumerable: false
    },
    'stdev': {
      value: function(percentile, callback) {
        var stdev = 0.0;
        if (!percentile)
          stdev = Math.sqrt(vector.variance());
        else
          return vector.density(percentile).stdev();
        if (callback)
          return callback(stdev);
        else
          return stdev;
      },
      writable: true,
      enumerable: false
    },
    /* Returns the number of occurrences of value within a data set. */
    'frequency': {
      value: function(element, callback) {
        var freq = 0;
        if (vector.indexOf(element) !== -1) {
          var buffer = vector.copy();
          buffer.sort(asc);
          freq = buffer.lastIndexOf(element) - buffer.indexOf(element) + 1;
        }
        if (callback)
          return callback(freq);
        else
          return freq;
      },
      writable: true,
      enumerable: false
    },
    /* Returns the value that below which a certain percent of observations fall within the data set. */
    'percentile' : { 
      value: function(percent, callback) {
        var buffer = vector.copy();
        buffer.sort(asc);
        var percentile = buffer[0];
        if (percent > 0)
          percentile = buffer[Math.floor(vector.length * percent)];
        if (callback)
          return callback(percentile);
        else
          return percentile;
      },
      writable: true,
      enumerable: false
    },
    /**
     * Returns a Vector which is a percentile subset of values occurring within a data set.
     *
     * Example:
     *  vector.density(0.50); would return an array consisting of the values
     *  between the 25% and 75% percentile of the population
     */
    'density': {
      value: function(percent, callback) {
        var slice;
        var buffer = vector.copy();
        buffer.sort(asc);
        if (percent == 1)
          return buffer;
        else {
          var begin = Math.round(vector.length * (0.5 - percent / 2) - 1);
          var end = Math.round(vector.length * (0.5 + percent / 2) - 1);
          slice = new Vector(buffer.slice(begin, end));
        }
        if (callback)
          return callback(slice);
        else
          return slice;
      },
      writable: true,
      enumerable: false
    },
    /**
     * Returns an Object containing the (frequency) distribution of values within the Vector.
     * @param format Override distribution format with Percent Distribution. Default: Raw count
     */
    'distribution': {
      value: function(format, callback) {
        var buffer = vector.copy();
        buffer.sort(asc);
        var map = function (array, index, format, distribution) {
          if (index === array.length)
            return distribution;
          else {
            distribution[array[index]] = (format === 'relative') ?
            array.frequency(array[index]) / array.length : array.frequency(array[index]);
            return map(array, array.lastIndexOf(array[index]) + 1, format, distribution);
          }
        }
        var result = (format === 'relative') ? map(buffer, 0, 'relative', {}) : map(buffer, 0, 'raw', {});
        if (callback)
          return callback(result);
        else
          return result;
      },
      writable: true,
      enumerable: false
    },
    'quantile': {
      value: function(quantity, callback) {
        var buffer = vector.copy();
        buffer.sort(asc);
        var increment = 1.0 / quantity;
        var results = new Vector();
        if (quantity > vector.length)
          throw new RangeError('Subset quantity is greater than the Vector length');
        for (var i = increment; i < 1; i += increment) {
          var index = Math.round(buffer.length * i) - 1;
          if (index < buffer.length - 1)
            results.push(buffer[index]);
        }
        if (callback)
          return callback(results);
        else
          return results;
      },
      writable: true,
      enumerable: false
    },
    /* Returns a Vector of values containing the sequential difference between numbers in a sequence. */
    'delta': {
      value: function(callback) {
        var delta = new Vector();
        for (var i = 1; i < vector.length; i++) {
          delta.push(vector[i] - vector[i - 1]);
        }
        if (callback)
          return callback(delta);
        else
          return delta;
      },
      writable: true,
      enumerable: false
    },
    /** Moving average */
    /**
     * Returns a Vector of the simple moving average (SMA); unweighted means of the previous n data points.
     * @param period Length of observation window for moving average
     */
    'sma': {
      value: function(period, callback) {
        var sma;
        if (period === 1) sma = vector;
        else {
          // Memoize (rolling) sum to avoid additional O(n) overhead
          var sum = new Vector(vector.slice(0, period)).sum();
          sma = new Vector([sum / period]);
          for (var i = 1; i < vector.length - period + 1; i++) {
            sum += vector[i + period - 1] - vector[i - 1];
            sma.push(sum / period);
          }
        }
        if (callback)
          return callback(sma);
        else
          return sma;
      },
      writable: true,
      enumerable: false
    },
    /**
     * Returns a Vector of the exponential moving average (EMA); weighted means of the previous n data points.
     * @param options
     *   Number Length of the observation window for moving average, use default smoothing ratio (2 / period + 1)
     *   or
     *   Object.period Length of the observation window for moving average
     *   Object.ratio Function returning a Number to be used as smoothing ratio
     */
    'ema': {
      value: function(options, callback) {
        // Single numeric argument defining the smoothing period
        if (typeof options === 'number') {
          var length = options;
          options = {
            period: length,
            ratio: function(n) { return 2 / (n + 1); }
          };
        }
        var sum = new Vector(vector.slice(0, options.period)).sum(),
          ema = new Vector([sum / options.period]),
          ratio = options.ratio(options.period);
        for (var i = 1; i < vector.length - options.period + 1; i++) {
          ema.push(
            ratio
            * (vector[i + options.period - 1] - ema[i - 1])
            + ema[i - 1]
          );
        }
        if (callback)
          return callback(ema);
        else
          return ema;
      },
      writable: true,
      enumerable: false
    },
    /**
     * [Math]
     * Apply JavaScript Math methods to an entire Vector set of numbers
     */
    'max': {
      value: function(callback) {
        var max = Math.max.apply({}, vector);
        if (callback)
          return callback(max);
        else
          return max;
      },
      writable: true,
      enumerable: false
    },
    'min': {
      value: function(callback) {
        var min = Math.min.apply({}, vector);
        if (callback)
          return callback(min);
        else
          return min;
      },
      writable: true,
      enumerable: false
    },
    'abs': {
      value: function(callback) {
        var abs = vector.map(function(x) {
          return Math.abs(x);
        });
        if (callback)
          return callback(abs);
        else
          return abs;
      },
      writable: true,
      enumerable: false
    },
    'acos': {
      value: function(callback) {
        var acos = vector.map(function(x) {
          return Math.acos(x);
        });
        if (callback)
          return callback(acos);
        else
          return acos;
      },
      writable: true,
      enumerable: false
    },
    'asin': {
      value: function(callback) {
        var asin = vector.map(function(x) {
           return Math.asin(x); 
        });
        if (callback)
          return callback(asin);
        else
          return asin;
      },
      writable: true,
      enumerable: false
    },
    'atan': {
      value: function(callback) {
        var atan = vector.map(function(x) {
          return Math.atan(x);
        });
        if (callback)
          return callback(atan);
        else
          return atan;
      },
      writable: true,
      enumerable: false
    },
    'ceil': {
      value: function(callback) {
        var ceil = vector.map(function(x) {
          return Math.ceil(x);
        });
        if (callback)
          return callback(ceil);
        else
          return ceil;
      },
      writable: true,
      enumerable: false
    },
    'cos': {
      value: function(callback) {
        var cos = vector.map(function(x) {
          return Math.cos(x);
        });
        if (callback)
          return callback(cos);
        else
          return cos;
      },
      writable: true,
      enumerable: false
    },
    'exp': {
      value: function(callback) {
        var exp = vector.map(function(x) {
          return Math.exp(x);
        });
        if (callback)
          return callback(exp);
        else
          return exp;
      },
      writable: true,
      enumerable: false
    },
    'floor': {
      value: function(callback) {
        var floor = vector.map(function(x) {
          return Math.floor(x);
        });
        if (callback)
          return callback(floor);
        else
          return floor;
      },
      writable: true,
      enumerable: false
    },
    'log': {
      value: function(callback) {
        var log = vector.map(function(x) {
          return Math.log(x);
        });
        if (callback)
          return callback(log);
        else
          return log;
      },
      writable: true,
      enumerable: false
    },
    'pow': {
      value: function(exponent, callback) {
        var pow = vector.map(function(x) {
          return Math.pow(x, exponent);
        });
        if (callback)
          return callback(pow);
        else
          return pow;
      },
      writable: true,
      enumerable: false
    },
    'round': {
      value: function(callback) {
        var round = vector.map(function(x) {
          return Math.round(x);
        });
        if (callback)
          return callback(round);
        else
          return round;
      },
      writable: true,
      enumerable: false
    },
    'sin': {
      value: function(callback) {
        var sin = vector.map(function(x) {
           return Math.sin(x); 
        });
        if (callback)
          return callback(sin);
        else
          return sin;
      },
      writable: true,
      enumerable: false
    },
    'sqrt': {
      value: function(callback) {
        var sqrt = vector.map(function(x) {
          return Math.sqrt(x);
        });
        if (callback)
          return callback(sqrt);
        else
          return sqrt;
      },
      writable: true,
      enumerable: false
    },
    'tan': {
      value: function(callback) {
        var tan = vector.map(function(x) {
          return Math.tan(x);
        });
        if (callback)
          return callback(tan);
        else
          return tan;
      },
      writable: true,
      enumerable: false
    },
    /**
     * [Utility]
     */
    /* Test for equality between two vectors */
    'equal': {
      value: function(that, callback) {
        var equality = !(vector < that || that < vector);
        if (callback)
          return callback(equality);
        else
          return equality;
      },
      writable: true,
      enumerable: false
    },
    /* Returns a clone of the Vector object */
    'clone': {
      value: function(callback) {
        var object = Array.isArray(vector) ? [] : {};
        for (var i in vector) {
          if (i === 'clone') continue;
          if (vector[i] && typeof vector[i] === 'object') {
            object[i] = vector[i].clone();
          } else object[i] = vector[i]
        }
        if (callback)
          return callback(object);
        else
          return object;
      },
      writable: true,
      enumerable: false
    },
    /* Returns a copy of the values in a Vector object */
    'copy': {
      value: function(callback) {
        var copy = new Vector(vector.slice());
        if (callback)
          return callback(copy);
        else
          return copy;
      },
      writable: true,
      enumerable: false
    },
    /* Returns a vanilla Array of values */
    'toArray': {
      value: function(callback) {
        var array = Array.prototype.slice.call(vector);
        if (callback)
          return callback(array);
        else
          return array;
      },
      writable: true,
      enumerable: false
    },
    /**
     * Override Array methods and add Vector functionality
     *
     * [Mutator methods]
     *
    /* Returns updated Vector and performs on-line calculations */
    'push': {
      value: function() {
        var mean = (vector.length === 0) ? 0.0 : cache.sum / vector.length;
        var variance = (vector.length === 0) ? 0.0 : cache.variance * vector.length;
        var args = Array.prototype.slice.call(arguments);
        var end = args[args.length - 1];

        if (typeof end === 'function') {
          for (var i = 0; i < args.length - 1; i++) {
            Array.prototype.push.call(vector, args[i]);
            Array.prototype.push.call(cache.values, args[i]);

            // Update variance
            var _mean = mean;
            mean += (args[i] - _mean) / vector.length;
            variance += (args[i] - _mean) * (args[i] - mean);

            // Update aggregates
            cache.sum += args[i];
            cache.product *= args[i];
          }
          variance /= vector.length;
          // Memoize variance
          cache.variance = variance;
          return end(vector);
        } else {
          for (var i = 0; i < args.length; i++) {
            Array.prototype.push.call(vector, args[i]);
            Array.prototype.push.call(cache.values, args[i]);

            // Update variance
            var _mean = mean;
            mean += (args[i] - _mean) / vector.length;
            variance += (args[i] - _mean) * (args[i] - mean);

            // Update aggregates
            cache.sum += args[i];
            cache.product *= args[i];
          }
          variance /= vector.length;
          // Memoize variance
          cache.variance = variance;
          return vector;
        }
      },
      writable: true,
      enumerable: false
    },
    /** 
     * [Accessor methods]
     */
    'concat': {
      value: function() {
        var args = Array.prototype.slice.call(arguments);
        var end = args[args.length - 1];
        if (typeof end === 'function') {
          if (typeof args[0] !== 'number')
            return end(new Vector(vector.toArray().concat(args[0])));
          else
            return end(new Vector(vector.toArray().concat(args.slice(0, args.length - 1))));
        }
        else if (typeof args[0] !== 'number')
          return new Vector(vector.toArray().concat(args[0]));
        else
          return new Vector(vector.toArray().concat(args));
      },
      writable: true,
      enumerable: false
    },
    'slice': {
      value: function(begin, end, callback) {
        var args = Array.prototype.slice.call(arguments);
        if (args.length === 3)
          return callback(new Vector(vector.toArray().slice(begin, end)));
        else if (args.length === 2) {
          if (typeof args[1] === 'function')
            return callback(new Vector(vector.toArray().slice(begin)));
          else
            return new Vector(vector.toArray().slice(begin, end));
        }
        else if (args.length === 1)
          return new Vector(vector.toArray().slice(begin));
        else
          return new Vector(vector.toArray().slice());
      },
      writable: true,
      enumerable: false
    },
    /**
     * [Iteration methods]
     */
    'filter': {
      value: function(callback, next) {
        var filter = new Vector(vector.toArray().filter(callback));
          if (next)
            return next(filter);
          else
            return filter;
      },
      writable: true,
      enumerable: false
    },
    'every': {
      value: function(callback, next) {
        var every = vector.toArray().every(callback);
        if (next)
          return next(every);
        else
          return every;
      },
      writable: true,
      enumerable: false
    },
    'map': {
      value: function(callback, next) {
        var map = new Vector(vector.toArray().map(callback));
        if (next)
          return next(map);
        else
          return map;
      },
      writable: true,
      enumerable: false
    },
    'some': {
      value: function(callback, next) {
        var some = vector.toArray().some(callback);
        if (next)
          return next(some);
        else
          return some;
      },
      writable: true,
      enumerable: false
    },
    'reduce': {
      value: function(callback, initialValue, next) {
        var args = Array.prototype.slice.call(arguments);
        if (args.length === 3)
          return next(vector.toArray().reduce(callback, initialValue));
        else if (args.length === 2) {
          if (typeof args[1] === 'function')
            return next(vector.toArray().reduce(callback));
          else
            return vector.toArray().reduce(callback, initialValue);
        }
        else
          return vector.toArray().reduce(callback);
      },
      writable: true,
      enumerable: false
    },
    'reduceRight': {
      value: function(callback, initialValue, next) {
        var args = Array.prototype.slice.call(arguments);
        if (args.length === 3)
          return next(vector.toArray().reduceRight(callback, initialValue));
        else if (args.length === 2) {
          if (typeof args[1] === 'function')
            return next(vector.toArray().reduceRight(callback));
          else
            return vector.toArray().reduceRight(callback, initialValue);
        }
        else
          return vector.toArray().reduceRight(callback);
      },
      writable: true,
      enumerable: false
    },
    /**
     * Return the Vector extended with named functions.
     * @param methods Object { 'functionName': function() {} }
     */
    'extend': {
      value: function(methods, callback) {
        for (var method in methods) {
          Object.defineProperty(vector, method, {
            value: function() {
              return methods[method].apply(vector, arguments);
            },
            writable: true,
            enumerable: false
          });
        }
        if (callback)
          return callback(vector);
        else
          return vector;
      },
      writable: true,
      enumerable: false
    }
  });

  cache.sum = vector.sum();
  cache.product = vector.product();
  cache.variance = vector.variance();

  return vector;
};

Array.prototype.toVector = function() {
  return new Vector(this);
};

exports = module.exports = Vector;
