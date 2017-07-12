'use strict'

const kvmeshProto = require('./lib/kvmesh')
const readConfig = require('./lib/readConfig')

/**
 * @property {string} [delim] Set the delimiter to use in path based operations
 * like {@link kvmesh.get}. Default: `.`.
 * @property {array|object} [loaders] Define a set of additional configuration
 * loaders. If passing an array, the array should be a list of objects like
 * `{ext: '.foo', method: () => {}}`. If passing an object, the keys should be
 * the extension and the values the methods, e.g. `{ '.foo': () => {} }`.
 * @property {object} logger A logger instance that conforms to the log4j API.
 * For example, {@link https://npm.im/pino}.
 * @typedef {object} KvmeshOptions
 */

/**
 * Build a kvmesh instance.
 *
 * @param {KvmeshOptions} options Configuration options object for the returned
 * instance.
 * @returns {kvmesh}
 *
 * @alias kvmeshFactory
 */
module.exports = function (options) {
  const instance = Object.create(kvmeshProto)

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

  const config = readConfig(instance)
  Object.defineProperty(instance, 'config', {value: config})

  return instance
}
