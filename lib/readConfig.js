'use strict'

const path = require('path')
const assign = require('deep-assign')
const lookupPaths = require('./lookupPaths')
const parentPkgName = require('./parentPkg').name

module.exports = function readConfig (kvmesh) {
  let config = {}
  const fileExts = Object.keys(kvmesh.loaders).filter((ext) => ext.startsWith('.'))
  const tildeLoaders = Object.keys(kvmesh.loaders).filter((ext) => ext.startsWith('~'))

  lookupPaths.forEach((lookupPath) => {
    fileExts.forEach((ext) => {
      const file = path.join(lookupPath, parentPkgName + ext)
      try {
        const data = kvmesh.loaders[ext](file)
        assign(config, data)
      } catch (e) {
        kvmesh.log.error('could not read file %s: %s', file, e.message)
        kvmesh.log.debug(e.stack)
      }
    })
  })

  tildeLoaders.forEach((loader) => {
    try {
      const data = kvmesh.loaders[loader]()
      assign(config, data)
    } catch (e) {
      kvmesh.log.error('%s loader failed: %s', loader.substring(1), e.message)
      kvmesh.log.debug(e.stack)
    }
  })

  return config
}
