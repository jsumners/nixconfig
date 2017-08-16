'use strict'

const path = require('path')
const assign = require('deep-assign')
const findpkg = require('./findpkg')

let pkg
module.exports = function (parentName, parentPath) {
  if (pkg) return pkg
  if (parentName && parentPath) {
    const _pkg = require(path.join(parentPath, 'package.json'))
    pkg = assign({}, _pkg, {name: parentName})
  } else {
    const parentPkgPath = findpkg(__dirname, require('../package.json').name)
    pkg = require(path.join(parentPkgPath, 'package.json'))
  }
  return pkg
}
