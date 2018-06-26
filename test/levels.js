const debug = require('..');
const assert = require('assert');

describe('debug-ng', function () {
	it('should handle log levels properly', function () {
		let value = false;
		const log = debug('test');
		log.log = function (s) { value = true; }

		// before enabling, should not trigger

		value = false;
		debug.disable();
		log('basic');
		assert.equal(value, false);

		// after enabling, should trigger

		value = false;
		debug.enable('test');
		log('basic');
		assert.equal(value, true);

		// test various log levels

		for (let level of ['error', 'warn', 'info', 'debug', 'trace']) {
			value = false;
			debug.level('off');
			log[level](level);
			assert.equal(value, false, "Should not create debug output for level '" + level + "'");

			value = false;
			debug.level(level);
			log[level](level);
			assert.equal(value, true, "Should create debug output for level '" + level + "'");
		}
	});

});
