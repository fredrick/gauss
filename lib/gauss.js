/**
 * Gauss
 * https://github.com/wayoutmind/gauss
 * Copyright(c) 2013 Fredrick Galoso
 * LICENSE: MIT/X11
 */

var Collection = require('./collection'),
	Vector = require('./vector'),
    TimeSeries = require('./timeseries');

/**
 * Library version
 */

exports.version = '0.2.8';

/**
 * Expose constructors
 */

exports.Collection = Collection;
exports.Vector = Vector;
exports.TimeSeries = TimeSeries;
