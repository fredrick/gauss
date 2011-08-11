/**
 * Test Vector data structure and methods.
 */

var vows = require('vows'),
    assert = require('assert');

/**
 * Let's non-invasivly duck punch and extend
 * the Array type with some of gauss's goodies.
 */

Array = require('../lib/gauss').Vector;

var set = [10, 82, 67, 17, 36, 3, 1, 61, 33, 20,
18, 35, 15, 39, 52, 85, 17, 92, 88, 70,
66, 85, 93, 81, 70, 41, 40, 22, 38, 52,
86, 60, 64, 38, 87, 15, 92, 61, 93, 17,
38, 68, 11, 98, 62, 75, 94, 63, 49, 97];

var majority = [10, 82, 67, 17, 36, 3, 1, 61, 33, 20,
18, 35, 15, 39, 52, 85, 17, 92, 88, 70,
66, 85, 93, 81, 70, 41, 40, 22, 38, 52,
86, 60, 64, 38, 87, 15, 92, 61, 93, 17,
38, 68, 11, 98, 62, 75, 94, 63, 17];

vows.describe('Vector').addBatch({
    'Minimum': {
        topic: set.min(),
        '1': function(topic) {
            assert.equal(topic, 1);
        }
    },
    'Maximum': {
        topic: set.max(),
        '98': function(topic) {
            assert.equal(topic, 98);
        }
    },
    'Sum': {
        topic: set.sum(),
        '2697': function(topic) {
            assert.equal(topic, 2697);
        }
    },
    'Arithmetic Mean': {
        topic: set.mean(),
        '53.94': function(topic) {
            assert.equal(topic, 53.94);
        } 
    },
    'Median': {
        '(Even number of elements)': {
            topic: set.median(),
            '60.5, mean of the two middle numbers':
                function(topic) {
                    assert.equal(topic, 60.5);
                }
        },
        '(Odd number of elements)': {
            topic: function() {
                var odd = set.copy();
                odd.pop();
                return odd;
            },
            '60': function(topic) {
                assert.equal(topic.median(), 60);
            }
        }
    },
    'Mode': {
        '(Tie)': {
            topic: set.mode(),
            '[17, 38]': function(topic) {
                assert.deepEqual(topic, [17, 38]);
            }
        },
        '(Majority)': {
            topic: majority.mode(),
            '17': function(topic) {
                    assert.equal(topic, 17);
            }
        }
    },
    'Range': {
        topic: set.range(),
        '97': function(topic) {
            assert.equal(topic, 97);
        }  
    },
    'Variance': {
        topic: set.variance(),
        '843.9364': function(topic) {
            assert.equal(topic, 843.9364);
        }
    },
    'Standard Deviation': {
        '(Population)': {
            topic: set.stdev(),
            '29.050583470904677': function(topic) {
                assert.equal(topic, 29.050583470904677);
            }
        },
        '(Percentage - 95%)': {
            topic: set.stdev(.95),
            '28.226483574827384': function(topic) {
                assert.equal(topic, 28.226483574827384);
            }
        }
    },
    'Frequency': {
        topic: set.frequency(17),
        '3': function(topic) {
            assert.equal(topic, 3);
        }
    },
    'Percentile': {
        topic: set.percentile(.90),
        '92': function(topic) {
            assert.equal(topic, 92);
        }
    },
    'Density': {
        topic: set.density(.25),
        'Array of values (25% density)': function(topic) {
            assert.deepEqual(topic, [39, 40, 41, 49, 52, 52, 60, 61, 61, 62, 63, 64]);
        }
    },
    'Distribution': {
        '(Absolute Frequency)': {
            topic: set.distribution(),
            '{Element: Count}': function(topic) {
                assert.deepEqual(topic, {
                    1: 1, 3: 1, 10: 1, 11: 1, 15: 2,
                    17: 3, 18: 1, 20: 1, 22: 1, 33: 1,
                    35: 1, 36: 1, 38: 3, 39: 1, 40: 1,
                    41: 1, 49: 1, 52: 2, 60: 1, 61: 2,
                    62: 1, 63: 1, 64: 1, 66: 1, 67: 1,
                    68: 1, 70: 2, 75: 1, 81: 1, 82: 1,
                    85: 2, 86: 1, 87: 1, 88: 1, 92: 2,
                    93: 2, 94: 1, 97: 1, 98: 1
                });
            }
        },
        '(Relative Frequency)': {
            topic: set.distribution('relative'),
            '{Element: Ratio}': function(topic) {
                assert.deepEqual(topic, {
                    1: 0.02, 3: 0.02, 10: 0.02, 11: 0.02, 15: 0.04,
                    17: 0.06, 18: 0.02, 20: 0.02, 22: 0.02, 33: 0.02,
                    35: 0.02, 36: 0.02, 38: 0.06, 39: 0.02, 40: 0.02,
                    41: 0.02, 49: 0.02, 52: 0.04, 60: 0.02, 61: 0.04,
                    62: 0.02, 63: 0.02, 64: 0.02, 66: 0.02, 67: 0.02,
                    68: 0.02, 70: 0.04, 75: 0.02, 81: 0.02, 82: 0.02,
                    85: 0.04, 86: 0.02, 87: 0.02, 88: 0.02, 92: 0.04,
                    93: 0.04, 94: 0.02, 97: 0.02, 98: 0.02
                });
            }
        }
    },
    'Quantile': {
        '(Quartile: 4-quantiles)': {
            topic: set.quantile(4),
            '[ 33, 60, 82 ]': function(topic) {
                assert.deepEqual(topic, [ 33, 60, 82 ]);
            }
        },
        '(Decile: 10-quantiles)': {
            topic: set.quantile(10),
            '[15, 18, 36, 40, 60, 64, 70, 85, 92]': function(topic) {
                assert.deepEqual(topic, [
                    15, 18, 36, 40, 60,
                    64, 70, 85, 92
                ]);
            }
        }
    },
    'Copy': {
        topic: set.copy(),
        'Values === Parent Vector': function(topic) {
            assert.deepEqual(topic, set);
        }
    },
    'Clone': {
        topic: set.clone(),
        'Instance of Parent Vector': function(topic) {
            assert.instanceOf(topic, Array);
        }
    }
}).export(module);