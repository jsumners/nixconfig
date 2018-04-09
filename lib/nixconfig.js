'use strict'

const getPathValue = require('./getPathValue')

/**
 * A simple tool for reading configuration files from standard storage paths
 * and the environment.
 *
 * Internally, all of the loaded configuration is merged into a standard
 * JavaScript object. The properties of this object can be accessed via the
 * `.get` method using a path string like `foo.bar` to access `bar` of
 * `{foo: { bar: {} }}`. The `.set` method also accepts such paths.
 *
 * @property {string} delim The delimiter used to separate path accessors in
 * keys passed to `.set` and `.get`. Default: `.`.
 * @property {object} config The internal object that represents all of the
 * loaded configuration. This object has two special properties:
 * `Symbol.for('nixconfig.errors')` and `Symbol.for('nixconfig.notFound')`.
 * The `nixconfig.errors` property is a list of `Error` objects generated when
 * trying to load a given configuration file (e.g. when a `foo.js` throws an
 * error during loading). Each of these errors has a `targetFile` property
 * indicating which configuration file generated the error. The `nixconfig.notFound`
 * property is a list of files that have been attempted to load but could not
 * be found on the file system, e.g. `/etc/foo.json` when `/etc/foo.json` does
 * not exist.
 * @property {Array} lookupPaths The list of paths, in order of ascending precedence,
 * that *nixconfig* will look in for config files.
 *
 * @namespace {object} nixconfig
 */
const nixconfigProto = Object.create({}, {
  loaders: {
    value: {
      '.js': require,
      '.json': require,
      '~env': require('./envLoader')
    }
  },
  delim: {
    value: '.',
    writable: true
  }
})

/**
 * Add a method to load a specific configuration file format. The method
 * must return a standard JavaScript object. If the method throws, then the
 * error will be ignored.
 *
 * @param {string} ext The file extension for the loader method, e.g. `'.foo'`.
 * If the extension leads with a '.' then the loader will be used for parsing
 * files on the file system. If it begins with a '~' then it will simply be
 * invoked after all files have been processed.
 * @param {function} method The function that will be used to process files
 * with the specified extension.
 *
 * @returns {object} The current *nixconfig* instance.
 * @throws {Error} When the given extension does not start with a leading `.`
 * or the `method` is not a function.
 *
 * @memberof nixconfig
 * @method addLoader
 */
nixconfigProto.addLoader = function addLoader (ext, method) {
  if (['.', '~'].includes(ext.substr(0, 1)) === false) throw Error('Extension must have leading . or ~')
  if (Function.prototype.isPrototypeOf(method) === false) throw Error('method must be a function')
  this.loaders[ext] = method
  return this
}

/**
 * Retrieve values from the loaded configuration.
 *
 * @param {string} key The name of the value to retrieve. This can be
 * a path, separated by the `nixconfig.delim` value. For example, `foo.bar` to
 * access `bar` of `{foo: { bar: {} }}`.
 *
 * @returns {*|undefined} The retrieved value, or `undefined` if it could
 * not be found.
 *
 * @memberof nixconfig
 * @method get
 */
nixconfigProto.get = function getValue (key) {
  return getPathValue(this, key)
}

/**
 * Set a value in the internal configuration. Paths may be used just as is
 * described in `.get`.
 *
 * @param {string} key The name of the value to set.
 * @see {@link nixconfig.get} for details on pathing.
 *
 * @returns {nixconfig} The current nixconfig instance.
 * @throws {Error} When a supplied path cannot be reached.
 *
 * @memberof nixconfig
 * @method set
 */
nixconfigProto.set = function setValue (key, value) {
  if (key.includes(this.delim)) {
    const index = key.lastIndexOf(this.delim)
    const destKey = key.substring(index + 1)
    const parentPath = key.substring(0, index)
    const parentObj = getPathValue(this, parentPath)
    if (!parentObj) throw Error('Missing path: ' + parentPath)
    parentObj[destKey] = value
  } else {
    this.config[key] = value
  }
  return this
}

module.exports = nixconfigProto
