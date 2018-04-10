'use strict'

const path = require('path')
const assign = require('merge-options')
const lookupPaths = require('./lookupPaths')
const parentPkgName = (require('./parentPkg')()).name

module.exports = function readConfig (nixconfig) {
  let config = {}
  const errors = []
  const notFound = []
  const fileExts = Object.keys(nixconfig.loaders).filter((ext) => ext.startsWith('.'))
  const tildeLoaders = Object.keys(nixconfig.loaders).filter((ext) => ext.startsWith('~'))

  lookupPaths.forEach((lookupPath) => {
    fileExts.forEach((ext) => {
      const file = path.join(lookupPath, parentPkgName + ext)
      try {
        const data = nixconfig.loaders[ext](file)
        if (Array.isArray(data)) {
          for (const d of data) {
            if (Object.prototype.toString.apply(d) !== '[object Object]') continue
            config = assign({}, config, d)
          }
        } else {
          config = assign({}, config, data)
        }
      } catch (e) {
        nixconfig.log.error('could not read file %s: %s', file, e.message)
        nixconfig.log.debug(e.stack)
        if (['MODULE_NOT_FOUND', 'ENOENT'].includes(e.code) === false) {
          e.targetFile = file
          errors.push(e)
        } else {
          notFound.push(file)
        }
      }
    })
  })

  tildeLoaders.forEach((loader) => {
    try {
      const data = nixconfig.loaders[loader]()
      config = assign({}, config, data)
    } catch (e) {
      nixconfig.log.error('%s loader failed: %s', loader.substring(1), e.message)
      nixconfig.log.debug(e.stack)
      errors.push(e)
    }
  })

  config[Symbol.for('nixconfig.errors')] = errors
  config[Symbol.for('nixconfig.notFound')] = notFound

  return config
}
