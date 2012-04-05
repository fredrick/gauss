/**
 * Vector: One dimensional array.
 * Extends upon the Array datatype to do some serious number crunching.
 * @author Fredrick Galoso
 */

var Vector = function(values) {

    var vector = !(values instanceof Array) ?
        Array.prototype.slice.call(arguments) :
        values;

    if (Array.prototype.slice.call(arguments).length === 0)
        vector = [];

    var cache = {};

    // Sorting primatives
    var asc = function(a, b) {
        return a - b;
    };

    var desc = function(a, b) {
        return b - a;
    };

    vector.sum = function(callback) {
        var sum = 0.0;
        for (var i = 0; i < vector.length;) {
            sum += vector[i++];
        }
        cache.sum = sum;
        if (callback)
            return callback(sum);
        else
            return sum;
    };

    vector.product = function(callback) {
        for (var i = 0, product = 1.0; i < vector.length;) {
            product *= vector[i++];
        }
        if (callback)
            return callback(product);
        else
            return product;
    };

    vector.mean = function(callback) {
        var mean = vector.sum() / vector.length;
        if (callback)
            return callback(mean);
        else
            return mean;
    };

    vector.gmean = function(callback) {
        var gmean = Math.pow(Math.abs(vector.product()), 1 / vector.length);
        if (callback)
            return callback(gmean);
        else
            return gmean;
    };

    vector.hmean = function(callback) {
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
    };

    vector.qmean = function(callback) {
        var qmean = Math.sqrt(vector.pow(2).sum() / vector.length)
        if (callback)
            return callback(qmean);
        else
            return qmean;
    };

    vector.median = function(callback) {
        var buffer = vector.copy();
        buffer.sort(asc);
        var median = (vector.length % 2 === 0) ?
            (buffer[vector.length / 2 - 1] + buffer[vector.length / 2]) / 2 :
            buffer[parseInt(vector.length / 2)];
        if (callback)
            return callback(median);
        else
            return median;
    };

    vector.mode = function(callback) {
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
    };

    vector.range = function(callback) {
        var range = vector.max() - vector.min();
        if (callback)
            return callback(range);
        else
            return range;
    };

    vector.variance = function(callback) {
        for (var i = 0, variance = 0.0; i < vector.length;) {
            variance += Math.pow((vector[i++] - vector.mean()), 2);
        }
        variance /= vector.length;
        if (callback)
            return callback(variance);
        else
            return variance;
    };

    vector.stdev = function(percentile, callback) {
        var stdev = 0.0;
        if (!percentile)
            stdev = Math.sqrt(vector.variance());
        else
            return vector.density(percentile).stdev();
        if (callback)
            return callback(stdev);
        else
            return stdev;
    };

    /* Returns the frequency of an element in the array */
    vector.frequency = function(element, callback) {
        var freq = 0;
        /*TODO if element is not given, display frequency distribution*/
        if (vector.indexOf(element) !== -1) {
            var buffer = vector.copy();
            buffer.sort(asc);
            freq = buffer.lastIndexOf(element) - buffer.indexOf(element) + 1;
        }
        if (callback)
            return callback(freq);
        else
            return freq;
    };

    /* Returns an element from an array given a percentile */
    vector.percentile = function(percent, callback) {
        var buffer = vector.copy();
        buffer.sort(asc);
        var percentile = buffer[0];
        if (percent > 0)
            percentile = buffer[Math.floor(vector.length * percent)];
        if (callback)
            return callback(percentile);
        else
            return percentile;
    };

    /**
     * Returns a Vector (Array) of values within a given percent density
     *
     * Example:
     *    vector.density(0.50); would return an array consisting of the values
     *    between the 25% and 75% percentile of the population
     */
    vector.density = function(percent, callback) {
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
    };

    /**
     * Returns an Object containing the distribution of values within the array
     * @param format Override distribution format with Percent Distribution. Default: Raw count
     */
    vector.distribution = function(format, callback) {
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
    };

    vector.quantile = function(quantity, callback) {
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
    };

    /* Returns a new Vector containing the sequential difference between numbers in a sequence */
    vector.delta = function(callback) {
        var delta = new Vector();
        for (var i = 1; i < vector.length; i++) {
            delta.push(vector[i] - vector[i - 1]);
        }
        if (callback)
            return callback(delta);
        else
            return delta;
    };

    /** Moving average */
    /**
     * Returns a new Vector of the simple moving average (SMA); unweighted means of the previous n data points
     * @param period Length of observation window for moving average
     */
    vector.sma = function(period, callback) {
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
    };

    /**
     * Returns a new Vector of the exponential moving average (EMA); weighted means of the previous n data points
     * @param options
        Number Length of the observation window for moving average, use default smoothing ratio (2 / period + 1)
        or
        Object.period Length of the observation window for moving average
        Object.ratio Function returning a Number to be used as smoothing ratio
     */
    vector.ema = function(options, callback) {
        // Single numeric argument defining the smoothing period
        if (typeof(options) === 'number') {
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
    };

    /**
     * Apply JavaScript Math methods to an entire Vector set of numbers
     */
    vector.max = function(callback) {
        var max = Math.max.apply({}, vector);
        if (callback)
            return callback(max);
        else
            return max;
    };

    vector.min = function(callback) {
        var min = Math.min.apply({}, vector);
        if (callback)
            return callback(min);
        else
            return min;
    };

    vector.abs = function(callback) {
        var abs = vector.map(function(x) {
            return Math.abs(x);
        });
        if (callback)
            return callback(abs);
        else
            return abs;
    };

    vector.acos = function(callback) {
        var acos = vector.map(function(x) {
            return Math.acos(x);
        });
        if (callback)
            return callback(acos);
        else
            return acos;
    };

    vector.asin = function(callback) {
        var asin = vector.map(function(x) {
           return Math.asin(x); 
        });
        if (callback)
            return callback(asin);
        else
            return asin;
    };

    vector.atan = function(callback) {
        var atan = vector.map(function(x) {
            return Math.atan(x);
        });
        if (callback)
            return callback(atan);
        else
            return atan;
    };

    vector.ceil = function(callback) {
        var ceil = vector.map(function(x) {
            return Math.ceil(x);
        });
        if (callback)
            return callback(ceil);
        else
            return ceil;
    };

    vector.cos = function(callback) {
        var cos = vector.map(function(x) {
            return Math.cos(x);
        });
        if (callback)
            return callback(cos);
        else
            return cos;
    };

    vector.exp = function(callback) {
        var exp = vector.map(function(x) {
            return Math.exp(x);
        });
        if (callback)
            return callback(exp);
        else
            return exp;
    };

    vector.floor = function(callback) {
        var floor = vector.map(function(x) {
            return Math.floor(x);
        });
        if (callback)
            return callback(floor);
        else
            return floor;
    };

    vector.log = function(callback) {
        var log = vector.map(function(x) {
            return Math.log(x);
        });
        if (callback)
            return callback(log);
        else
            return log;
    };

    vector.pow = function(exponent, callback) {
        var pow = vector.map(function(x) {
            return Math.pow(x, exponent);
        });
        if (callback)
            return callback(pow);
        else
            return pow;
    };

    vector.round = function(callback) {
        var round = vector.map(function(x) {
            return Math.round(x);
        });
        if (callback)
            return callback(round);
        else
            return round;
    };

    vector.sin = function(callback) {
        var sin = vector.map(function(x) {
           return Math.sin(x); 
        });
        if (callback)
            return callback(sin);
        else
            return sin;
    };

    vector.sqrt = function(callback) {
        var sqrt = vector.map(function(x) {
            return Math.sqrt(x);
        });
        if (callback)
            return callback(sqrt);
        else
            return sqrt;
    };

    vector.tan = function(callback) {
        var tan = vector.map(function(x) {
            return Math.tan(x);
        });
        if (callback)
            return callback(tan);
        else
            return tan;
    };

    /* Returns a clone of the Vector object */
    vector.clone = function(callback) {
        var object = (vector instanceof Array) ? [] : {};
        for (i in vector) {
            if (i === 'clone') continue;
            if (vector[i] && typeof vector[i] === 'object') {
                object[i] = vector[i].clone();
            } else object[i] = vector[i]
        }
        if (callback)
            return callback(object);
        else
            return object;
    };

    /* Returns a copy of the values in a Vector object */
    vector.copy = function(callback) {
        var copy = new Vector(vector.slice());
        if (callback)
            return callback(copy);
        else
            return copy;
    };

    /* Returns a vanilla Array of values */
    vector.array = function(callback) {
        var array = Array.prototype.slice.call(vector);
        if (callback)
            return callback(array);
        else
            return array;
    };

    /**
     * Override Array methods and add Vector functionality
     */

    /* Mutator methods */

    /* Accessor methods */
    vector.slice = function(begin, end, callback) {
        var args = Array.prototype.slice.call(arguments);
        var slice;
        if (args.length === 3)
            return callback(new Vector(vector.array().slice(begin, end)));
        else if (args.length === 2) {
            if (typeof args[1] === 'function')
                return callback(new Vector(vector.array().slice(begin)));
            else
                return new Vector(vector.array().slice(begin, end));
        }
        else if (args.length === 1)
            return new Vector(vector.array().slice(begin));
        else
            return new Vector(vector.array().slice());
    };

    /* Iteration methods */
    vector.map = function(callback) {
        var map = vector.array().map(callback);
        return new Vector(map);
    };

    return vector;
};

exports = module.exports = Vector;
