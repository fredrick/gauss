#Gauss
> JavaScript statistics and analytics library - [Node.JS](http://nodejs.org/) ready

Evented, asynchronous, and fast, [Node.JS][1] is an attractive platform for data mining, statistics, and data analysis.
[Gauss](http://en.wikipedia.org/wiki/Carl_Friedrich_Gauss) makes it easy to calculate and explore data through JavaScript.

[1]: http://nodejs.org/

##License
MIT/X11 - See [LICENSE][2]

[2]: http://github.com/stackd/gauss/blob/master/LICENSE

##Getting started

###Install with NPM (Node Package Manager)

Getting started with Gauss + Node.JS is easy:

    $ npm install gauss

###Build for browser/embedded applications [Coming soon!]

Generates a minified gauss.js (Requires Java Runtime Environment to run Google's [Closure Compiler](http://code.google.com/closure/compiler/))

    $ git clone git://github.com/stackd/gauss.git
    $ cd gauss
    $ make

###Installing development dependencies and running tests

To run Gauss's tests you'll need [Vows](http://vowsjs.org/). NPM can automatically resolve this:

    $ npm install gauss --devel

You can then invoke the tests with either `node` or `vows`:

*Simple test run*

    $ node test/*

*Run tests and view specification (verbose)*

    $ vows test/* --spec

##API

Gauss has methods for univariate and time series analysis. We're constantly working on adding more functions, adding multivariate statistics, and we encourage additions to the library. Accuracy is a primary concern. If Gauss is returning incorrect results, [please submit an issue](https://github.com/stackd/gauss/issues) and/or [submit a patch](https://github.com/stackd/gauss#fork_box)!

###Instantiation

```javascript
    var gauss = require('gauss');
    // List of numbers
    var set = new gauss.Vector(5, 1, 3, 2, 21);
    // From an regular Array
    var numbers = new gauss.Vector([8, 6, 7, 5, 3, 0, 9]);
```

*Note: To prevent unintended scope polution, Gauss versions after 0.2.3 have [removed support for monkey patching](https://github.com/stackd/gauss/issues/6) the native Array datatype.
Use the .array() method of any Gauss object to a convert to a vanilla Array.*

###Callbacks and method chaining

All of Gauss's methods accept an *optional* [callback][3]:

[3]: http://en.wikipedia.org/wiki/Callback_(computer_programming)

```javascript
    set.min();
    set.min(function(result) {
        result / 2;
        /* Do more things with the minimum*/
    });
```

In addition, for methods that return another Vector, method chaining makes it easy to perform calculations that flow through each other:

```javascript
    set.quantile(4).stdev(); // Find the standard deviation of data set's quartiles
```

Finally, you can mix and match both callbacks and chaining:

```javascript
    set.quantile(4).stdev(function(stdev) {
        if (stdev > 1) {
            /* Do something awesome */
        }
    });
```

###Vector

**.min(callback)**

Returns the smallest number.

**.max(callback)**

Returns the largest number.

**.sum(callback)**

Returns the sum of the numbers.

**.product(callback)**

Returns the product of the numbers.

**.range(callback)**

Returns the difference between the largest and smallest value in a data set.

**.mean(callback)**

Returns the arithmetic mean.

**.gmean(callback)**

Returns the geometric mean.

**.hmean(callback)**

Returns the harmonic mean.

**.qmean(callback)**

Returns the quadratic mean (RMS - root mean square).

**.median(callback)**

Returns the median. If there are an even amount of numbers in the data set, returns the arithmetic mean of the two middle values.

**.mode(callback)**

Returns the value(s) that occur the most frequently in a data set. If there is a tie, returns an array of values.

**.variance(callback)**

Returns a measure of how far a set of numbers are spread out from each other.

**.stdev(percent, callback)**

Returns the standard deviation of data set. If a percent is given, returns the standard deviation with respect to a percentile of the population.

**.frequency(value, callback)**

Returns the number of occurrences of value within a data set.

**.percentile(value, callback)**

Returns the value that below which a certain percent of observations fall within the data set.

**.density(percent, callback)**

Returns a Vector which is a percentile subset of values occurring within a data set.

**.distribution(format, callback)**

Returns an `Object` containing the (frequency) distribution of values within the array. Default format: `absolute`; `relative` returns ratio of occurrences and total number of values in a data set. 

```javascript
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

**.quantile(quantity, callback)**

Returns a Vector of values that divide a frequency distribution into equal groups, each containing the same fraction of the total data set.

```javascript
    set.quantile(4); // Quartiles
```

**.sma(period, callback)**

Returns a Vector of the simple moving average (SMA); unweighted means of the previous n data points. `period` is the length of observation window for moving average.

```javascript
    var prices = [22.2734, 22.194, 22.0847, 22.1741, 22.184, 22.1344,
    22.2337, 22.4323, 22.2436, 22.2933, 22.1542, 22.3926,
    22.3816, 22.6109, 23.3558, 24.0519, 23.753, 23.8324,
    23.9516, 23.6338, 23.8225, 23.8722, 23.6537, 23.187,
    23.0976, 23.326, 22.6805, 23.0976, 22.4025, 22.1725];

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

**.ema(options, callback)**

Returns a Vector of the exponential moving average (EMA); weighted means of the previous n data points.
`options` is

- Number Length of the observation window for moving average, using the default smoothing ratio (2 / period + 1) **or**
- Object.period Length of the observation window for moving average
- Object.ratio Function returning a Number to be used as smoothing ratio

```javascript
    var prices = [22.2734, 22.194, 22.0847, 22.1741, 22.184, 22.1344,
    22.2337, 22.4323, 22.2436, 22.2933, 22.1542, 22.3926,
    22.3816, 22.6109, 23.3558, 24.0519, 23.753, 23.8324,
    23.9516, 23.6338, 23.8225, 23.8722, 23.6537, 23.187,
    23.0976, 23.326, 22.6805, 23.0976, 22.4025, 22.1725];

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

**.delta(callback)**

Returns a Vector of values containing the sequential difference between numbers in a sequence.

**.copy(callback)**

Returns a copy of the data set.

**.clone(callback)**

Returns another instance of the Vector object and data.

###Math

`Vector` supports applying all the [Math](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Math) object methods to an entire Vector set of numbers.

For example, applying `pow` primitive method on a set to calculate the quadratic mean

```javascript
    var squares = set.pow(2); // A Vector of set's members squared
    > [25, 1, 9, 4, 441]
    Math.sqrt(squares.sum() / squares.length); // Sum the squares -> find average -> quadratic mean (RMS)
    > 9.797958971132712
```

###TimeSeries

Perform time series analysis. TimeSeries currently accepts time in epoch miliseconds followed by a numeric value.

```javascript
    var gauss = require('gauss');
    var set = new gauss.TimeSeries([1315378833000, 3.5], [1315789015000, 7.826]);
```

**.times(callback)**

Returns a Vector of the times.

**.values(callback)**

Returns a Vector of the time series values.
