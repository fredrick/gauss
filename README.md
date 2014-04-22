Gauss
=============
[![Build Status](https://travis-ci.org/wayoutmind/gauss.png?branch=master)](https://travis-ci.org/wayoutmind/gauss)
[![Dependency Status](https://gemnasium.com/wayoutmind/gauss.png)](https://gemnasium.com/wayoutmind/gauss)

> JavaScript statistics, analytics, and set library - [Node.js](http://nodejs.org/) and web browser ready

Evented, asynchronous, and fast, [Node.js][1] is an attractive platform for data mining, statistics, and data analysis.
[Gauss](http://en.wikipedia.org/wiki/Carl_Friedrich_Gauss) makes it [easy to calculate and explore data through JavaScript](http://fredrickgaloso.me/talks/gauss.html#9),
both on Node.js and within the web browser.

[1]: http://nodejs.org/

## License
MIT/X11 - See [LICENSE][2]

## Support
Mailing list - [Google Group](https://groups.google.com/forum/?pli=1#!forum/gaussjs)

[2]: http://github.com/wayoutmind/gauss/blob/master/LICENSE

## Getting started

### Install with NPM (Node Package Manager)

Getting started with Gauss + Node.js is easy:

    $ npm install gauss

``` javascript
var gauss = require('gauss');
```

### Using Gauss within a web browser

Gauss requires support for ECMAScript 5 `Object.defineProperty`. Compatibility is listed [here](http://kangax.github.com/es5-compat-table/). Download and include [gauss.min.js](https://raw.github.com/wayoutmind/gauss/master/gauss.min.js):

``` html
<script src="gauss.min.js" type="text/javascript"></script>
<script type="text/javascript" charset="utf-8">
    var Vector = gauss.Vector,
        TimeSeries = gauss.TimeSeries;
    var set = new gauss.Vector(5, 1, 3, 2, 21),
        numbers = new Vector([8, 6, 7, 5, 3, 0, 9]);
</script>
```

The [Bower](http://bower.io/) package manager can also be used to install Gauss:

    $ bower install gauss

Gauss is also [Asynchronous Module Definition](http://requirejs.org/docs/whyamd.html) compatible and
works with module loaders like [RequireJS](http://requirejs.org):

``` html
<script async src="gauss.min.js"></script>
<script>
    require(['gauss'], function(gauss) {
        var Collection = gauss.Collection,
            distribution = new Collection(1, 2, 3).distribution();
    });
</script>
```

### Installing development dependencies and running tests

To run Gauss's tests you'll need [Vows](http://vowsjs.org/). NPM can automatically resolve this:

    $ npm install gauss --devel

To invoke the tests:

    $ npm test

## API

### Instantiation

``` javascript
// List of numbers
var set = new gauss.Vector(5, 1, 3, 2, 21);
// From a regular Array
var numbers = new gauss.Vector([8, 6, 7, 5, 3, 0, 9]);
// After instantiation, Gauss objects can be conveniently used like any Array
numbers[0] = 2;
set[1] = 7;
```

*Note: To prevent unintended scope/prototype pollution, Gauss versions after 0.2.3 have [removed support for monkey patching](https://github.com/wayoutmind/gauss/issues/6) the native Array data type.
Use the .toArray() method of any Gauss object to a convert to a vanilla Array.*

### Scope chaining

Gauss collections utilize scope chaining for converting between collection types:

``` javascript
var Collection = gauss.Collection;
var things = new Collection(
    { type: 1, age: 1 },
    { type: 2, age: 2 },
    { type: 1, age: 3 },
    { type: 2, age: 4 });
things
    .find({ type: 2 })
    .map(function(thing) { return thing.age; })
    .toVector() // Scope chained converter, converting mapped collection of ages to Vector
    .sum();
```

### Callbacks and method chaining

All of Gauss's methods accept an *optional* [callback][3]:

[3]: http://en.wikipedia.org/wiki/Callback_(computer_programming)

``` javascript
set.min();
set.min(function(result) {
    result / 2;
    /* Do more things with the minimum*/
});
```

In addition, for methods that return another Vector, method chaining makes it easy to perform calculations that flow through each other:

``` javascript
set.quantile(4).stdev(); // Find the standard deviation of data set's quartiles
```

Finally, you can mix and match both callbacks and chaining:

``` javascript
set.quantile(4).stdev(function(stdev) {
    if (stdev > 1) {
        /* Do something awesome */
    }
});
```

### Collection

#### Collection.indexBy

    .indexBy(predicate, callback)

Returns the first index of an element that matches a condition.

#### Collection.indicesOf

    .indicesOf(element, callback)

Returns the indices of all elements that match a value.

#### Collection.indicesBy

    .indicesBy(predicate, callback)

Returns all indices of an element that match a condition.

#### Collection.lastIndexBy

    .lastIndexBy(predicate, callback)

Returns the last index of an element that matches a condition.

#### Collection.find

    .find(predicate, callback)

Returns all the elements that match a condition.

``` javascript
var people = new gauss.Collection(
  { firstname: 'John', lastname: 'Smith' },
  { firstname: 'Jane', lastname: 'Doe' },
  { firstname: 'Mike', lastname: 'Smith' },
  { firstname: 'Susan', lastname: 'Baker' }
);
// Using a predicate Function
people.find(function(e) { return e.firstname === 'Jane' });
> [{ firstname: 'Jane', lastname: 'Doe' }]
// Using a condition Object
people.find({ lastname: 'Smith' });
> [{ firstname: 'John', lastname: 'Smith' },
  { firstname: 'Mike', lastname: 'Smith' }]
```

#### Collection.findOne

    .findOne(predicate, callback)

Returns the first element that matches a condition.

``` javascript
// Using a predicate Function
people.findOne(function(e) { return e.firstname === 'Jane' });
> { firstname: 'Jane', lastname: 'Doe' }
// Using a condition Object
people.findOne({ lastname: 'Smith' });
> { firstname: 'John', lastname: 'Smith' }
```

#### Collection.split

    .split(predicate[, callback])

Returns a Collection split by a condition (binomial cluster).

``` javascript
Collection(1, 2, 3, 4).split(function(e) { return e % 2 === 0 });
> [[1, 3], [2, 4]]
```

#### Collection.mode

    .mode(callback)

Returns the value(s) that occur the most frequently in a data set. If there is a tie, returns a Collection of values.

#### Collection.frequency

    .frequency(element, callback)

Returns the number of occurrences of value within a data set.

#### Collection.distribution

    .distribution(format, callback)

Returns an `Object` containing the (frequency) distribution of values within the Collection. Default format: `absolute`; `relative` returns ratio of occurrences and total number of values in a data set.

``` javascript
set.distribution();
> {
    1: 1,
    2: 1,
    3: 1,
    5: 1,
    21: 1
  }
set.distribution('relative');
> {
    1: 0.2,
    2: 0.2,
    3: 0.2,
    5: 0.2,
    21: 0.2
  }
```

#### Collection.append

    .append(that, callback)

Return Collection appended with an Array.

``` javascript
var numbers = new Collection(1, 2, 3).append([1, 2, 3]);
> [1, 2, 3, 1, 2, 3]
```

#### Collection.unique

    .unique(callback)

Return a Collection with unique values.

``` javascript
var numbers = new Collection(1, 2, 3, 3, 4, 4).unique();
> [1, 2, 3, 4]
```

#### Collection.union

    .union(array, callback)

Return the union of a Collection with another array.

``` javascript
var union = new Collection('a', 'b', 'c').union(['c', 'd', 'e']);
> ['a', 'b', 'c', 'd', 'e']
```

#### Collection.extend

    .extend(methods, callback)

Returns a Collection extended with named functions.

### Vector

Extends *Collection* methods with numerical functions.

#### Vector.min

    .min(callback)

Returns the smallest number.

#### Vector.max

    .max(callback)

Returns the largest number.

#### Vector.equal

    .equal(that)

Returns `true` or `false` if Vector values are equal to another Vector or Array.

#### Vector.sum

    .sum(callback)

Returns the sum of the numbers.

#### Vector.product

    .product(callback)

Returns the product of the numbers.

#### Vector.push

    .push(number1, ..., numberN, callback)

Returns the updated Vector with one or more elements appended to the end; performs/maintains streaming calculations.

``` javascript
var Vector = require('gauss').Vector,
    digits = new Vector();
// Push some numbers in
digits.push(1, 2, 3);
> 3
digits.sum();
> 6
// Keep on pushing; sum is updated as numbers are pushed
 digits.push(4, 5, 6);
> 6
```
*Note: Streaming calculations like sum(), product(), variance(), and functions dependent on streaming capable functions benefit from O(1) amortized performance.*

#### Vector.range

    .range(callback)

Returns the difference between the largest and smallest value in a data set.

#### Vector.mean

    .mean(callback)

Returns the arithmetic mean.

#### Vector.gmean

    .gmean(callback)

Returns the geometric mean.

#### Vector.hmean

    .hmean(callback)

Returns the harmonic mean.

#### Vector.qmean

    .qmean(callback)

Returns the quadratic mean (RMS, root mean square).

#### Vector.pmean

    .pmean(p, callback)

Returns the power/generalized mean given an order or power *p*.

```javascript
// p = -1, harmonic mean
set.pmean(-1);
// p = 1, arithmetic mean
set.pmean(1);
// p = 2, quadratic mean
set.pmean(2);
```

#### Vector.median

    .median(callback)

Returns the median. If there are an even amount of numbers in the data set, returns the arithmetic mean of the two middle values.

#### Vector.mode

    .mode(callback)

Returns the value(s) that occur the most frequently in a data set. If there is a tie, returns a Vector of values.

#### Vector.variance

    .variance(callback)

Returns a measure of how far a set of numbers are spread out from each other.

#### Vector.stdev

    .stdev(percent, callback)

Returns the standard deviation of data set. If a percent is given, returns the standard deviation with respect to a percentile of the population.

#### Vector.frequency

    .frequency(value, callback)

Returns the number of occurrences of value within a data set.

#### Vector.percentile

    .percentile(value, callback)

Returns the value that below which a certain percent of observations fall within the data set.

#### Vector.density

    .density(percent, callback)

Returns a Vector which is a percentile subset of values occurring within a data set.

#### Vector.distribution

    .distribution(format, callback)

Returns an `Object` containing the (frequency) distribution of values within the Vector. Default format: `absolute`; `relative` returns ratio of occurrences and total number of values in a data set.

``` javascript
set.distribution();
> {
    1: 1,
    2: 1,
    3: 1,
    5: 1,
    21: 1
  }
set.distribution('relative');
> {
    1: 0.2,
    2: 0.2,
    3: 0.2,
    5: 0.2,
    21: 0.2
  }
```

#### Vector.quantile

    .quantile(quantity, callback)

Returns a Vector of values that divide a frequency distribution into equal groups, each containing the same fraction of the total data set.

``` javascript
set.quantile(4); // Quartiles
```

#### Vector.sma

    .sma(period, callback)

Returns a Vector of the simple moving average (SMA); unweighted means of the previous n data points. `period` is the length of observation window for moving average.

``` javascript
var prices = [22.2734, 22.194, 22.0847, 22.1741, 22.184, 22.1344,
22.2337, 22.4323, 22.2436, 22.2933, 22.1542, 22.3926,
22.3816, 22.6109, 23.3558, 24.0519, 23.753, 23.8324,
23.9516, 23.6338, 23.8225, 23.8722, 23.6537, 23.187,
23.0976, 23.326, 22.6805, 23.0976, 22.4025, 22.1725];

prices = prices.toVector();

// 10-period SMA
prices.sma(10);
> [ 22.22475, 22.21283, 22.232689999999998,
    22.26238, 22.30606, 22.42324,
    22.61499, 22.76692, 22.90693,
    23.07773, 23.211779999999997, 23.37861,
    23.52657, 23.653779999999998, 23.711389999999998,
    23.68557, 23.61298, 23.50573,
    23.43225, 23.27734, 23.13121
  ]
```

#### Vector.ema

    .ema(options, callback)

Returns a Vector of the exponential moving average (EMA); weighted means of the previous n data points.
`options` is

- Number Length of the observation window for moving average, using the default smoothing ratio (2 / period + 1) **or**
- Object.period Length of the observation window for moving average
- Object.ratio Function returning a Number to be used as smoothing ratio

``` javascript
// 10-period EMA
prices.ema(10);
> [ 22.22475, 22.21192272727273, 22.24477314049587,
    22.269650751314803, 22.331696069257568, 22.51789678393801,
    22.796806459585646, 22.970659830570074, 23.127339861375514,
    23.27720534112542, 23.34204073364807, 23.429396963893875,
    23.509906606822263, 23.536050860127308, 23.47258706737689,
    23.40440760058109, 23.390151673202713, 23.261124096256765,
    23.231392442391897, 23.080684725593372, 22.91556023003094
  ]

// 10-period Welles Wilder EMA
prices.ema({
    period: 10,
    ratio: function(n) { return 1 / n; }
});
> [ 22.22475, 22.217695, 22.2351855,
    22.24982695, 22.285934255, 22.3929208295,
    22.55881874655, 22.678236871895, 22.793653184705498,
    22.90944786623495, 22.981883079611453, 23.065944771650308,
    23.146570294485276, 23.19728326503675, 23.196254938533073,
    23.186389444679765, 23.20035050021179, 23.14836545019061,
    23.14328890517155, 23.069210014654395, 22.979539013188955
  ]
```

#### Vector.delta

    .delta(callback)

Returns a Vector of values containing the sequential difference between numbers in a sequence.

#### Vector.add

    .add(other, callback)

Returns a new vector which is the result of adding the input, element-wise to existing vector.
Takes input of a Array of same length as the existing Vector, or a scalar.

``` javascript
var a = new Vector(1,2);
var b = new Vector(3,4);
a.add(b)
> [4,6]
a.add(10)
> [11,13]
```

#### Vector.subtract

    .subtract(other, callback)

Returns a new vector which is the result of subtracting the input, element-wise from the existing vector.
Takes input of a Array of same length as the existing Vector, or a scalar.

#### Vector.multiply

    .multiply(other, callback)

Returns a new vector which is the result of element-wise multiplying the existing vector by the input.
Takes input of a Array of same length as the existing Vector, or a scalar.

#### Vector.divide

    .divide(other, callback)

Returns a new vector which is the result of element-wise dividing the existing vector by the input.
Takes input of a Array of same length as the existing Vector, or a scalar.

#### Vector.extend

    .extend(methods, callback)

Returns a Vector extended with named functions.

Within the function body, `this` is attached to the Vector being extended and the function may take zero or more arguments.
To maintain chainability, return `this`.

``` javascript
// Instantiate a new Vector with extensions
var set = new Vector(14, 6, 9, 3, 18,
    7, 11, 1, 2, 20,
    12, 16, 8, 4, 5,
    19, 15, 17, 10, 13
).extend({
    head: function() {
        return this[0];
    },
    tail: function() {
        return this.slice(1);
    }
});
set.head()
> 14
set.tail()
> [ 6, 9, 3, 18,
    7, 11, 1, 2, 20,
    12, 16, 8, 4, 5,
    19, 15, 17, 10, 13
  ]
// Extend instantiated objects
set.extend({
    // Distribution of deltas
    ddist: function(format) {
        return this.delta().distribution(format);
    }
});
set.ddist('relative')
> {
    '1': 0.10526315789473684,
    '2': 0.05263157894736842,
    '3': 0.10526315789473684,
    '4': 0.10526315789473684,
    '14': 0.05263157894736842,
    '15': 0.05263157894736842,
    '18': 0.05263157894736842,
    '-11': 0.05263157894736842,
    '-10': 0.05263157894736842,
    '-8': 0.15789473684210525,
    '-7': 0.05263157894736842,
    '-6': 0.05263157894736842,
    '-4': 0.10526315789473684
  }
```

#### Vector.copy

    .copy(callback)

Returns a copy of the data set.

#### Vector.clone

    .clone(callback)

Returns another instance of the Vector object and data.

### Sample

By default, `Vector` calculates values against the population `n`. However, sample statistics functions on `n - 1` are available by using the `sample` modifier for the following functions:

``` javascript
Vector().sample
{ mean: [Function],
  gmean: [Function],
  hmean: [Function],
  qmean: [Function],
  pmean: [Function],
  variance: [Function],
  stdev: [Function] }
```

### Math

`Vector` supports applying all the [Math](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Math#Methods) object methods to an entire Vector set of numbers.

For example, applying `pow` primitive method on a set to calculate the quadratic mean

``` javascript
var squares = set.pow(2); // A Vector of set's members squared
> [25, 1, 9, 4, 441]
Math.sqrt(squares.sum() / squares.length); // Sum the squares -> find average -> quadratic mean (RMS)
> 9.797958971132712
```

### TimeSeries

*Deprecated*

Perform time series analysis. TimeSeries currently accepts time in epoch milliseconds followed by a numeric value.

``` javascript
var gauss = require('gauss');
var set = new gauss.TimeSeries([1315378833000, 3.5], [1315789015000, 7.826]);
```

#### TimeSeries.times

    .times(callback)

Returns a Vector of the times.

#### TimeSeries.values

    .values(callback)

Returns a Vector of the time series values.

### Using the REPL console

To experiment with Gauss or to quickly start a Node.js command-line environment for number crunching, Gauss ships with a lightweight REPL (Read–eval–print loop). Start the REPL with `npm start` within the source directory, or `gauss` if installed globally (via `npm install -g gauss`).

For example, using the `help()` function and analyzing a data file from the Gauss REPL:

``` javascript
$ gauss
gauss> help()
Gauss 0.2.12
   /* https://github.com/wayoutmind/gauss#api */
   Functions: print, inspect, cwd, clear, install, uninstall, help
   Usage:
     var set = new Vector(1, 2, 3);
     var times = new gauss.TimeSeries();
{ version: '0.2.10',
  Collection: [Function],
  Vector: [Function],
  TimeSeries: [Function] }
gauss> var fs = require('fs');
gauss> var data = fs.readFileSync('data.txt').toString();
gauss> data = data.split('\n');
[ '8',
  '6',
  '7',
  '5',
  '3',
  '0',
  '9' ]
gauss> data = data.map(function(line) { return parseInt(line) });
gauss> var set = new Vector(data);
gauss> set.mean()
5.428571428571429
```
