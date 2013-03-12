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

    if (Array.prototype.slice.call(arguments).length === 0)
      collection = [];

    Object.defineProperties(collection, {
      'indexOf': {
        value: function(element, callback) {
          var index = -1;
          for (var i = 0; i < this.length; i++) {
            if (this[i] === element) {
              index = i;
              break;
            }
          }
          if (callback)
            return callback(index);
          else
            return index;
        },
        writable: true,
        enumerable: false
      },
      /**
       * Returns the first index of an element that matches a condition.
       * @param predicate {Function}
       * @param callback {Function}
       */
      'indexBy': {
        value: function(predicate, callback) {
          var index = -1;
          for (var i = 0; i < this.length; i++) {
            if (predicate(this[i])) {
              index = i;
              break;
            }
          }
          if (callback)
            return callback(index);
          else
            return index;
        },
        writable: true,
        enumerable: false
      },
      /**
       * Returns the indices of all elements that match a value.
       * @param predicate {Number or String}
       * @param callback {Function}
       */
      'indicesOf': {
        value: function(element, callback) {
          var start = this.indexOf(element),
              end = this.lastIndexOf(element),
              indices = new Collection();
          if (start === end)
            indices.push(start);
          else {
            for (var i = start; i <= end; i++) {
              if (this[i] === element)
                indices.push(i);
            }
          }
          if (callback)
            return callback(indices);
          else
            return indices;
        },
        writable: true,
        enumerable: false
      },
      /**
       * Returns all indices of an element that match a condition.
       * @param predicate {Function}
       * @param callback {Function}
       */
      'indicesBy': {
        value: function(predicate, callback) {
          var start = 0,
              end = this.length - 1,
              indices = new Collection();
          if (start === end)
            indices.push(start);
          else {
            for (var i = start; i <= end; i++) {
              if (predicate(this[i]))
                indices.push(i);
            }
          }
          if (callback)
            return callback(indices);
          else
            return indices;
        },
        writable: true,
        enumerable: false
      },
      /**
       * Returns the last index of an element that matches a condition.
       * @param predicate {Function}
       * @param callback {Function}
       */
      'lastIndexBy': {
        value: function(predicate, callback) {
          var index = -1;
          for (var i = this.length - 1; i >= 0; i--) {
            if (predicate(this[i])) {
              index = i;
              break;
            }
          }
          if (callback)
            return callback(index);
          else
            return index;
        },
        writable: true,
        enumerable: false
      },
      /**
       * Returns all the elements that match a condition.
       * @param predicate {Function or Object}
       * @param callback {Function}
       */
      'find': {
        value: function(predicate, callback) {
          var results = new Collection();
          if (typeof predicate === 'object') {
            for (var i = 0; i < this.length; i++) {
              var conditions = [];
              for (var key in predicate) {
                conditions.push(predicate[key] === this[i][key]);
              }
              if (conditions.every(function(e) { return e === true })) {
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
          if (callback)
            return callback(results);
          else
            return results;
        },
        writable: true,
        enumerable: false
      },
      /**
       * Returns the first element that matches a condition.
       * @param predicate {Function or Object}
       * @param callback {Function}
       */
      'findOne': {
        value: function(predicate, callback) {
          var result;
          if (typeof predicate === 'object') {
            for (var i = 0; i < this.length; i++) {
              var conditions = [];
              for (var key in predicate) {
                conditions.push(predicate[key] === this[i][key]);
              }
              if (conditions.every(function(e) { return e === true })) {
                result = this[i];
                break;
              }
            }
          } else {
            for (var i = 0; i < this.length; i++) {
              if (predicate(this[i])) {
                result = this[i];
                break;
              }
            }
          }
          if (callback)
            return callback(result);
          else
            return result;
        },
        writable: true,
        enumerable: false
      },
      'mode': {
        value: function(callback) {
          var map = {},
              count = 1,
              modes = new Collection();
          for (var i = 0; i < this.length; i++) {
            var e = this[i];
            if (map[e] == null)
              map[e] = 1;
            else
              map[e]++;
            if (map[e] > count) {
              modes = new Collection(e);
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
      /**
       * Returns the number of occurrences of value within a data set.
       * @param element {Number or String}
       * @param callback {Function}
       */
      'frequency': {
        value: function(element, callback) {
          var freq = 0;
          if (this.indexOf(element) !== -1) {
            var buffer = this.copy().sort();
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
      /**
       * Returns an Object containing the (frequency) distribution of values within the Collection.
       * @param format {String} Override distribution format with Percent Distribution. Default: Raw count
       */
      'distribution': {
        value: function(format, callback) {
          var array = this.copy().sort(),
              distribution = {};
          for (var i = 0; i < array.length;) {
            distribution[array[i]] = (format === 'relative') ?
            array.frequency(array[i]) / array.length : array.frequency(array[i]);
            i = (array.lastIndexOf(array[i]) + 1);
          }
          if (callback)
            return callback(distribution);
          else
            return distribution;
        },
        writable: true,
        enumerable: false
      },
      /**
       * Return Collection appended with Array (In place Array.concat).
       * @param that Array
       * @param callback Function
       */
      'append': {
        value: function(that, callback) {
          collection = this.push.apply(this, that);
          if (callback)
            return callback(collection);
          else
            return collection;
        },
        writable: true,
        enumerable: false
      },
      /**
       * Predicates
       */
      /* Test for equality between two collections */
      'equal': {
        value: function(that, callback) {
          var equality = !(this < that || that < this);
          if (callback)
            return callback(equality);
          else
            return equality;
        },
        writable: true,
        enumerable: false
      },
      /* Returns a clone of the Collection object */
      'clone': {
        value: function(callback) {
          var object = Array.isArray(this) ? [] : {};
          for (var i in this) {
            if (i === 'clone') continue;
            if (this[i] && typeof this[i] === 'object') {
              object[i] = this[i].clone();
            } else object[i] = this[i]
          }
          if (callback)
            return callback(object);
          else
            return object;
        },
        writable: true,
        enumerable: false
      },
      /* Returns a copy of the values in a Collection object */
      'copy': {
        value: function(callback) {
          var copy = new Collection(this.slice());
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
          var array = Array.prototype.slice.call(this);
          if (callback)
            return callback(array);
          else
            return array;
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
              return end(new Collection(this.toArray().concat(args[0])));
            else
              return end(new Collection(this.toArray().concat(args.slice(0, args.length - 1))));
          }
          else if (typeof args[0] !== 'number')
            return new Collection(this.toArray().concat(args[0]));
          else
            return new Collection(this.toArray().concat(args));
        },
        writable: true,
        enumerable: false
      },
      'slice': {
        value: function(begin, end, callback) {
          var args = Array.prototype.slice.call(arguments);
          if (args.length === 3)
            return callback(new Collection(this.toArray().slice(begin, end)));
          else if (args.length === 2) {
            if (typeof args[1] === 'function')
              return callback(new Collection(this.toArray().slice(begin)));
            else
              return new Collection(this.toArray().slice(begin, end));
          }
          else if (args.length === 1)
            return new Collection(this.toArray().slice(begin));
          else
            return new Collection(this.toArray().slice());
        },
        writable: true,
        enumerable: false
      },
      'split': {
        value : function(predicate, callback) {
          var split = new Collection();
          split.push(this.toArray()
            .filter(function(e) { return !predicate(e); }));
          split.push(this.toArray()
            .filter(predicate));
          if (callback)
            return callback(split);
          else
            return split;
        },
        writable: true,
        enumerable: false
      },
      'unique': {
        value: function(callback) {
          var array = this.copy().sort(),
              unique = [];
          for (var i = 0; i < array.length;) {
            unique.push(array[i]);
            i = (array.lastIndexOf(array[i]) + 1);
          }
          if (callback)
            return callback(unique);
          else
            return unique;
        },
        writable: true,
        enumerable: false
      },
      /**
       * [Iteration methods]
       */
      'filter': {
        value: function(callback, next) {
          var filter = new Collection(this.toArray().filter(callback));
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
          var every = this.toArray().every(callback);
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
          var map = new Collection(this.toArray().map(callback));
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
          var some = this.toArray().some(callback);
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
            return next(this.toArray().reduce(callback, initialValue));
          else if (args.length === 2) {
            if (typeof args[1] === 'function')
              return next(this.toArray().reduce(callback));
            else
              return this.toArray().reduce(callback, initialValue);
          }
          else
            return this.toArray().reduce(callback);
        },
        writable: true,
        enumerable: false
      },
      'reduceRight': {
        value: function(callback, initialValue, next) {
          var args = Array.prototype.slice.call(arguments);
          if (args.length === 3)
            return next(this.toArray().reduceRight(callback, initialValue));
          else if (args.length === 2) {
            if (typeof args[1] === 'function')
              return next(this.toArray().reduceRight(callback));
            else
              return this.toArray().reduceRight(callback, initialValue);
          }
          else
            return this.toArray().reduceRight(callback);
        },
        writable: true,
        enumerable: false
      },
      /**
       * Return a Collection extended with named functions.
       * @param methods Object { 'functionName': function() {} }
       */
      'extend': {
        value: function(methods, callback) {
          for (var method in methods) {
            Object.defineProperty(this, method, {
              value: methods[method],
              writable: true,
              enumerable: false
            });
          }
          if (callback)
            return callback(this);
          else
            return this;
        },
        writable: true,
        enumerable: false
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
  } else {
    exports = module.exports = Collection;
  }
})();
