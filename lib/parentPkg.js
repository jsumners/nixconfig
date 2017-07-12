'use strict'

const path = require('path')
const findpkg = require('./findpkg')
const parentPkgPath = findpkg(__dirname, require('../package.json').name)
const parentPkg = require(path.join(parentPkgPath, 'package.json'))

module.exports = parentPkg
