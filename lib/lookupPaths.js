'use strict'

const os = require('os')
const path = require('path')
const homedir = os.homedir()
const parentPkg = require('./parentPkg')
const parentName = parentPkg.name

if (os.platform() !== 'win32') {
  const lookupPaths = [
    '/etc',
    `/etc/${parentName}`,
    homedir,
    `${homedir}/.${parentName}`,
    `${homedir}/.config/${parentName}`
  ]
  if (os.platform() === 'darwin') {
    lookupPaths.push(path.join(homedir, 'Application Support', 'Preferences', parentName))
  }
  if (process.env['kvmesh_config_home']) {
    lookupPaths.push(process.env['kvmesh_config_home'])
  }
  module.exports = lookupPaths
} else {
  const lookupPaths = [
    path.join(homedir, 'AppData', 'Local', parentName)
  ]
  if (process.env['kvmesh_config_home']) {
    lookupPaths.push(process.env['kvmesh_config_home'])
  }
  module.exports = lookupPaths
}
