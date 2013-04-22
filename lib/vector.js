/**
 * Vector: One dimensional array
 * Extends upon the Array datatype to do some serious number crunching.
 * @author Fredrick Galoso
 */

(function() {
  var Collection = (typeof window === 'undefined') ?
    require('./collection') : window.gauss.Collection;
  Collection = Collection();

  var Vector = function(values) {
    "use strict";
    var vector = Array.isArray(values) ?
      values :
      Array.prototype.slice.call(arguments);

    if (Array.prototype.slice.call(arguments).length === 0)
      vector = [];

    // Initialize vector cache
    var cache = {
      sum: 0.0,
      product: 1.0,
      variance: 0.0,
      sample: {
        variance: 0.0
      },
      values: Array.prototype.slice.call(vector)
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
          if (this.equal(cache.values) && cache.sum !== 0.0) {
            sum = cache.sum;
          } else {
              for (var i = 0; i < this.length;) {
                sum += this[i++];
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
          if (this.equal(cache.values) && cache.product !== 1.0) {
            product = cache.product;
          } else {
            for (var i = 0; i < this.length;) {
              product *= this[i++];
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
          var mean = this.sum() / this.length;
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
          var gmean = Math.pow(Math.abs(this.product()), 1 / this.length);
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
          var hmean = this.length / reciprocalSum(this);
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
          var qmean = Math.sqrt(this.pow(2).sum() / this.length)
          if (callback)
            return callback(qmean);
          else
            return qmean;
        },
        writable: true,
        enumerable: false
      },
      'pmean': {
        value: function(p, callback) {
          var pmean = 0.0;
          for (var i = 0; i < this.length;) {
            pmean += Math.pow(this[i++], p);
          }
          pmean = Math.pow(pmean / this.length, 1/p);
          if (callback)
            return callback(pmean);
          else
            return pmean;
        },
        writable: true,
        enumerable: false
      },
      'median': {
        value: function(callback) {
          var buffer = this.copy();
          buffer.sort(asc);
          var median = (this.length % 2 === 0) ?
            (buffer[this.length / 2 - 1] + buffer[this.length / 2]) / 2 :
            buffer[parseInt(this.length / 2)];
          if (callback)
            return callback(median);
          else
            return median;
        },
        writable: true,
        enumerable: false
      },
      'range': {
        value: function(callback) {
          var range = this.max() - this.min();
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
          if (this.equal(cache.values) && cache.variance !== 0.0) {
            variance = cache.variance;
          } else {
              for (var i = 0; i < this.length; i++) {
                var _mean = mean;
                mean += (this[i] - _mean) / (i + 1);
                variance += (this[i] - _mean) * (this[i] - mean);
              }
              variance /= this.length;
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
            stdev = Math.sqrt(this.variance());
          else
            return this.density(percentile).stdev();
          if (callback)
            return callback(stdev);
          else
            return stdev;
        },
        writable: true,
        enumerable: false
      },
      /**
       * Returns the value that below which a certain percent of observations fall within the data set.
       * @param percent {Number}
       * @param callback {Function}
       */
      'percentile' : { 
        value: function(percent, callback) {
          var buffer = this.copy();
          buffer.sort(asc);
          var percentile = buffer[0];
          if (percent > 0)
            percentile = buffer[Math.floor(this.length * percent)];
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
       *
       * @param percent {Number}
       * @param callback {Function}
       */
      'density': {
        value: function(percent, callback) {
          var slice;
          var buffer = this.copy();
          buffer.sort(asc);
          if (percent == 1)
            return buffer;
          else {
            var begin = Math.round(this.length * (0.5 - percent / 2) - 1);
            var end = Math.round(this.length * (0.5 + percent / 2) - 1);
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
      'quantile': {
        value: function(quantity, callback) {
          var buffer = this.copy();
          buffer.sort(asc);
          var increment = 1.0 / quantity;
          var results = new Vector();
          if (quantity > this.length)
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
          for (var i = 1; i < this.length; i++) {
            delta.push(this[i] - this[i - 1]);
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
          if (period === 1) sma = this;
          else {
            // Memoize (rolling) sum to avoid additional O(n) overhead
            var sum = new Vector(this.slice(0, period)).sum();
            sma = new Vector([sum / period]);
            for (var i = 1; i < this.length - period + 1; i++) {
              sum += this[i + period - 1] - this[i - 1];
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
          var sum = new Vector(this.slice(0, options.period)).sum(),
            ema = new Vector([sum / options.period]),
            ratio = options.ratio(options.period);
          for (var i = 1; i < this.length - options.period + 1; i++) {
            ema.push(
              ratio
              * (this[i + options.period - 1] - ema[i - 1])
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
       * [Sample]
       * Sample statistics methods
       */
      'sample': {
        value: {
          mean: function(callback) {
            var mean = vector.sum() / (vector.length - 1);
            if (callback)
              return callback(mean);
            else
              return mean;
          },
          gmean: function(callback) {
            var gmean = Math.pow(Math.abs(vector.product()), 1 / (vector.length - 1));
            if (callback)
              return callback(gmean);
            else
              return gmean;
          },
          hmean: function(callback) {
            function reciprocalSum(set) {
              for (var i = 0, sum = 0.0; i < set.length;) {
                sum += 1 / Math.abs(set[i++]);
              }
              return sum;
            }
            var hmean = (vector.length - 1) / reciprocalSum(vector);
            if (callback)
              return callback(hmean);
            else
              return hmean;
          },
          qmean: function(callback) {
              var qmean = Math.sqrt(vector.pow(2).sum() / (vector.length - 1))
              if (callback)
                return callback(qmean);
              else
                return qmean;
          },
          pmean: function(p, callback) {
            var pmean = 0.0;
            for (var i = 0; i < vector.length;) {
              pmean += Math.pow(vector[i++], p);
            }
            pmean = Math.pow(pmean / (vector.length - 1), 1/p);
            if (callback)
              return callback(pmean);
            else
              return pmean;
          },
          variance: function(callback) {
            var mean = 0.0,
                variance = 0.0;
            if (vector.equal(cache.values) && cache.sample.variance !== 0.0) {
              variance = cache.sample.variance;
            } else {
                for (var i = 0; i < vector.length; i++) {
                  var _mean = mean;
                  mean += (vector[i] - _mean) / (i + 1);
                  variance += (vector[i] - _mean) * (vector[i] - mean);
                }
                variance /= (vector.length - 1);
                // Memoize variance
                cache.sample.variance = variance;
                cache.sync();
            }
            if (callback)
              return callback(variance);
            else
              return variance;
          },
          stdev: function(callback) {
            var stdev = Math.sqrt(vector.sample.variance());
            if (callback)
              return callback(stdev);
            else
              return stdev;
          }
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
          var max = Math.max.apply({}, this);
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
          var min = Math.min.apply({}, this);
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
          var abs = this.map(Math.abs);
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
          var acos = this.map(Math.acos);
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
          var asin = this.map(Math.asin);
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
          var atan = this.map(Math.atan);
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
          var ceil = this.map(Math.ceil);
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
          var cos = this.map(Math.cos);
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
          var exp = this.map(Math.exp);
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
          var floor = this.map(Math.floor);
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
          var log = this.map(Math.log);
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
          var pow = this.map(function(x) {
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
          var round = this.map(Math.round);
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
          var sin = this.map(Math.sin);
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
          var sqrt = this.map(Math.sqrt);
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
          var tan = this.map(Math.tan);
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
      /* Returns a copy of the values in a Vector object */
      'copy': {
        value: function(callback) {
          var copy = new Vector(this.slice());
          if (callback)
            return callback(copy);
          else
            return copy;
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
          var mean = (this.length === 0) ? 0.0 : cache.sum / this.length;
          var variance = (this.length === 0) ? 0.0 : cache.variance * this.length;
          var args = Array.prototype.slice.call(arguments);
          var end = args[args.length - 1];
          var length = this.length;

          if (typeof end === 'function') {
            for (var i = 0; i < args.length - 1; i++) {
              Array.prototype.push.call(this, args[i]);
              Array.prototype.push.call(cache.values, args[i]);

              // Update variance
              var _mean = mean;
              mean += (args[i] - _mean) / this.length;
              variance += (args[i] - _mean) * (args[i] - mean);

              // Update aggregates
              cache.sum += args[i];
              cache.product *= args[i];

              length++;
            }
            variance /= this.length;
            // Memoize variance
            cache.variance = variance;
            return end(length);
          } else {
            for (var i = 0; i < args.length; i++) {
              Array.prototype.push.call(this, args[i]);
              Array.prototype.push.call(cache.values, args[i]);

              // Update variance
              var _mean = mean;
              mean += (args[i] - _mean) / this.length;
              variance += (args[i] - _mean) * (args[i] - mean);

              // Update aggregates
              cache.sum += args[i];
              cache.product *= args[i];

              length++;
            }
            variance /= this.length;
            // Memoize variance
            cache.variance = variance;
            return length;
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
              return end(new Vector(this.toArray().concat(args[0])));
            else
              return end(new Vector(this.toArray().concat(args.slice(0, args.length - 1))));
          }
          else if (typeof args[0] !== 'number')
            return new Vector(this.toArray().concat(args[0]));
          else
            return new Vector(this.toArray().concat(args));
        },
        writable: true,
        enumerable: false
      },
      'slice': {
        value: function(begin, end, callback) {
          var args = Array.prototype.slice.call(arguments);
          if (args.length === 3)
            return callback(new Vector(this.toArray().slice(begin, end)));
          else if (args.length === 2) {
            if (typeof args[1] === 'function')
              return callback(new Vector(this.toArray().slice(begin)));
            else
              return new Vector(this.toArray().slice(begin, end));
          }
          else if (args.length === 1)
            return new Vector(this.toArray().slice(begin));
          else
            return new Vector(this.toArray().slice());
        },
        writable: true,
        enumerable: false
      },
      /**
       * [Iteration methods]
       */
      'filter': {
        value: function(callback, next) {
          var filter = new Vector(this.toArray().filter(callback));
            if (next)
              return next(filter);
            else
              return filter;
        },
        writable: true,
        enumerable: false
      },
      'map': {
        value: function(callback, next) {
          var map = new Vector(this.toArray().map(callback));
          if (next)
            return next(map);
          else
            return map;
        },
        writable: true,
        enumerable: false
      },
      /**
       * Return a Vector extended with named functions.
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

    vector.extend({
      'indexOf': Collection.indexOf,
      'mode': Collection.mode,
      'frequency': Collection.frequency,
      'distribution': Collection.distribution,
      'every': Collection.every,
      'append': Collection.append,
      'unique': Collection.unique,
      'some': Collection.some,
      'reduce': Collection.reduce,
      'reduceRight': Collection.reduceRight,
      'toArray': Collection.toArray,
      'equal': Collection.equal,
      'clone': Collection.clone
    });
    
    cache.sum = vector.sum();
    cache.product = vector.product();
    cache.variance = vector.variance();

    return vector;
  };

  Array.prototype.toVector = function() {
    return new Vector(this);
  };

  if (typeof window !== 'undefined') {
    window.gauss = (typeof window.gauss === 'undefined' ? {} : window.gauss);
    window.gauss.Vector = Vector;
  } else {
    exports = module.exports = Vector;
  }
})();
