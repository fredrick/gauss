/**
 * Test Vector data structure and methods.
 */

var vows = require('vows'),
    assert = require('assert');

var Vector = require('../lib/gauss').Vector;

var set = new Vector([10, 82, 67, 17, 36, 3, 1, 61, 33, 20,
18, 35, 15, 39, 52, 85, 17, 92, 88, 70,
66, 85, 93, 81, 70, 41, 40, 22, 38, 52,
86, 60, 64, 38, 87, 15, 92, 61, 93, 17,
38, 68, 11, 98, 62, 75, 94, 63, 49, 97]);

var majority = new Vector([10, 82, 67, 17, 36, 3, 1, 61, 33, 20,
18, 35, 15, 39, 52, 85, 17, 92, 88, 70,
66, 85, 93, 81, 70, 41, 40, 22, 38, 52,
86, 60, 64, 38, 87, 15, 92, 61, 93, 17,
38, 68, 11, 98, 62, 75, 94, 63, 17]);

var heterogeneous = new Vector([72, -15, -50, 19, -33, -2, 60, -28, -13, -2,
17, -20, 24, 13, 33, -68, 75, -4, -18, -4,
19, 8, -12, -11, -29, -1, -18, 16, 14, 34,
-26, 4, -26, 49, -72, 77, -31, 32, -76, 21,
30, -57, 87, -36, 13, 19, -31, -14, 48]);

var prices = new Vector([22.2734, 22.194, 22.0847, 22.1741, 22.184, 22.1344,
22.2337, 22.4323, 22.2436, 22.2933, 22.1542, 22.3926,
22.3816, 22.6109, 23.3558, 24.0519, 23.753, 23.8324,
23.9516, 23.6338, 23.8225, 23.8722, 23.6537, 23.187,
23.0976, 23.326, 22.6805, 23.0976, 22.4025, 22.1725]);

function deepEqualWithNaN(actual, expected) {
  if (actual.length !== expected.length) {
    throw new RangeError();
  }
  else {
    for (var i = 0; i < expected.length; i++) {
      assert.deepEqual(isNaN(actual[i]) ? true : actual[i], isNaN(expected[i]) ? true : expected[i]);
    }
  }
}

