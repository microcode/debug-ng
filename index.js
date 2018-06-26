const debug = require('debug');
const isFunction = require('lodash.isfunction');

const levels = [ 'error', 'warn', 'info', 'debug', 'trace' ];
const funcs = levels.map((level, index) => [level, function (...a) { log.call(this, index, a) }]);

function log(level, args) {
	if (level <= active_level) {
		this.apply(this, args);
	}
}

let active_level = -1;
function set_level(name) {
	active_level = levels.indexOf(name);
}

function createDebug(namespace) {
	const instance = debug(namespace);

	// setup log level functions
	funcs.forEach(func => { instance[func[0]] = func[1] });

	return instance;
}

// expose all underlying properties on the original debug function
for (let name of Object.keys(debug)) {
	const property = debug[name];
	if (property === debug) {
		createDebug[name] = createDebug;
	} else if (isFunction(property)) {
		createDebug[name] = property;
	} else {
		Object.defineProperty(createDebug, name, {
			get() { return createDebug[name]; },
			set(value) { createDebug[name] = value; }
		});
	}
}

// expose method to change level
createDebug.level = set_level;

// default to env setting
set_level(process.env['DEBUG_LEVEL']);

module.exports = createDebug;
