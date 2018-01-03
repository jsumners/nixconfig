'use strict'

const path = require('path')
const test = require('tap').test
const mockquire = require('mock-require')

test('loads object based config files', (t) => {
  t.tearDown(() => {
    mockquire.stopAll()
  })

  t.beforeEach((done) => {
    mockquire.stopAll()

    delete require.cache[require.resolve('../lib/readConfig')]
    delete require.cache[require.resolve('../lib/lookupPaths')]
    delete require.cache[require.resolve('../lib/nixconfig')]

    mockquire('../lib/parentPkg', () => {
      return {
        name: 'foo',
        nixconfigPrefix: 'nixconfig_'
      }
    })

    mockquire('../lib/lookupPaths', [
      path.join(__dirname, 'fixtures', 'etc'),
      path.join(__dirname, 'fixtures', 'etc', 'foo')
    ])

    done()
  })

  t.test('loads files from /etc', (t) => {
    t.plan(6)
    const nixconfigProto = require('../lib/nixconfig')
    const readConfig = require('../lib/readConfig')
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

  t.test('loads from environment', (t) => {
    t.plan(2)
    const nixconfigProto = require('../lib/nixconfig')
    const readConfig = require('../lib/readConfig')
    const nixconfig = Object.create(nixconfigProto, {
      config: {value: {}},
      log: {value: require('abstract-logging')}
    })
    process.env['nixconfig_foobar'] = 'foobar'
    const config = readConfig(nixconfig)
    t.ok(config.foobar)
    t.is(config.foobar, 'foobar')
    delete process.env['nixconfig_foobar']
  })

  t.end()
})

test('loads array based config files', (t) => {
  t.plan(1)

  delete require.cache[require.resolve('../lib/readConfig')]
  delete require.cache[require.resolve('../lib/lookupPaths')]
  delete require.cache[require.resolve('../lib/nixconfig')]

  mockquire('../lib/parentPkg', () => {
    return {
      name: 'foo',
      nixconfigPrefix: 'nixconfig_'
    }
  })

  mockquire('../lib/lookupPaths', [
    path.join(__dirname, 'fixtures', 'bar')
  ])

  t.tearDown(() => {
    mockquire.stopAll()
  })

  const nixconfigProto = require('../lib/nixconfig')
  const readConfig = require('../lib/readConfig')

  const nixconfig = Object.create(nixconfigProto, {
    config: {value: {}},
    log: {value: require('abstract-logging')}
  })
  const config = readConfig(nixconfig)
  t.strictDeepEqual(config, {
    should: 'be in final config',
    gets_overwritten: 'final'
  })
})
