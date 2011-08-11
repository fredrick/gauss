/**
 * Test TimeSeries object and methods.
 */

var TimeSeries = require('../lib/gauss').TimeSeries;

var series = new TimeSeries(['a', 2], ['b', 4]);
console.log(series.times());