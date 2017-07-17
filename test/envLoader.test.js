'use strict'

const test = require('tap').test
const mockquire = require('mock-require')
const envLoaderPath = require.resolve('../lib/envLoader')

mockquire('../lib/parentPkg', {nixconfigPrefix: 'test_'})

test('sets shallow variables', (t) => {
  t.plan(2)
  delete require.cache[envLoaderPath]
  const envLoader = require(envLoaderPath)
  process.env['test_foo'] = 'foo'
  const config = envLoader()
  t.ok(config.foo)
  t.is(config.foo, 'foo')
  delete process.env['test_foo']
})

test('sets deep variables', (t) => {
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
