'use strict'

const test = require('tap').test
const mockquire = require('mock-require')
const envLoaderPath = require.resolve('../lib/envLoader')

test('recognizes prefix', (t) => {
  mockquire('../lib/parentPkg', () => { return {nixconfigPrefix: 'test_'} })

  t.tearDown(() => {
    mockquire.stopAll()
  })

  t.test('sets shallow variables', (t) => {
    t.plan(2)
    delete require.cache[envLoaderPath]
    const envLoader = require(envLoaderPath)
    process.env['test_foo'] = 'foo'
    const config = envLoader()
    t.ok(config.foo)
    t.is(config.foo, 'foo')
    delete process.env['test_foo']
  })

  t.test('sets deep variables', (t) => {
    t.plan(8)
    delete require.cache[envLoaderPath]
    const envLoader = require(envLoaderPath)
    process.env['test_foo__bar__baz'] = 42
    process.env['test_foo__foobar'] = 'foobar'
    const config = envLoader()
    t.ok(config.foo)
    t.type(config.foo, Object)
    t.ok(config.foo.bar)
    t.type(config.foo.bar, Object)
    t.ok(config.foo.bar.baz)
    t.is(config.foo.bar.baz, '42')
    t.ok(config.foo.foobar)
    t.is(config.foo.foobar, 'foobar')
    delete process.env['test_foo__bar__baz']
    delete process.env['test_foo__bar']
  })

  t.end()
})

test('ignores nixconfig_config_home', (t) => {
  t.plan(1)

  mockquire('../lib/parentPkg', () => { return {nixconfigPrefix: 'nixconfig_'} })
  t.tearDown(() => mockquire.stopAll())

  delete require.cache[envLoaderPath]
  const envLoader = require(envLoaderPath)
  process.env['nixconfig_config_home'] = '/tmp'
  process.env['nixconfig_foo'] = 'foo'
  const config = envLoader()
  t.strictDeepEqual(config, {foo: 'foo'})
  delete process.env['nixconfig_config_home']
  delete process.env['nixconfig_foo']
})
