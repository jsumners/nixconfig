'use strict'

module.exports = function envLoader () {
  const envPrefix = require('./parentPkg').nixconfigPrefix || 'nixconfig_'
  const envKeys = Object.keys(process.env)
  const config = {}

  envKeys.forEach((key) => {
    if (key.startsWith(envPrefix) === false) return
    const name = key.replace(envPrefix, '')
    config[name] = process.env[key]
  })

  return config
}
