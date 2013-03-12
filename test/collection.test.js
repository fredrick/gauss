/**
 * Test Collection data structure and methods.
 */

var vows = require('vows'),
    assert = require('assert');

var Collection = require('../lib/gauss').Collection;

var set = new Collection([10, 82, 67, 17, 36, 3, 1, 61, 33, 20,
18, 35, 15, 39, 52, 85, 17, 92, 88, 70,
66, 85, 93, 81, 70, 41, 40, 22, 38, 52,
86, 60, 64, 38, 87, 15, 92, 61, 93, 17,
38, 68, 11, 98, 62, 75, 94, 63, 49, 97]);

var majority = new Collection([10, 82, 67, 17, 36, 3, 1, 61, 33, 20,
18, 35, 15, 39, 52, 85, 17, 92, 88, 70,
66, 85, 93, 81, 70, 41, 40, 22, 38, 52,
86, 60, 64, 38, 87, 15, 92, 61, 93, 17,
38, 68, 11, 98, 62, 75, 94, 63, 17]);

var heterogeneous = new Collection([72, -15, -50, 19, -33, -2, 60, -28, -13, -2,
17, -20, 24, 13, 33, -68, 75, -4, -18, -4,
19, 8, -12, -11, -29, -1, -18, 16, 14, 34,
-26, 4, -26, 49, -72, 77, -31, 32, -76, 21,
30, -57, 87, -36, 13, 19, -31, -14, 48]);

var prices = new Collection([22.2734, 22.194, 22.0847, 22.1741, 22.184, 22.1344,
22.2337, 22.4323, 22.2436, 22.2933, 22.1542, 22.3926,
22.3816, 22.6109, 23.3558, 24.0519, 23.753, 23.8324,
23.9516, 23.6338, 23.8225, 23.8722, 23.6537, 23.187,
23.0976, 23.326, 22.6805, 23.0976, 22.4025, 22.1725]);

var characters = new Collection('Loremipsumdolorsitamet,consecteturadipiscingelit.\
Insuscipitadipiscingenim,atportamagnavenenatiseu.\
Sedtortorlacus,ultricesatsuscipiteu,temporvitaemagna.'.toLowerCase().split(''));

var people = new Collection(
  { firstname: 'John', lastname: 'Smith' },
  { firstname: 'Jane', lastname: 'Doe' },
  { firstname: 'Mike', lastname: 'Smith' },
  { firstname: 'Susan', lastname: 'Baker' }
);

