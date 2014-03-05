/**
 * Test TimeSeries object and methods.
 */

var vows = require('vows'),
    assert = require('assert');

var TimeSeries = require('../lib/gauss').TimeSeries;

var series = new TimeSeries([1315378833000, 2], [1315789015000, 4]);

vows.describe('TimeSeries').addBatch({
  'Times': {
    topic: series.times().toArray(),
    '[1315378833000, 1315789015000]': function(topic) {
      assert.deepEqual(topic, [1315378833000, 1315789015000]);
    }
  },
  'Values': {
  	topic: series.values().toArray(),
  	'[2, 4]': function(topic) {
  		assert.deepEqual(topic, [2, 4]);
  	}
  },
  'toTimeSeries from Array': {
    topic: [[1315378833000, 2], [1315789015000, 4]],
    'Returns new TimeSeries': function(topic) {
      assert.deepEqual(topic.toTimeSeries().values(), [2, 4]);
    }
  }
}).export(module);
