'use strict'

module.exports = function envLoader () {
  const envPrefix = (require('./parentPkg')()).nixconfigPrefix || 'nixconfig_'
  const envKeys = Object.keys(process.env)
  const config = {}

  envKeys.forEach((key) => {
    if (key.startsWith(envPrefix) === false) return
    const name = key.replace(envPrefix, '')
    const path = name.split('__')
    let curKey = name
    let curObj = config
    for (let i = 0; i < path.length; i += 1) {
      curKey = path[i]
      curObj[curKey] = curObj[curKey] || {}
      if (i !== (path.length - 1)) curObj = curObj[curKey]
    }
    curObj[curKey] = process.env[key]
  })

  return config
}
