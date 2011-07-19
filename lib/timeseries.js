/**
 * TimeSeries: Nested array
 * Facilitates common timeseries analysis tasks
 * @author Fredrick Galoso
 */
 
function TimeSeries(times, values) {
    Array = require('./vector').Vector;
    
    if (dates.length !== values.length)
        throw new RangeError('Mismatched Date and value array lengths');
    
    this.dates = times;
    this.values = values;
}

TimeSeries.prototype.length = function() {
    return this.values.length;
}

exports.TimeSeries = TimeSeries;