vows.describe('Vector').addBatch({
  // Statistical methods
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
  'Product': {
    topic: set.product(),
    '7.120776302117291e+80': function(topic) {
      assert.equal(topic, 7.120776302117291e+80);
    }
  },
  'Arithmetic Mean': {
    topic: set.mean(),
    '53.94': function(topic) {
      assert.equal(topic, 53.94);
    }
  },
  'Geometric Mean': {
    topic: set.gmean(),
    '41.40478623971778': function(topic) {
      assert.equal(topic, 41.40478623971778);
    }
  },
  'Harmonic Mean': {
    topic: set.hmean(),
    '19.0456068931919': function(topic) {
      assert.equal(topic, 19.0456068931919);
    }
  },
  'Quadratic Mean': {
    topic: set.qmean(),
    '61.26548783777046': function(topic) {
      assert.equal(topic, 61.26548783777046);
    }
  },
  'Power Mean': {
    topic: set,
    'p = -1, harmonic mean': function(topic) {
      assert.equal(topic.pmean(-1), topic.hmean());
    },
    'p = 1, arithmetic mean': function(topic) {
      assert.equal(topic.pmean(1), topic.mean());
    },
    'p = 2, quadratic mean': function(topic) {
      assert.equal(topic.pmean(2), topic.qmean());
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
      topic: set.mode().toArray(),
      '[17, 38]': function(topic) {
        assert.deepEqual(topic, [17, 38]);
      }
    },
    '(Majority)': {
      topic: majority.mode(),
      '17': function(topic) {
          assert.equal(topic, 17);
      }
    },
    '(Uniform)': {
      topic: new Vector([1, 2, 3, 4]).mode().toArray(),
      '[1, 2, 3, 4]': function(topic) {
        assert.deepEqual(topic, [1, 2, 3, 4]);
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
    '93': function(topic) {
      assert.equal(topic, 93);
    }
  },
  'Density': {
    topic: set.density(.25).toArray(),
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
      topic: set.quantile(4).toArray(),
      '[ 33, 60, 82 ]': function(topic) {
        assert.deepEqual(topic, [ 33, 60, 82 ]);
      }
    },
    '(Decile: 10-quantiles)': {
      topic: set.quantile(10).toArray(),
      '[15, 18, 36, 40, 60, 64, 70, 85, 92]': function(topic) {
        assert.deepEqual(topic, [
          15, 18, 36, 40, 60,
          64, 70, 85, 92
        ]);
      }
    }
  },
  'Delta': {
    topic: set.delta().toArray(),
    'Sequential differences': function(topic) {
      assert.deepEqual(topic, [
        72, -15, -50, 19, -33, -2, 60, -28, -13, -2,
        17, -20, 24, 13, 33, -68, 75, -4, -18, -4,
        19, 8, -12, -11, -29, -1, -18, 16, 14, 34,
        -26, 4, -26, 49, -72, 77, -31, 32, -76, 21,
        30, -57, 87, -36, 13, 19, -31, -14, 48
      ]);
    }
  },
  'Simple Moving Average': {
    '(10)': {
      topic: prices.sma(10).toArray(),
      '10-period SMA': function(topic) {
        assert.deepEqual(topic, [
          22.22475, 22.21283, 22.232689999999998,
          22.26238, 22.30606, 22.42324,
          22.61499, 22.76692, 22.90693,
          23.07773, 23.211779999999997, 23.37861,
          23.52657, 23.653779999999998, 23.711389999999998,
          23.68557, 23.61298, 23.50573,
          23.43225, 23.27734, 23.13121
        ]);
      }
    },
    '(1)': {
      topic: prices.sma(1),
      'Single-period SMA': function(topic) {
        assert.deepEqual(topic, prices);
      }
    }
  },
  'Exponential Moving Average': {
    '(1)': {
      topic: prices.ema(1).toArray(),
      'Single-period EMA': function(topic) {
        assert.deepEqual(topic, prices.toArray());
      }
    },
    '(10)': {
      topic: prices.ema(10).toArray(),
      '10-period EMA': function(topic) {
        assert.deepEqual(topic, [
          22.22475, 22.21192272727273, 22.24477314049587,
          22.269650751314803, 22.331696069257568, 22.51789678393801,
          22.796806459585646, 22.970659830570074, 23.127339861375514,
          23.27720534112542, 23.34204073364807, 23.429396963893875,
          23.509906606822263, 23.536050860127308, 23.47258706737689,
          23.40440760058109, 23.390151673202713, 23.261124096256765,
          23.231392442391897, 23.080684725593372, 22.91556023003094
        ]);
      }
    },
    '(10 Wilder)': {
      topic: prices.ema({ period: 10, ratio: function(n) { return 1 / n; } }).toArray(),
      '10-period Welles Wilder EMA': function(topic) {
        assert.deepEqual(topic, [
          22.22475, 22.217695, 22.2351855,
          22.24982695, 22.285934255, 22.3929208295,
          22.55881874655, 22.678236871895, 22.793653184705498,
          22.90944786623495, 22.981883079611453, 23.065944771650308,
          23.146570294485276, 23.19728326503675, 23.196254938533073,
          23.186389444679765, 23.20035050021179, 23.14836545019061,
          23.14328890517155, 23.069210014654395, 22.979539013188955
        ]);
      }
    }
  },
  'Sample': {
    '(Arithmetic Mean)': {
      topic: set.sample.mean(),
      '55.04081632653061': function(topic) {
        assert.equal(topic, (set.mean() * set.length) / (set.length - 1));
      }
    },
    '(Geometric Mean)': {
      topic: set.sample.gmean(),
      '44.67366451004403': function(topic) {
        assert.equal(topic, 44.67366451004403);
      }
    },
    '(Harmonic Mean)': {
      topic: set.sample.hmean(),
      '18.66469475532806': function(topic) {
        assert.equal(topic, 18.66469475532806);
      }
    },
    '(Quadratic Mean)': {
      topic: set.sample.qmean(),
      '61.88748843255635': function(topic) {
        assert.equal(topic, 61.88748843255635);
      }
    },
    '(Power Mean)': {
      topic: set.sample.pmean(1),
      '55.04081632653061': function(topic) {
        assert.equal(topic, set.sample.mean());
      }
    },
    '(Variance)': {
      topic: set.sample.variance(),
      '861.1595918367346': function(topic) {
        assert.equal(topic, 861.1595918367346);
      }
    },
    '(Standard Deviation)': {
      topic: set.sample.stdev(),
      '29.34552081386075': function(topic) {
        assert.equal(topic, 29.34552081386075);
      }
    }
  },
  // Math methods
  'Math': {
    topic: (function() {
      return new Vector(-10, 82, 67.1, 17.3, 36, 3.5, 1, 61, 33, 20);
    })(),
    'max': function(topic) {
      assert.deepEqual(topic.max(), 82);
    },
    'min': function(topic) {
      assert.equal(topic.min(), -10);
    },
    'abs': function(topic) {
      assert.deepEqual(topic.abs(), new Vector(10, 82, 67.1, 17.3, 36, 3.5, 1, 61, 33, 20));
    },
    'acos': function(topic) {
      deepEqualWithNaN(topic.acos(), topic.map(Math.acos));
    },
    'asin': function(topic) {
      deepEqualWithNaN(topic.asin(), topic.map(Math.asin));
    },
    'atan': function(topic) {
      deepEqualWithNaN(topic.atan(), topic.map(Math.atan));
    },
    'ceil': function(topic) {
      assert.deepEqual(topic.ceil(), topic.map(Math.ceil));
    },
    'cos': function(topic) {
      assert.deepEqual(topic.cos(), topic.map(Math.cos));
    },
    'exp': function(topic) {
      assert.deepEqual(topic.exp(), topic.map(Math.exp));
    },
    'floor': function(topic) {
      assert.deepEqual(topic.floor(), topic.map(Math.floor));
    },
    'log': function(topic) {
      deepEqualWithNaN(topic.log(), topic.map(Math.log));
    },
    'pow': function(topic) {
      assert.deepEqual(topic.pow(2), topic.map(function(x) { return Math.pow(x, 2); }));
    },
    'round': function(topic) {
      assert.deepEqual(topic.round(), topic.map(Math.round));
    },
    'sin': function(topic) {
      assert.deepEqual(topic.sin(), topic.map(Math.sin));
    },
    'sqrt': function(topic) {
      deepEqualWithNaN(topic.sqrt(), topic.map(Math.sqrt));
    },
    'tan': function(topic) {
      assert.deepEqual(topic.tan(), topic.map(Math.tan));
    }
  },
  // Binary methods
  'Add': {
    topic: (function() {
        return new Vector(-2, 2, 3.1);
    })(),
    'add vector': function(topic) {
        assert.deepEqual(topic.add([1, 2, 3]), new Vector([-1, 4, 6.1]));
    },
    'add scalar': function(topic) {
        assert.deepEqual(topic.add(2), new Vector([0, 4, 5.1]));
    },
    'fail on adding different lengths': function(topic) {
        assert.throws(function () {topic.add([1, 2]);}, RangeError);
    }
  },
  'Subtract': {
    topic: (function() {
      return new Vector(-2, 2, 3.1);
    })(),
    'subtract vector': function(topic) {
      assert.deepEqual(topic.subtract([1, 2, 2]), new Vector([-3, 0, 1.1]));
    },
    'subtract scalar': function(topic) {
      assert.deepEqual(topic.subtract(2), new Vector([-4, 0, 1.1]));
    },
    'fail on subtracting different lengths': function(topic) {
      assert.throws(function () {topic.subtract([1, 2]);}, RangeError);
    }
  },
  'Multiply': {
    topic: (function() {
      return new Vector(-2, 2, 3.1);
    })(),
    'multiply vector': function(topic) {
      assert.deepEqual(topic.multiply([1, 2, 2]), new Vector([-2, 4, 6.2]));
    },
    'multiply scalar': function(topic) {
      assert.deepEqual(topic.multiply(2), new Vector([-4, 4, 6.2]));
    },
    'fail on multiply different lengths': function(topic) {
      assert.throws(function () {topic.multiply([1, 2]);}, RangeError);
    }
  },
  'Divide': {
    topic: (function() {
      return new Vector(-2, 2, 3.0);
    })(),
    'divide vector': function(topic) {
      assert.deepEqual(topic.divide([1, 2, 2]), new Vector([-2, 1, 1.5]));
    },
    'divide scalar': function(topic) {
      assert.deepEqual(topic.divide(2), new Vector([-1, 1, 1.5]));
    },
    'fail on divide different lengths': function(topic) {
      assert.throws(function () {topic.divide([1, 2]);}, RangeError);
    }
  },
  'Push': {
    '(Return)': {
      topic: (function() {
        return new Vector().push(1, 2, 3);
      })(),
      'Vector.push equivalent to Array.push': function(topic) {
        assert.equal(topic, [].push(1, 2, 3));
      }
    },
    '(Values)': {
      topic: (function() {
        var numbers = new Vector();
        numbers.push(
          22.2734, 22.194, 22.0847, 22.1741, 22.184, 22.1344,
          22.2337, 22.4323, 22.2436, 22.2933, 22.1542, 22.3926,
          22.3816, 22.6109, 23.3558, 24.0519, 23.753, 23.8324,
          23.9516, 23.6338, 23.8225, 23.8722, 23.6537, 23.187,
          23.0976, 23.326, 22.6805, 23.0976, 22.4025, 22.1725
        );
        return numbers.toArray();
      })(),
      'Push equivalent to instantiation': function(topic) {
        assert.deepEqual(topic, prices.toArray());
      }
    },
    '(Sum)': {
      topic: (function() {
        var numbers = new Vector();
        numbers.push(
          22.2734, 22.194, 22.0847, 22.1741, 22.184, 22.1344,
          22.2337, 22.4323, 22.2436, 22.2933, 22.1542, 22.3926,
          22.3816, 22.6109, 23.3558, 24.0519, 23.753, 23.8324,
          23.9516, 23.6338, 23.8225, 23.8722, 23.6537, 23.187,
          23.0976, 23.326, 22.6805, 23.0976, 22.4025, 22.1725
        );
        return numbers.sum();
      })(),
      '685.6774': function(topic) {
        assert.equal(topic, (function() {
          var sum = 0.0;
          for (var i = 0; i < prices.length; i++) {
            sum += prices[i];
          }
          return sum;
        })());
      }
    },
    '(Product)': {
      topic: (function() {
        var numbers = new Vector();
        numbers.push(
          22.2734, 22.194, 22.0847, 22.1741, 22.184, 22.1344,
          22.2337, 22.4323, 22.2436, 22.2933, 22.1542, 22.3926,
          22.3816, 22.6109, 23.3558, 24.0519, 23.753, 23.8324,
          23.9516, 23.6338, 23.8225, 23.8722, 23.6537, 23.187,
          23.0976, 23.326, 22.6805, 23.0976, 22.4025, 22.1725
        );
        return numbers.product();
      })(),
      '5.809803264589068e+40': function(topic) {
        assert.equal(topic, (function() {
          var product = 1.0;
          for (var i = 0; i < prices.length; i++) {
            product *= prices[i];
          }
          return product;
        })());
      }
    },
    '(Variance)': {
      topic: (function() {
        var numbers = new Vector();
        numbers.push(
          22.2734, 22.194, 22.0847, 22.1741, 22.184, 22.1344,
          22.2337, 22.4323, 22.2436, 22.2933, 22.1542, 22.3926,
          22.3816, 22.6109, 23.3558, 24.0519, 23.753, 23.8324,
          23.9516, 23.6338, 23.8225, 23.8722, 23.6537, 23.187,
          23.0976, 23.326, 22.6805, 23.0976, 22.4025, 22.1725
        );
        return numbers.variance();
      })(),
      '0.468596215155556': function(topic) {
        assert.equal(topic, prices.variance());
      }
    },
    '(Heterogeneous Variance)': {
      topic: (function() {
        var mixed = new Vector();
        mixed.push(
          72, -15, -50, 19, -33, -2, 60, -28, -13, -2,
          17, -20, 24, 13, 33, -68, 75, -4, -18, -4,
          19, 8, -12, -11, -29, -1, -18, 16, 14, 34,
          -26, 4, -26, 49, -72, 77, -31, 32, -76, 21,
          30, -57, 87, -36, 13, 19, -31, -14, 48
        );
        return mixed.variance().toFixed(12) === heterogeneous.variance().toFixed(12);
      })(),
      '1437.684298209080': function(topic) {
        assert.equal(topic, (function() {
          var variance = 0.0;
          for (var i = 0; i < heterogeneous.length; i++) {
            variance += Math.pow((heterogeneous[i] - heterogeneous.mean()), 2);
          }
          variance /= heterogeneous.length;
          return variance.toFixed(12) === heterogeneous.variance().toFixed(12);
        })());
      }
    }
  },
  'Copy': {
    topic: set.copy().toArray(),
    'Copy of parent Vector': function(topic) {
      assert.deepEqual(topic, set.toArray());
    }
  },
  'Extend': {
    topic: set.extend({
      identity: function() {
        return this;
      },
      tail: function() {
        return this.slice(1);
      }
    }),
    'Multiple Extensions': function(topic) {
      assert.deepEqual([topic.toArray(), topic.tail().toArray(), topic.identity().toArray()],
        [set.toArray(), set.slice(1).toArray(), set.toArray()]
      );
    },
    'Extensions Maintain Parent Methods': function(topic) {
      assert.equal(topic.identity().sum(), set.sum());
    }
  },
  // Collection methods
  'Indices Of': {
    topic: heterogeneous.indicesOf(-2),
    '[5, 9]': function(topic) {
      assert.deepEqual(topic, [5, 9]);
    }
  },
  'Indices By': {
    topic: heterogeneous.indicesBy(function(e) { return e === -2 }),
    '[5, 9]': function(topic) {
      assert.deepEqual(topic, [5, 9]);
    }
  },
  'Find One': {
    topic: new Vector([{ x: 0, y: 1 }]),
    'Returns object': function(topic) {
      assert.deepEqual(topic.findOne({ x: 0 }), { x: 0, y: 1 });
    }
  },
  'Concatenate': {
    topic: new Vector(1, 2, 3).concat(4),
    'Add element to set': function(topic) {
      assert.deepEqual(topic, [1, 2, 3, 4]);
    }
  },
  'Slice': {
    topic: new Vector(1, 2, 3),
    'Fetch all of set': function(topic) {
      assert.deepEqual(topic.slice(), topic);
    },
     'Fetch part of set': function(topic) {
      assert.deepEqual(topic.slice(0, 2), [1, 2]);
    }
  },
  'Split': {
    topic: new Vector(1, 2, 3, 4).split(function(e) { return (e % 2) === 0; }),
    'Divisible by 2': function(topic) {
      assert.deepEqual(topic, [[1, 3], [2, 4]]);
    }
  },
  'Unique': {
    topic: new Vector(1, 1, 2, 2, 3, 4, 7, 7).unique(),
    'One of each element in array': function(topic) {
      assert.deepEqual(topic, [1, 2, 3, 4, 7]);
    }
  },
  'Filter': {
    topic: new Vector(1, 2, 3).filter(function(e) { return e < 3; }),
    'Less than 3': function(topic) {
      assert.deepEqual(topic, [1, 2]);
    }
  },
  'Every': {
    topic: (function() {
      return new Vector(-3, -5, -1, -8, -10, -1);
    })(),
    'All values are negative': function(topic) {
      assert.equal(topic.every(function(e) { return e < 0; }), true);
    },
    'All values are not positive': function(topic) {
      assert.equal(topic.every(function(e) { return e > 0; }), false);
    }
  },
  'Append': {
    topic: (function() {
      var appended = new Vector(1, 2, 3);
      appended.append([1, 2, 3]);
      return appended;
    })(),
    '[1, 2, 3, 1, 2, 3]': function(topic) {
      assert.deepEqual(topic, new Vector(1, 2, 3, 1, 2, 3));
    },
    'Sum of numbers after append': function(topic) {
      assert.equal(topic.sum(), new Vector(1, 2, 3, 1, 2, 3).sum());
    }
  },
  'Some': {
    topic: (function() {
      return new Vector(3, 5, 1, -8, 10, 1);
    })(),
    'Some values are negative': function(topic) {
      assert.equal(topic.some(function(e) { return e < 0; }), true);
    },
    'Some values are positive': function(topic) {
      assert.equal(topic.some(function(e) { return e > 0; }), true);
    }
  },
  'Reduce': {
    topic: set,
    'Left to right': function(topic) {
      assert.equal(topic.reduce(function(a, b) { return a + b; }), set.sum());
    },
    'Right to left': function(topic) {
      assert.equal(topic.reduceRight(function(a, b) { return a + b; }), set.sum());
    }
  },
  'Equal': {
    topic: new Vector(1, 2, 3).equal(new Vector(1, 2, 3)),
    'True': function(topic) {
      assert.equal(topic, true);
    }
  },
  'Clone': {
    topic: set.clone(),
    'Instance of parent Vector': function(topic) {
      assert.instanceOf(topic, Array);
    }
  },
  'toVector from Array': {
    topic: [1, 2, 3, 4],
    'Returns new Vector': function(topic) {
      assert.equal(topic.toVector().sum(), 10);
    }
  }
}).export(module);
