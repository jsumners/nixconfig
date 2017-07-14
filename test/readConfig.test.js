'use strict'

const path = require('path')
const test = require('tap').test
const mockquire = require('mock-require')

mockquire('../lib/parentPkg', {
  name: 'foo',
  nixconfigPrefix: 'nixconfig_'
})

mockquire('../lib/lookupPaths', [
  path.join(__dirname, 'fixtures', 'etc'),
  path.join(__dirname, 'fixtures', 'etc', 'foo')
])

const nixconfigProto = require('../lib/nixconfig')
const readConfig = require('../lib/readConfig')

test('loads files from /etc', (t) => {
  t.plan(6)
  const nixconfig = Object.create(nixconfigProto, {
    config: {value: {}},
    log: {value: require('abstract-logging')}
  })
  const config = readConfig(nixconfig)
  t.ok(config.foo)
  t.is(config.foo, 'foo')
  t.ok(config.bar)
  t.is(config.bar, 'bar')
  t.ok(config.toOverride)
  t.is(config.toOverride, 'b')
})

test('loads from environment', (t) => {
  t.plan(2)
  const nixconfig = Object.create(nixconfigProto, {
    config: {value: {}},
    log: {value: require('abstract-logging')}
  })
  process.env['nixconfig_foobar'] = 'foobar'
  const config = readConfig(nixconfig)
  t.ok(config.foobar)
  t.is(config.foobar, 'foobar')
})
