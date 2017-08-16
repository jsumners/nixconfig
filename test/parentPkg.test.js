'use strict'

const path = require('path')
const test = require('tap').test
const modPath = require.resolve('../lib/parentPkg')

test('uses passed in name and path', (t) => {
  t.plan(1)
  delete require.cache[modPath]
  const pkg = require(modPath)('not-foo', path.join(__dirname, 'fixtures', 'foo'))
  t.is(pkg.name, 'not-foo')
})
