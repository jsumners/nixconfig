'use strict'

const fs = require('fs')
const path = require('path')

/**
 * Find the `package.json` of a module given a starting path and the name of
 * a module to exclude from being a successful result.
 *
 * For example, given the structure `project/node_modules/kvmesh`, then starting
 * from within the `kvmesh` directory, and setting `exclude = 'kvmesh'`, then
 * the resulting path will be the "project" directory.
 *
 * @param start {string} A path from which to start the lookup.
 * @param [exclude] {string} The name within a found `package.json` to verify
 * if it should be excluded as a target.
 *
 * @returns {string} The path of the parent directory for the found package.
 */
module.exports = function findpkg (start, exclude) {
  let currentDir = path.dirname(start)
  while (true) {
    const packagePath = path.join(currentDir, 'package.json')
    if (!fs.existsSync(packagePath)) {
      currentDir = path.resolve(path.join(currentDir, '..'))
      continue
    }
    const pkg = require(packagePath)
    if (exclude && pkg.name === exclude) {
      currentDir = path.resolve(path.join(currentDir, '..'))
      continue
    }
    return path.resolve(currentDir)
  }
}
