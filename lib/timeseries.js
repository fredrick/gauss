/**
 * TimeSeries: Nested array
 * Facilitates analysis of time series
 * @author Fredrick Galoso
 */
 
function TimeSeries(times, values) {
    /**
     * Monkey patch allows for vector analysis on individual properties
     */
    Array = require('./vector').Vector;
    
    if (dates.length !== values.length)
        throw new RangeError('Mismatched Date and value array lengths');
    
    this.dates = times;
    this.values = values;
}

TimeSeries.prototype = {
    length: function(callback) {
        var length = this.values.length;
        if (callback)
            return callback(length);
        else
            return length;
    },
    start: function(callback) {
        var start = this.dates[0];
        if (callback)
            return callback(start);
        else
            return start;
    },
    end: function(callback) {
        var end = this.dates[this.length - 1];
        if (callback)
            return callback(end);
        else
            return end;
    },
    /**
     * Returns the amount of time from start to end in the series (ms)
     */
    elapsed: function(callback) {
        var duration = this.end().UTC() - this.start().UTC();
        if (callback)
            return callback(duration);
        else
            return duration;
    }
};

exports.TimeSeries = TimeSeries;