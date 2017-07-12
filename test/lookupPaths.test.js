'use strict'

const path = require('path')
const test = require('tap').test
const mockquire = require('mock-require')
const modpath = require.resolve('../lib/lookupPaths')
const pkgModPath = require.resolve('../lib/findpkg')

test('returns non-win32 paths', (t) => {
  delete require.cache['os']
  delete require.cache[modpath]
  mockquire('os', {
    platform: () => 'linux',
    homedir: () => '/foo'
  })
  mockquire(pkgModPath, () => {
    return path.join(__dirname, 'fixtures', 'foo')
  })
  const lookupPaths = require(modpath)
  t.ok(lookupPaths.includes('/etc/foo'))
  t.end()
})
