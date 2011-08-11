/**
 * Vector: One dimensional array.
 * Extends upon the Array datatype to do some serious number crunching.
 * @author Fredrick Galoso
 */

Array.prototype.asc = function(a, b) {
    return a - b;
};

Array.prototype.desc = function(a, b) {
    return b - a;
};

/* Returns a clone of the Vector object */
Array.prototype.clone = function(callback) {
    var object = (this instanceof Array) ? [] : {};
    for (i in this) {
        if (i === 'clone') continue;
        if (this[i] && typeof this[i] === 'object') {
            object[i] = this[i].clone();
        } else object[i] = this[i]
    }
    if (callback)
        return callback(object);
    else
        return object;
};

/* Returns a copy of the values in a Vector object */
Array.prototype.copy = function(callback) {
    var values = this.slice(0);
    if (callback)
        return callback(values);
    else
        return values;
}

Array.prototype.sum = function(callback) {
    for (var i = 0, sum = 0.0; i < this.length;) {
        sum += this[i++];
    }
    if (callback)
        return callback(sum);
    else
        return sum;
};

Array.prototype.mean = function(callback) {
    var mean = this.sum() / this.length;
    if (callback)
        return callback(mean);
    else
        return mean;
};

Array.prototype.median = function(callback) {
    var buffer = this.copy()
    buffer.sort(this.asc);
    var median = (this.length % 2 === 0) ?
        (buffer[this.length / 2 - 1] + buffer[this.length / 2]) / 2 :
        buffer[parseInt(this.length / 2)];
    if (callback)
        return callback(median);
    else
        return median;
};

Array.prototype.mode = function(callback) {
    var map = {};
    var count = 1;
    var modes = [this[0]];
    for (var i = 0; i < this.length; i++) {
        var e = this[i];
        if (map[e] == null)
            map[e] = 1;
        else
            map[e]++;
        if (map[e] > count) {
            modes = [e];
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
}

Array.prototype.range = function(callback) {
    var range = this.max() - this.min();
    if (callback)
        return callback(range);
    else
        return range;
}

Array.prototype.variance = function(callback) {
    for (var i = 0, variance = 0.0; i < this.length;) {
        variance += Math.pow((this[i++] - this.mean()), 2);
    }
    variance /= this.length;
    if (callback)
        return callback(variance);
    else
        return variance;
};

Array.prototype.stdev = function(percentile, callback) {
    var stdev = 0.0;
    if (!percentile)
        stdev = Math.sqrt(this.variance());
    else
        return this.density(percentile).stdev();
    if (callback)
        return callback(stdev);
    else
        return stdev;
};

/* Returns the frequency of an element in the array */
Array.prototype.frequency = function(element, callback) {
    var freq = 0;
    /*TODO if element is not given, display frequency distribution*/
    if (this.indexOf(element) !== -1) {
        var buffer = this.copy()
        buffer.sort(this.asc);
        freq = buffer.lastIndexOf(element) - buffer.indexOf(element) + 1;
    }
    if (callback)
        return callback(freq);
    else
        return freq;
};

/* Returns an element from an array given a percentile */
Array.prototype.percentile = function(percent, callback) {
    var buffer = this.copy()
    buffer.sort(this.asc);
    var percentile = buffer[0];
    if (percent > 0)
        percentile = buffer[Math.ceil(this.length * percent) - 1];
    if (callback)
        return callback(percentile);
    else
        return percentile;
};

/**
 * Returns a Vector (Array) of values within a given percent density
 *
 * Example:
 *    this.density(0.50); would return an array consisting of the values
 *    between the 25% and 75% percentile of the population
 */
Array.prototype.density = function(percent, callback) {
    var slice;
    var buffer = this.copy()
    buffer.sort(this.asc);
    if (percent == 1)
        return buffer;
    else {
        var begin = Math.round(this.length * (0.5 - percent / 2) - 1);
        var end = Math.round(this.length * (0.5 + percent / 2) - 1);
        slice = buffer.slice(begin, end);
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
Array.prototype.distribution = function(format, callback) {
    var buffer = this.copy()
    buffer.sort(this.asc);
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

Array.prototype.quantile = function(quantity, callback) {
    var buffer = this.copy()
    buffer.sort(this.asc);
    var increment = 1.0 / quantity;
    var results = [];
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
};

Array.prototype.max = function(callback) {
    var max = Math.max.apply({},this);
    if (callback)
        return callback(max);
    else
        return max;
};

Array.prototype.min = function(callback) {
    var min = Math.min.apply({},this);
    if (callback)
        return callback(min);
    else
        return min;
};

exports = module.exports = Array;
