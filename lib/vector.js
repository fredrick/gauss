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

    if (Array.prototype.slice.call(arguments).length === 0) {
      vector = [];
    }

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
    };

    // Sorting primatives
    var asc = function(a, b) {
      return a - b;
    };

    var extend = function(value, callback) {
      value = Array.isArray(value) ?
        new Vector(value) : value;
      if (callback) {
        return callback(value);
      }
      else {
        return value;
      }
    };

    var result = function(value, callback) {
      if (callback) {
        return callback(value);
      }
      else {
        return value;
      }
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
        return extend(Collection.indicesOf.apply(this, arguments), callback);
      },
      indicesBy: function(predicate, callback) {
        return extend(Collection.indicesBy.apply(this, arguments), callback);
      },
      lastIndexBy: function(predicate, callback) {
        return extend(Collection.lastIndexBy.apply(this, arguments), callback);
      },
      find: function(predicate, callback) {
        return extend(Collection.find.apply(this, arguments), callback);
      },
      findOne: function(predicate, callback) {
        return extend(Collection.findOne.apply(this, arguments), callback);
      },
      mode: function(callback) {
        return extend(Collection.mode.apply(this), callback);
      },
      frequency: Collection.frequency,
      distribution: Collection.distribution,
      append: Collection.append,
      equal: Collection.equal,
      clone: function(callback) {
        return extend(Collection.clone.apply(this), callback);
      },
      copy: function(callback) {
        return extend(Collection.copy.apply(this), callback);
      },
      toArray: Collection.toArray,
      /**
       * [Accessor methods]
       */
      concat: function() {
        var args = Array.prototype.slice.call(arguments);
        var end = args[args.length - 1];
        if (typeof end === 'function') {
          return extend(Collection.concat.apply(this, arguments), end);
        }
        else {
          return extend(Collection.concat.apply(this, arguments));
        }
      },
      slice: function(begin, end, callback) {
        return extend(Collection.slice.apply(this, arguments), callback);
      },
      split: function(predicate, callback) {
        return extend(Collection.split.apply(this, arguments), callback);
      },
      unique: function(callback) {
        return extend(Collection.unique.apply(this), callback);
      },
      /**
       * [Iteration methods]
       */
      filter: function(callback, next) {
        return extend(Collection.filter.apply(this, arguments), next);
      },
      every: Collection.every,
      map: function(callback, next) {
        return extend(Collection.map.apply(this, arguments), next);
      },
      some: Collection.some,
      reduce: function(callback, initialValue, next) {
        return extend(Collection.reduce.apply(this, arguments), next);
      },
      reduceRight: function(callback, initialValue, next) {
        return extend(Collection.reduceRight.apply(this, arguments), next);
      },
      union: function(that, callback) {
        return extend(Collection.union.apply(this, arguments), callback);
      },
      sum: function(callback) {
        var sum = 0.0;
        if (this.equal(cache.values) && cache.sum !== 0.0) {
          sum = cache.sum;
        }
        else {
          for (var i = 0; i < this.length;) {
            sum += this[i++];
          }
          // Memoize sum
          cache.sum = sum;
          cache.sync();
        }
        return result(sum, callback);
      },
      product: function(callback) {
        var product = 1.0;
        if (this.equal(cache.values) && cache.product !== 1.0) {
          product = cache.product;
        }
        else {
          for (var i = 0; i < this.length;) {
            product *= this[i++];
            // Memoize product
            cache.product = product;
            cache.sync();
          }
        }
        return result(product, callback);
      },
      mean: function(callback) {
        var mean = this.sum() / this.length;
        return result(mean, callback);
      },
      gmean: function(callback) {
        var gmean = Math.pow(Math.abs(this.product()), 1 / this.length);
        return result(gmean, callback);
      },
      hmean: function(callback) {
        function reciprocalSum(set) {
          for (var i = 0, sum = 0.0; i < set.length;) {
            sum += 1 / Math.abs(set[i++]);
          }
          return sum;
        }
        var hmean = this.length / reciprocalSum(this);
        return result(hmean, callback);
      },
      qmean: function(callback) {
        var qmean = Math.sqrt(this.pow(2).sum() / this.length);
        return result(qmean, callback);
      },
      pmean: function(p, callback) {
        var pmean = 0.0;
        for (var i = 0; i < this.length;) {
          pmean += Math.pow(this[i++], p);
        }
        pmean = Math.pow(pmean / this.length, 1/p);
        return result(pmean, callback);
      },
      median: function(callback) {
        var buffer = this.copy();
        buffer.sort(asc);
        var median = (this.length % 2 === 0) ?
          (buffer[this.length / 2 - 1] + buffer[this.length / 2]) / 2 :
          buffer[parseInt((this.length / 2), 10)];
        return result(median, callback);
      },
      range: function(callback) {
        var range = this.max() - this.min();
        return result(range, callback);
      },
      /* Returns a measure of how far a set of numbers are spread out from each other. */
      variance: function(callback) {
        var mean = 0.0,
            variance = 0.0;
        if (this.equal(cache.values) && cache.variance !== 0.0) {
          variance = cache.variance;
        }
        else {
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
        return result(variance, callback);
      },
      stdev: function(percentile, callback) {
        var stdev = 0.0;
        if (!percentile) {
          stdev = Math.sqrt(this.variance());
        }
        else {
          stdev = this.density(percentile).stdev();
        }
        return result(stdev, callback);
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
        if (percent > 0) {
          percentile = buffer[Math.floor(this.length * percent)];
        }
        return result(percentile, callback);
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
        if (percent === 1) {
          slice = buffer;
        }
        else {
          var begin = Math.round(this.length * (0.5 - percent / 2) - 1);
          var end = Math.round(this.length * (0.5 + percent / 2) - 1);
          slice = new Vector(buffer.slice(begin, end));
        }
        return result(slice, callback);
      },
      quantile: function(quantity, callback) {
        var buffer = this.copy();
        buffer.sort(asc);
        var increment = 1.0 / quantity;
        var results = new Vector();
        if (quantity > this.length) {
          throw new RangeError('Subset quantity is greater than the Vector length');
        }
        for (var i = increment; i < 1; i += increment) {
          var index = Math.round(buffer.length * i) - 1;
          if (index < buffer.length - 1) {
            results.push(buffer[index]);
          }
        }
        return result(results, callback);
      },
      /* Returns a Vector of values containing the sequential difference between numbers in a sequence. */
      delta: function(callback) {
        var delta = new Vector();
        for (var i = 1; i < this.length; i++) {
          delta.push(this[i] - this[i - 1]);
        }
        return result(delta, callback);
      },
      /** Moving average */
      /**
       * Returns a Vector of the simple moving average (SMA); unweighted means of the previous n data points.
       * @param period Length of observation window for moving average
       */
      sma: function(period, callback) {
        var sma;
        if (period === 1) {
          sma = this;
        }
        else {
          // Memoize (rolling) sum to avoid additional O(n) overhead
          var sum = new Vector(this.slice(0, period)).sum();
          sma = new Vector([sum / period]);
          for (var i = 1; i < this.length - period + 1; i++) {
            sum += this[i + period - 1] - this[i - 1];
            sma.push(sum / period);
          }
        }
        return result(sma, callback);
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
            ratio *
            (this[i + options.period - 1] - ema[i - 1]) +
            ema[i - 1]
          );
        }
        return result(ema, callback);
      },
      /**
       * [Sample]
       * Sample statistics methods
       */
      sample: {
        mean: function(callback) {
          var mean = vector.sum() / (vector.length - 1);
          return result(mean, callback);
        },
        gmean: function(callback) {
          var gmean = Math.pow(Math.abs(vector.product()), 1 / (vector.length - 1));
          return result(gmean, callback);
        },
        hmean: function(callback) {
          function reciprocalSum(set) {
            for (var i = 0, sum = 0.0; i < set.length;) {
              sum += 1 / Math.abs(set[i++]);
            }
            return sum;
          }
          var hmean = (vector.length - 1) / reciprocalSum(vector);
          return result(hmean, callback);
        },
        qmean: function(callback) {
          var qmean = Math.sqrt(vector.pow(2).sum() / (vector.length - 1));
          return result(qmean, callback);
        },
        pmean: function(p, callback) {
          var pmean = 0.0;
          for (var i = 0; i < vector.length;) {
            pmean += Math.pow(vector[i++], p);
          }
          pmean = Math.pow(pmean / (vector.length - 1), 1/p);
          return result(pmean, callback);
        },
        variance: function(callback) {
          var mean = 0.0,
              variance = 0.0;
          if (vector.equal(cache.values) && cache.sample.variance !== 0.0) {
            variance = cache.sample.variance;
          }
          else {
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
          return result(variance, callback);
        },
        stdev: function(callback) {
          var stdev = Math.sqrt(vector.sample.variance());
          return result(stdev, callback);
        }
      },
      /**
       * [Math]
       * Apply JavaScript Math methods to an entire Vector set of numbers
       */
      max: function(callback) {
        var max = Math.max.apply({}, this);
        return result(max, callback);
      },
      min: function(callback) {
        var min = Math.min.apply({}, this);
        return result(min, callback);
      },
      abs: function(callback) {
        var abs = this.map(Math.abs);
        return result(abs, callback);
      },
      acos: function(callback) {
        var acos = this.map(Math.acos);
        return result(acos, callback);
      },
      asin: function(callback) {
        var asin = this.map(Math.asin);
        return result(asin, callback);
      },
      atan: function(callback) {
        var atan = this.map(Math.atan);
        return result(atan, callback);
      },
      ceil: function(callback) {
        var ceil = this.map(Math.ceil);
        return result(ceil, callback);
      },
      cos: function(callback) {
        var cos = this.map(Math.cos);
        return result(cos, callback);
      },
      exp: function(callback) {
        var exp = this.map(Math.exp);
        return result(exp, callback);
      },
      floor: function(callback) {
        var floor = this.map(Math.floor);
        return result(floor, callback);
      },
      log: function(callback) {
        var log = this.map(Math.log);
        return result(log, callback);
      },
      pow: function(exponent, callback) {
        var pow = this.map(function(x) {
          return Math.pow(x, exponent);
        });
        return result(pow, callback);
      },
      round: function(callback) {
        var round = this.map(Math.round);
        return result(round, callback);
      },
      sin: function(callback) {
        var sin = this.map(Math.sin);
        return result(sin, callback);
      },
      sqrt: function(callback) {
        var sqrt = this.map(Math.sqrt);
        return result(sqrt, callback);
      },
      tan: function(callback) {
        var tan = this.map(Math.tan);
        return result(tan, callback);
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
        }
        else {
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
        }
        else {
          for (var j = 0; j < this.length; j++) {
            add[j] = this[j] + that;
          }
        }
        return result(add, callback);
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
        }
        else {
          for (var j = 0; j < this.length; j++) {
            subtract[j] = this[j] - that;
          }
        }
        return result(subtract, callback);
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
        }
        else {
          for (var j = 0; j < this.length; j++) {
            multiply[j] = this[j] * that;
          }
        }
        return result(multiply, callback);
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
        }
        else {
          for (var j = 0; j < this.length; j++) {
            divide[j] = this[j] / that;
          }
        }
        return result(divide, callback);
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
  }
  else {
    exports = module.exports = Vector;
  }
})();
