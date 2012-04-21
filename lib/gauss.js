/**
 * Gauss
 * Copyright(c) 2012 Fredrick Galoso
 * LICENSE: MIT/X11
 */

var Vector = require('./vector'),
    TimeSeries = require('./timeseries');

/**
 * Library version
 */

exports.version = require('../package').version;

/**
 * Expose constructors
 */

exports.Vector = Vector;
exports.TimeSeries = TimeSeries;
