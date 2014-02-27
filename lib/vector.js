/**
 * Vector: One dimensional array
 * Extends upon the Array datatype to do some serious number crunching.
 * @author Fredrick Galoso
 */

(function() {
  var Collection = (typeof window === 'undefined') ?
    require('./collection') : window.gauss.Collection;
  Collection = new Collection();

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

    var result = function(value, callback) {
      value = (typeof value === 'number') ?
        value : new Vector(value);
      if (callback)
        return callback(value);
      else
        return value;
    };

    Object.defineProperty(vector, 'extend', {
      /**
       * Return a Vector extended with named functions.
       * @param methods Object { 'functionName': function() {} }
       */
      value: function(methods, callback) {
        Collection.extend.bind(this);
        return Collection.extend.apply(this, arguments);
      },
      writable: true,
      enumerable: false
    });

    vector.extend({
      indexOf: Collection.indexOf,
      indexBy: Collection.indexBy,
      indicesOf: function(element, callback) {
        return result(Collection.indicesOf.apply(this, arguments), callback);
      },
      indicesBy: function(predicate, callback) {
        return result(Collection.indicesBy.apply(this, arguments), callback);
      },
      lastIndexBy: function(predicate, callback) {
        return result(Collection.lastIndexBy.apply(this, arguments), callback);
      },
      find: function(predicate, callback) {
        return result(Collection.find.apply(this, arguments), callback);
      },
      findOne: function(predicate, callback) {
        return result(Collection.findOne.apply(this, arguments), callback);
      },
      mode: function(callback) {
        return result(Collection.mode.apply(this), callback);
      },
      frequency: Collection.frequency,
      distribution: Collection.distribution,
      append: Collection.append,
      equal: Collection.equal,
      clone: function(callback) {
        return result(Collection.clone.apply(this), callback);
      },
      copy: function(callback) {
        return result(Collection.copy.apply(this), callback);
      },
      toArray: Collection.toArray,
      /**
       * [Accessor methods]
       */
      concat: function() {
        var args = Array.prototype.slice.call(arguments);
        var end = args[args.length - 1];
        return result(Collection.concat.apply(this, arguments), end);
      },
      slice: function(begin, end, callback) {
        return result(Collection.slice.apply(this, arguments), callback);
      },
      split: function(predicate, callback) {
        return result(Collection.split.apply(this, arguments), callback);
      },
      unique: function(callback) {
        return result(Collection.unique.apply(this), callback);
      },
      /**
       * [Iteration methods]
       */
      filter: function(callback, next) {
        return result(Collection.filter.apply(this, arguments), next);
      },
      every: Collection.every,
      map: function(callback, next) {
        return result(Collection.map.apply(this, arguments), next);
      },
      some: Collection.some,
      reduce: function(callback, initialValue, next) {
        return result(Collection.reduce.apply(this, arguments), next);
      },
      reduceRight: function(callback, initialValue, next) {
        return result(Collection.reduceRight.apply(this, arguments), next);
      },
      union: function(that, callback) {
        return result(Collection.union.apply(this, arguments), callback);
      },
      sum: function(callback) {
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
      product: function(callback) {
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
      mean: function(callback) {
        var mean = this.sum() / this.length;
        if (callback)
          return callback(mean);
        else
          return mean;
      },
      gmean: function(callback) {
        var gmean = Math.pow(Math.abs(this.product()), 1 / this.length);
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
        var hmean = this.length / reciprocalSum(this);
        if (callback)
          return callback(hmean);
        else
          return hmean;
      },
      qmean: function(callback) {
        var qmean = Math.sqrt(this.pow(2).sum() / this.length)
        if (callback)
          return callback(qmean);
        else
          return qmean;
      },
      pmean: function(p, callback) {
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
      median: function(callback) {
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
      range: function(callback) {
        var range = this.max() - this.min();
        if (callback)
          return callback(range);
        else
          return range;
      },
      /* Returns a measure of how far a set of numbers are spread out from each other. */
      variance: function(callback) {
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
      stdev: function(percentile, callback) {
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
      /**
       * Returns the value that below which a certain percent of observations fall within the data set.
       * @param percent {Number}
       * @param callback {Function}
       */
      percentile: function(percent, callback) {
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
      density: function(percent, callback) {
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
      quantile: function(quantity, callback) {
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
      /* Returns a Vector of values containing the sequential difference between numbers in a sequence. */
      delta: function(callback) {
        var delta = new Vector();
        for (var i = 1; i < this.length; i++) {
          delta.push(this[i] - this[i - 1]);
        }
        if (callback)
          return callback(delta);
        else
          return delta;
      },
      /** Moving average */
      /**
       * Returns a Vector of the simple moving average (SMA); unweighted means of the previous n data points.
       * @param period Length of observation window for moving average
       */
      sma: function(period, callback) {
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
      /**
       * Returns a Vector of the exponential moving average (EMA); weighted means of the previous n data points.
       * @param options
       *   Number Length of the observation window for moving average, use default smoothing ratio (2 / period + 1)
       *   or
       *   Object.period Length of the observation window for moving average
       *   Object.ratio Function returning a Number to be used as smoothing ratio
       */
      ema: function(options, callback) {
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
      /**
       * [Sample]
       * Sample statistics methods
       */
      sample: {
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
      /**
       * [Math]
       * Apply JavaScript Math methods to an entire Vector set of numbers
       */
      max: function(callback) {
        var max = Math.max.apply({}, this);
        if (callback)
          return callback(max);
        else
          return max;
      },
      min: function(callback) {
        var min = Math.min.apply({}, this);
        if (callback)
          return callback(min);
        else
          return min;
      },
      abs: function(callback) {
        var abs = this.map(Math.abs);
        if (callback)
          return callback(abs);
        else
          return abs;
      },
      acos: function(callback) {
        var acos = this.map(Math.acos);
        if (callback)
          return callback(acos);
        else
          return acos;
      },
      asin: function(callback) {
        var asin = this.map(Math.asin);
        if (callback)
          return callback(asin);
        else
          return asin;
      },
      atan: function(callback) {
        var atan = this.map(Math.atan);
        if (callback)
          return callback(atan);
        else
          return atan;
      },
      ceil: function(callback) {
        var ceil = this.map(Math.ceil);
        if (callback)
          return callback(ceil);
        else
          return ceil;
      },
      cos: function(callback) {
        var cos = this.map(Math.cos);
        if (callback)
          return callback(cos);
        else
          return cos;
      },
      exp: function(callback) {
        var exp = this.map(Math.exp);
        if (callback)
          return callback(exp);
        else
          return exp;
      },
      floor: function(callback) {
        var floor = this.map(Math.floor);
        if (callback)
          return callback(floor);
        else
          return floor;
      },
      log: function(callback) {
        var log = this.map(Math.log);
        if (callback)
          return callback(log);
        else
          return log;
      },
      pow: function(exponent, callback) {
        var pow = this.map(function(x) {
          return Math.pow(x, exponent);
        });
        if (callback)
          return callback(pow);
        else
          return pow;
      },
      round: function(callback) {
        var round = this.map(Math.round);
        if (callback)
          return callback(round);
        else
          return round;
      },
      sin: function(callback) {
        var sin = this.map(Math.sin);
        if (callback)
          return callback(sin);
        else
          return sin;
      },
      sqrt: function(callback) {
        var sqrt = this.map(Math.sqrt);
        if (callback)
          return callback(sqrt);
        else
          return sqrt;
      },
      tan: function(callback) {
        var tan = this.map(Math.tan);
        if (callback)
          return callback(tan);
        else
          return tan;
      },
      /**
       * Override Array methods and add Vector functionality
       *
       * [Mutator methods]
       *
      /* Returns updated Vector and performs on-line calculations */
      push: function() {
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
      /**
       * [Binary operations]
       */
      /**
       *
       * Returns a new vector which is the result of adding the input, element-wise to existing vector.
       * Supports scalars and arrays of the same length of the original vector
       */
      add: function(that, callback) {
        var add = new Vector();
        if (Array.isArray(that)) {
          if (that.length !== this.length) {
            throw new RangeError("Cannot add vectors of differing lengths");
          }
          for (var i = 0; i < this.length; i++) {
            add[i] = this[i] + that[i];
          }
        } else {
          for (var j = 0; j < this.length; j++) {
            add[j] = this[j] + that;
          }
        }
        if (callback)
          return callback(add);
        else
          return add;
      },
      /**
       *
       * Returns a new vector which is the result of element-wise subtracting the input from the original vector.
       * Supports scalars and arrays of the same length of the original vector
       */
      subtract: function(that, callback) {
        var subtract = new Vector();
        if (Array.isArray(that)) {
          if (that.length !== this.length) {
            throw new RangeError("Cannot subtract vectors of differing lengths");
          }
          for (var i = 0; i < this.length; i++) {
            subtract[i] = this[i] - that[i];
          }
        } else {
          for (var j = 0; j < this.length; j++) {
            subtract[j] = this[j] - that;
          }
        }
        if (callback)
          return callback(subtract);
        else
          return subtract;
      },
      /**
       *
       * Returns a new vector which is the result of element-wise multiplying the original by the input.
       * Supports scalars and arrays of the same length of the original vector
       */
      multiply: function(that, callback) {
        var multiply = new Vector();
        if (Array.isArray(that)) {
          if (that.length !== this.length) {
            throw new RangeError("Cannot multiply vectors of differing lengths");
          }
          for (var i = 0; i < this.length; i++) {
            multiply[i] = this[i] * that[i];
          }
        } else {
          for (var j = 0; j < this.length; j++) {
            multiply[j] = this[j] * that;
          }
        }
        if (callback)
          return callback(multiply);
        else
          return multiply;
      },
      /**
       *
       * Returns a new vector which is the result of element-wise dividing the original by the input.
       * Supports scalars and arrays of the same length of the original vector
       */
      divide: function(that, callback) {
        var divide = new Vector();
        if (Array.isArray(that)) {
          if (that.length !== this.length) {
            throw new RangeError("Cannnot divide vectors of differing lengths");
          }
          for (var i = 0; i < this.length; i++) {
            divide[i] = this[i] / that[i];
          }
        } else {
          for (var j = 0; j < this.length; j++) {
            divide[j] = this[j] / that;
          }
        }
        if (callback)
          return callback(divide);
        else
          return divide;
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

  if (typeof window !== 'undefined') {
    window.gauss = (typeof window.gauss === 'undefined' ? {} : window.gauss);
    window.gauss.Vector = Vector;
  } else {
    exports = module.exports = Vector;
  }
})();
