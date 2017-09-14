'use strict'

const assign = require('merge-options')
const nixconfigProto = require('./lib/nixconfig')
const readConfig = require('./lib/readConfig')

/**
 * @property {object} [initialConfig] A default config object in case no
 * configuration files are available. Default: `{}`.
 * @property {string} [parentName] The name of the application. If not supplied,
 * this will be determined by traversing the directory tree up to the first
 * directory with a `node_modules` directory and a `package.json` that is *not*
 * the `nixconfig` module directory and using the value of `name` within the
 * found `package.json. If this is set, then the `parentPath` option must also
 * be set. Default: `undefined`.
 * @property {string} [parentPath] The absolute path to the application's
 * root directory. This must be set if `parentName` is set. If not set, the
 * path will be determined in the same fashion as `parentName`. Default: `undefined`.
 * @property {string} [delim] Set the delimiter to use in path based operations
 * like {@link nixconfig.get}. Default: `.`.
 * @property {array|object} [loaders] Define a set of additional configuration
 * loaders. If passing an array, the array should be a list of objects like
 * `{ext: '.foo', method: () => {}}`. If passing an object, the keys should be
 * the extension and the values the methods, e.g. `{ '.foo': () => {} }`.
 * @property {object} logger A logger instance that conforms to the log4j API.
 * For example, {@link https://npm.im/pino}.
 * @typedef {object} NixconfigOptions
 */

/**
 * Build a nixconfig instance.
 *
 * @param {NixconfigOptions} options Configuration options object for the returned
 * instance.
 * @returns {nixconfig}
 *
 * @alias nixconfigFactory
 */
module.exports = function (options) {
  const instance = Object.create(nixconfigProto)

  require('./lib/parentPkg')(options.parentName, options.parentPath)
  const lookupPaths = require('./lib/lookupPaths')
  Object.defineProperty(instance, 'lookupPaths', {value: lookupPaths})

  if (options.delim) instance.delim = options.delim

  if (options.loaders) {
    if (Array.isArray(options.loaders)) {
      options.loaders.forEach((loader) => {
        instance.addLoader(loader.ext, loader.method)
      })
    } else {
      Object.keys(options.loaders).forEach((key) => {
        instance.addLoader(key, options.loaders[key])
      })
    }
  }

  Object.defineProperty(instance, 'log', {
    value: options.logger || require('abstract-logging')
  })

  const config = assign({}, options.initialConfig || {}, readConfig(instance))
  Object.defineProperty(instance, 'config', {value: config})

  return instance
}
