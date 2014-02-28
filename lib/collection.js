/**
 * Collection: n-dimensional array/set
 * Extends upon the Array datatype for set operations.
 * @author Fredrick Galoso
 */

(function() {
  var Collection = function(values) {
    "use strict";
    var collection = Array.isArray(values) ?
      values :
      Array.prototype.slice.call(arguments);

    if (Array.prototype.slice.call(arguments).length === 0) {
      collection = [];
    }

    var result = function(value, callback) {
      if (callback) {
        return callback(value);
      }
      else {
        return value;
      }
    };

    Object.defineProperty(collection, 'extend', {
      /**
       * Return a Collection extended with named functions.
       * @param methods Object { 'functionName': function() {} }
       */
      value: function(methods, callback) {
        for (var method in methods) {
          Object.defineProperty(this, method, {
            value: methods[method],
            writable: true,
            enumerable: false
          });
        }
        return result(this, callback);
      },
      writable: true,
      enumerable: false
    });

    collection.extend({
      indexOf: function(element, callback) {
        var index = -1;
        for (var i = 0; i < this.length; i++) {
          if (this[i] === element) {
            index = i;
            break;
          }
        }
        return result(index, callback);
      },
      /**
       * Returns the first index of an element that matches a condition.
       * @param predicate {Function}
       * @param callback {Function}
       */
      indexBy: function(predicate, callback) {
        var index = -1;
        for (var i = 0; i < this.length; i++) {
          if (predicate(this[i])) {
            index = i;
            break;
          }
        }
        return result(index, callback);
      },
      /**
       * Returns the indices of all elements that match a value.
       * @param element {Object}
       * @param callback {Function}
       */
      indicesOf: function(element, callback) {
        var start = this.indexOf(element),
            end = this.lastIndexOf(element),
            indices = new Collection();
        if (start === end) {
          indices.push(start);
        }
        else {
          for (var i = start; i <= end; i++) {
            if (this[i] === element) {
              indices.push(i);
            }
          }
        }
        return result(indices, callback);
      },
      /**
       * Returns all indices of an element that match a condition.
       * @param predicate {Function}
       * @param callback {Function}
       */
      indicesBy: function(predicate, callback) {
        var start = 0,
            end = this.length - 1,
            indices = new Collection();
        if (start === end) {
          indices.push(start);
        }
        else {
          for (var i = start; i <= end; i++) {
            if (predicate(this[i])) {
              indices.push(i);
            }
          }
        }
        return result(indices, callback);
      },
      /**
       * Returns the last index of an element that matches a condition.
       * @param predicate {Function}
       * @param callback {Function}
       */
      lastIndexBy: function(predicate, callback) {
        var index = -1;
        for (var i = this.length - 1; i >= 0; i--) {
          if (predicate(this[i])) {
            index = i;
            break;
          }
        }
        return result(index, callback);
      },
      /**
       * Returns all the elements that match a condition.
       * @param predicate {Function or Object}
       * @param callback {Function}
       */
      find: function(predicate, callback) {
        var results = new Collection(),
            comparator = function(e) { return e === true; };
        if (typeof predicate === 'object') {
          for (var i = 0; i < this.length; i++) {
            var conditions = [];
            for (var key in predicate) {
              conditions.push(predicate[key] === this[i][key]);
            }
            if (conditions.every(comparator)) {
              results.push(this[i]);
            }
          }
        } else {
          for (var i = 0; i < this.length; i++) {
            if (predicate(this[i])) {
              results.push(this[i]);
            }
          }
        }
        return result(results, callback);
      },
      /**
       * Returns the first element that matches a condition.
       * @param predicate {Function or Object}
       * @param callback {Function}
       */
      findOne: function(predicate, callback) {
        var element,
            comparator = function(e) { return e === true; };
        if (typeof predicate === 'object') {
          for (var i = 0; i < this.length; i++) {
            var conditions = [];
            for (var key in predicate) {
              conditions.push(predicate[key] === this[i][key]);
            }
            if (conditions.every(comparator)) {
              element = this[i];
              break;
            }
          }
        } else {
          for (var i = 0; i < this.length; i++) {
            if (predicate(this[i])) {
              element = this[i];
              break;
            }
          }
        }
        return result(element, callback);
      },
      mode: function(callback) {
        var map = {},
            count = 1,
            modes = new Collection();
        for (var i = 0; i < this.length; i++) {
          var e = this[i];
          if (map[e] == null) {
            map[e] = 1;
          }
          else {
            map[e]++;
          }
          if (map[e] > count) {
            modes = new Collection(e);
            count = map[e];
          } else if (map[e] == count) {
            modes.push(e);
            count = map[e];
          }
        }
        if (modes.length === 1) {
          modes = modes[0];
        }
        return result(modes, callback);
      },
      /**
       * Returns the number of occurrences of value within a data set.
       * @param element {Number or String}
       * @param callback {Function}
       */
      frequency: function(element, callback) {
        var freq = 0;
        if (this.indexOf(element) !== -1) {
          var buffer = this.copy().sort();
          freq = buffer.lastIndexOf(element) - buffer.indexOf(element) + 1;
        }
        return result(freq, callback);
      },
      /**
       * Returns an Object containing the (frequency) distribution of values within the Collection.
       * @param format {String} Override distribution format with Percent Distribution. Default: Raw count
       */
      distribution: function(format, callback) {
        var array = this.copy().sort(),
            distribution = {};
        for (var i = 0; i < array.length;) {
          distribution[array[i]] = (format === 'relative') ?
            array.frequency(array[i]) / array.length : array.frequency(array[i]);
          i = (array.lastIndexOf(array[i]) + 1);
        }
        return result(distribution, callback);
      },
      /**
       * Return Collection appended with Array (In place Array.concat).
       * @param that Array
       * @param callback Function
       */
      append: function(that, callback) {
        collection = this.push.apply(this, that);
        return result(this, callback);
      },
      /**
       * Predicates
       */
      /* Test for equality between two collections */
      equal: function(that, callback) {
        var equality = !(this < that || that < this);
        return result(equality, callback);
      },
      /* Returns a clone of the Collection object */
      clone: function(callback) {
        var object = Array.isArray(this) ? [] : {};
        for (var i in this) {
          if (i === 'clone') {
            continue;
          }
          if (this[i] && typeof this[i] === 'object') {
            object[i] = this[i].clone();
          } else {
            object[i] = this[i];
          }
        }
        return result(object, callback);
      },
      /* Returns a copy of the values in a Collection object */
      copy: function(callback) {
        var copy = new Collection(this.slice());
        return result(copy, callback);
      },
      /* Returns a vanilla Array of values */
      toArray: function(callback) {
        var array = Array.prototype.slice.call(this);
        return result(array, callback);
      },
      /**
       * [Accessor methods]
       */
      concat: function() {
        var args = Array.prototype.slice.call(arguments);
        var end = args[args.length - 1];
        if (typeof end === 'function') {
          if (typeof args[0] !== 'number') {
            return end(new Collection(this.toArray().concat(args[0])));
          }
          else {
            return end(new Collection(this.toArray().concat(args.slice(0, args.length - 1))));
          }
        }
        else if (typeof args[0] !== 'number') {
          return new Collection(this.toArray().concat(args[0]));
        }
        else {
          return new Collection(this.toArray().concat(args));
        }
      },
      slice: function(begin, end, callback) {
        var args = Array.prototype.slice.call(arguments);
        if (args.length === 3) {
          return callback(new Collection(this.toArray().slice(begin, end)));
        }
        else if (args.length === 2) {
          if (typeof args[1] === 'function') {
            return callback(new Collection(this.toArray().slice(begin)));
          }
          else {
            return new Collection(this.toArray().slice(begin, end));
          }
        }
        else if (args.length === 1) {
          return new Collection(this.toArray().slice(begin));
        }
        else {
          return new Collection(this.toArray().slice());
        }
      },
      split: function(predicate, callback) {
        var split = new Collection();
        split.push(this.toArray()
                   .filter(function(e) { return !predicate(e); }));
        split.push(this.toArray()
                   .filter(predicate));
        return result(split, callback);
      },
      unique: function(callback) {
        var array = this.copy().sort(),
            unique = new Collection();
        for (var i = 0; i < array.length;) {
          unique.push(array[i]);
          i = (array.lastIndexOf(array[i]) + 1);
        }
        return result(unique, callback);
      },
      /**
       * [Iteration methods]
       */
      filter: function(callback, next) {
        var filter = new Collection(this.toArray().filter(callback));
        return result(filter, next);
      },
      every: function(callback, next) {
        var every = this.toArray().every(callback);
        return result(every, next);
      },
      map: function(callback, next) {
        var map = new Collection(this.toArray().map(callback));
        return result(map, next);
      },
      some: function(callback, next) {
        var some = this.toArray().some(callback);
        return result(some, next);
      },
      reduce: function(callback, initialValue, next) {
        var args = Array.prototype.slice.call(arguments);
        if (args.length === 3) {
          return next(this.toArray().reduce(callback, initialValue));
        }
        else if (args.length === 2) {
          if (typeof args[1] === 'function') {
            return next(this.toArray().reduce(callback));
          }
          else {
            return this.toArray().reduce(callback, initialValue);
          }
        }
        else {
          return this.toArray().reduce(callback);
        }
      },
      reduceRight: function(callback, initialValue, next) {
        var args = Array.prototype.slice.call(arguments);
        if (args.length === 3) {
          return next(this.toArray().reduceRight(callback, initialValue));
        }
        else if (args.length === 2) {
          if (typeof args[1] === 'function') {
            return next(this.toArray().reduceRight(callback));
          }
          else {
            return this.toArray().reduceRight(callback, initialValue);
          }
        }
        else {
          return this.toArray().reduceRight(callback);
        }
      },
      union: function(that, callback) {
        var union = this.append(that).unique();
        return result(union, callback);
      }
    });

    return collection;
  };

  Array.prototype.toCollection = function() {
    return new Collection(this);
  };

  if (typeof window !== 'undefined') {
    window.gauss = (typeof window.gauss === 'undefined' ? {} : window.gauss);
    window.gauss.Collection = Collection;
  }
  else {
    exports = module.exports = Collection;
  }
})();
