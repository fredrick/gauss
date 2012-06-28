/**
 * Collection: n-dimensional array/set
 * Extends upon the Array datatype for set operations.
 * @author Fredrick Galoso
 */

(function(gauss) {
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
          for (var i = 0; i < collection.length; i++) {
            if (collection[i] === element) {
              if (callback)
                return callback(i);
              else
                return i;
            }
          }
          if (callback)
            return callback(-1);
          else
            return -1;
        },
        writable: true,
        enumerable: false
      },
      'mode': {
        value: function(callback) {
          var map = {};
          var count = 1;
          var modes = new Collection();
          for (var i = 0; i < collection.length; i++) {
            var e = collection[i];
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
       * @param element {Number}
       * @param callback {Function}
       */
      'frequency': {
        value: function(element, callback) {
          var freq = 0;
          if (collection.indexOf(element) !== -1) {
            var buffer = collection.copy();
            buffer.sort();
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
          var buffer = collection.copy();
          buffer.sort();
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
      /**
       * Return Collection appended with Array (In place Array.concat).
       * @param that Array
       * @param callback Function
       */
      'append': {
        value: function(that, callback) {
          collection = collection.push.apply(collection, that);
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
          var equality = !(collection < that || that < collection);
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
          var object = Array.isArray(collection) ? [] : {};
          for (var i in collection) {
            if (i === 'clone') continue;
            if (collection[i] && typeof collection[i] === 'object') {
              object[i] = collection[i].clone();
            } else object[i] = collection[i]
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
          var copy = new Collection(collection.slice());
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
          var array = Array.prototype.slice.call(collection);
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
              return end(new Collection(collection.toArray().concat(args[0])));
            else
              return end(new Collection(collection.toArray().concat(args.slice(0, args.length - 1))));
          }
          else if (typeof args[0] !== 'number')
            return new Collection(collection.toArray().concat(args[0]));
          else
            return new Collection(collection.toArray().concat(args));
        },
        writable: true,
        enumerable: false
      },
      'slice': {
        value: function(begin, end, callback) {
          var args = Array.prototype.slice.call(arguments);
          if (args.length === 3)
            return callback(new Collection(collection.toArray().slice(begin, end)));
          else if (args.length === 2) {
            if (typeof args[1] === 'function')
              return callback(new Collection(collection.toArray().slice(begin)));
            else
              return new Collection(collection.toArray().slice(begin, end));
          }
          else if (args.length === 1)
            return new Collection(collection.toArray().slice(begin));
          else
            return new Collection(collection.toArray().slice());
        },
        writable: true,
        enumerable: false
      },
      /**
       * [Iteration methods]
       */
      'filter': {
        value: function(callback, next) {
          var filter = new Collection(collection.toArray().filter(callback));
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
          var every = collection.toArray().every(callback);
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
          var map = new Collection(collection.toArray().map(callback));
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
          var some = collection.toArray().some(callback);
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
            return next(collection.toArray().reduce(callback, initialValue));
          else if (args.length === 2) {
            if (typeof args[1] === 'function')
              return next(collection.toArray().reduce(callback));
            else
              return collection.toArray().reduce(callback, initialValue);
          }
          else
            return collection.toArray().reduce(callback);
        },
        writable: true,
        enumerable: false
      },
      'reduceRight': {
        value: function(callback, initialValue, next) {
          var args = Array.prototype.slice.call(arguments);
          if (args.length === 3)
            return next(collection.toArray().reduceRight(callback, initialValue));
          else if (args.length === 2) {
            if (typeof args[1] === 'function')
              return next(collection.toArray().reduceRight(callback));
            else
              return collection.toArray().reduceRight(callback, initialValue);
          }
          else
            return collection.toArray().reduceRight(callback);
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
            Object.defineProperty(collection, method, {
              value: function() {
                return methods[method].apply(collection, arguments);
              },
              writable: true,
              enumerable: false
            });
          }
          if (callback)
            return callback(collection);
          else
            return collection;
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
    window.gauss = (typeof window.gauss === 'undefined' ? gauss : window.gauss);
    window.gauss.Collection = Collection;
  } else {
    exports = module.exports = Collection;
  }
})({});
