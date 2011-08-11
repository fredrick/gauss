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

###Build for browser/embedded applications

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

For now Gauss only has methods for univariate analysis. We're constantly working on adding more functions, adding multivariate statistics, and we encourage additions to the library. Accuracy is a primary concern. If Gauss is returning incorrect results, [please submit an issue](https://github.com/stackd/gauss/issues) and/or [submit a patch](https://github.com/stackd/gauss#fork_box)!

###Instantiation

Conventional:

    var gauss = require('gauss');
    var set = new gauss.Vector(5, 1, 3, 2, 21);

Monkey patch:

    Array = require('gauss').Vector;
    var set = [5, 1, 3, 2, 21];

###Callbacks and method chaining

All of Gauss's methods accept an *optional* [callback][3]:

[3]: http://en.wikipedia.org/wiki/Callback_(computer_programming)

    set.min();
    set.min(function(result) {
        result / 2;
        /* Do more things with the minimum*/
    });

In addition, for methods that return another Vector, method chaining makes it easy to perform calculations that flow through each other:

    set.quantile(4).stdev(); // Find the standard deviation of data set's quartiles

Finally, you can mix and match both callbacks and chaining:

    set.quantile(4).stdev(function(stdev) {
        if (stdev > 1) {
            /* Do something awesome */
        }
    });

###Methods

**.min(callback)**

Returns the smallest number.

**.max(callback)**

Returns the largest number.

**.sum(callback)**

Returns the sum of the numbers.

**.range(callback)**

Returns the difference between the largest and smallest value in a data set.

**.mean(callback)**

Returns the arithmetic mean.

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

Returns an array which is a percentile subset of values occurring within a data set.

**.distribution(format, callback)**

Returns an `Object` containing the (frequency) distribution of values within the array. Default format: `absolute`; `relative` returns ratio of occurrences and total number of values in a data set. 

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

**.quantile(quantity, callback)**

Returns an array of values that divide a frequency distribution into equal groups, each containing the same fraction of the total data set.

    set.quantile(4); // Quartiles

**.copy(callback)**

Returns a copy of the data set.

**.clone(callback)**

Returns another instance of the Vector object and data.