vows.describe('Collection').addBatch({
  'Index Of': {
    topic: characters.indexOf(','),
    '22': function(topic) {
      assert.deepEqual(topic, characters.toArray().indexOf(','));
    }
  },
  'Index By': {
    topic: characters.indexBy(function(e) { return e === ',' }),
    '22': function(topic) {
      assert.deepEqual(topic, characters.indexOf(','));
    }
  },
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
  'Last Index By': {
    topic: characters.lastIndexBy(function(e) { return e === ',' }),
    '133': function(topic) {
      assert.deepEqual(topic, characters.lastIndexOf(','));
    }
  },
  'Find': {
    '(Predicate)': {
      topic: people.find(function(e) { return e.firstname === 'Jane' }),
      'Condition by function': function(topic) {
        assert.deepEqual(topic, [{ firstname: 'Jane', lastname: 'Doe' }]);
      }
    },
    '(Key in Object)': {
      topic: people.find({ lastname: 'Smith' }),
      'Condition by Object key': function(topic) {
        assert.deepEqual(topic, [{ firstname: 'John', lastname: 'Smith' }, { firstname: 'Mike', lastname: 'Smith' }]);
      }
    }
  },
  'Find One': {
    '(Predicate)': {
      topic: people.findOne(function(e) { return e.firstname === 'Jane' }),
      'Condition by function': function(topic) {
        assert.deepEqual(topic, { firstname: 'Jane', lastname: 'Doe' });
      }
    },
    '(Key in Object)': {
      topic: people.findOne({ lastname: 'Smith' }),
      'Condition by Object key': function(topic) {
        assert.deepEqual(topic, { firstname: 'John', lastname: 'Smith' });
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
    },
    '(Uniform)': {
      topic: new Collection([1, 2, 3, 4]).mode(),
      '[1, 2, 3, 4]': function(topic) {
        assert.deepEqual(topic, [1, 2, 3, 4]);
      }
    }
  },
  'Frequency': {
    topic: set.frequency(17),
    '3': function(topic) {
      assert.equal(topic, 3);
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
    },
    '(Absolute Character Frequency)': {
      topic: characters.distribution(),
      '{Character: Count}': function(topic) {
        assert.deepEqual(topic, {
          p: 7, r: 8, i: 18, t: 16,
          s: 13, l: 5, d: 4, e: 14,
          ',': 4, c: 8, o: 8, n: 9,
          '.': 3, g: 4, u: 8, m: 7,
          v: 2, a: 13
        });
      }
    },
    '(Relative Character Frequency)': {
      topic: characters.distribution('relative'),
      '{Character: Ratio}': function(topic) {
        assert.deepEqual(topic, {
          p: 0.046357615894039736, r: 0.052980132450331126,
          i: 0.11920529801324503, t: 0.10596026490066225,
          s: 0.08609271523178808, l: 0.033112582781456956,
          d: 0.026490066225165563, e: 0.09271523178807947,
          ',': 0.026490066225165563, c: 0.052980132450331126,
          o: 0.052980132450331126, n: 0.059602649006622516,
          '.': 0.019867549668874173, g: 0.026490066225165563,
          u: 0.052980132450331126, m: 0.046357615894039736,
          v: 0.013245033112582781, a: 0.08609271523178808
        });
      }
    }
  },
  'Append': {
    topic: new Collection(1, 2, 3).append(new Collection(1, 2, 3)),
    '[1, 2, 3, 1, 2, 3]': function(topic) {
      assert.deepEqual(topic, new Collection().push(1, 2, 3, 1, 2, 3));
    }
  },
  'Equal': {
    topic: new Collection(1, 2, 3).equal(new Collection(1, 2, 3)),
    'True': function(topic) {
      assert.equal(topic, true);
    }
  },
  'Clone': {
    topic: set.clone(),
    'Instance of parent Collection': function(topic) {
      assert.instanceOf(topic, Array);
    }
  },
  'Copy': {
    topic: set.copy(),
    'Copy of parent Collection': function(topic) {
      assert.deepEqual(topic, set);
    }
  },
  'toArray': {
    topic: new Collection(1, 2, 3),
    'Native Array': function(topic) {
      assert.deepEqual(topic, [1, 2, 3]);
    }
  },
  'Concatenate': {
    topic: new Collection(1, 2, 3).concat(4),
    'Add element to set': function(topic) {
      assert.deepEqual(topic, [1, 2, 3, 4]);
    }
  },
  'Slice': {
    topic: new Collection(1, 2, 3),
    'Fetch all of set': function(topic) {
      assert.deepEqual(topic.slice(), topic);
    },
     'Fetch part of set': function(topic) {
      assert.deepEqual(topic.slice(0, 2), [1, 2]);
    }
  },
  'Split': {
    topic: new Collection(1, 2, 3, 4).split(function(e) { return (e % 2) === 0; }),
    'Divisible by 2': function(topic) {
      assert.deepEqual(topic, [[1, 3], [2, 4]]);
    }
  },
  'Unique': {
    topic: new Collection(1, 1, 2, 2, 3, 4, 7, 7).unique(),
    'One of each element in array': function(topic) {
      assert.deepEqual(topic, [1, 2, 3, 4, 7]);
    }
  },
  'Filter': {
    topic: new Collection(1, 2, 3).filter(function(e) { return e < 3; }),
    'Less than 3': function(topic) {
      assert.deepEqual(topic, [1, 2]);
    }
  },
  'Every': {
    topic: new Collection(1, 2, 3).every(function(e) { return e < 4; }),
    'True for all elements': function(topic) {
      assert.equal(topic, true);
    }
  },
  'Map': {
    topic: new Collection(1, 2, 3).map(function(e) { return e + 1; }),
    'Add 1 to all elements': function(topic) {
      assert.deepEqual(topic, [2, 3, 4]);
    },
    'Chain function after map': function(topic) {
      assert.deepEqual(topic.distribution(), { 2: 1, 3: 1, 4: 1 });
    }
  },
  'Some': {
    topic: new Collection(1, 2, 3).some(function(e) { return e == 2; }),
    'At least one element matches condition': function(topic) {
      assert.equal(topic, true);
    }
  },
  'Reduce': {
    topic: new Collection(1, 2, 3).reduce(function(a, b) { return a + b; }),
    'Sum of set': function(topic) {
      assert.equal(topic, 6);
    }
  },
  'Reduce Right': {
    topic: new Collection('a', 'b', 'c').reduceRight(function(a, b) { return a + b; }),
    'Reverse set of characters to string': function(topic) {
      assert.equal(topic, 'cba');
    }
  },
  'Extend': {
    topic: set.extend({
      identity: function() {
        return this;
      },
      head: function() {
        return this[0];
      },
      tail: function() {
        return this.slice(1);
      }
    }),
    'Extend Collection': function(topic) {
      assert.deepEqual([topic, topic[0], topic.tail()],
        [set.identity(), set.head(), set.slice(1)]
      );
    }
  }
}).export(module);
