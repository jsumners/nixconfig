'use strict'

const path = require('path')
const test = require('tap').test
const findpkg = require('../lib/findpkg')

test('finds parent package.json', (t) => {
  t.plan(1)
  const startPath = path.join(
    path.resolve(__dirname, 'fixtures', 'foo', 'bar', 'baz', 'lib')
  )
  const foundPath = findpkg(startPath, 'baz')
  t.is(foundPath, path.resolve(path.join(__dirname, 'fixtures', 'foo')))
})
