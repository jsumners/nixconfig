'use strict'

const test = require('tap').test
const nixconfigProto = require('../lib/nixconfig')

test('set throws error for missing path', (t) => {
  t.plan(1)
  const nixconfig = Object.create(nixconfigProto, {config: {value: {}}})
  t.throws(() => nixconfig.set('foo.bar', 'baz'), /Missing path/)
})

test('set adds a value', (t) => {
  t.plan(2)
  const nixconfig = Object.create(nixconfigProto, {config: {value: {}}})
  nixconfig.set('foo', 'bar')
  t.ok(nixconfig.config.foo)
  t.ok(nixconfig.config.foo, 'bar')
})

test('set sets a deep value', (t) => {
  t.plan(2)
  const nixconfig = Object.create(nixconfigProto, {config: {value: {}}})
  nixconfig.config.foo = {}
  nixconfig.set('foo.bar', 'baz')
  t.ok(nixconfig.config.foo.bar)
  t.is(nixconfig.config.foo.bar, 'baz')
})

test('get retrieves a value', (t) => {
  t.plan(1)
  const nixconfig = Object.create(nixconfigProto, {config: {value: {}}})
  nixconfig.config.foo = 'bar'
  t.is(nixconfig.get('foo'), 'bar')
})

test('get retrieves a deep value', (t) => {
  t.plan(1)
  const nixconfig = Object.create(nixconfigProto, {config: {value: {}}})
  nixconfig.config.foo = {bar: 'baz'}
  t.is(nixconfig.get('foo.bar'), 'baz')
})

test('get retrieves a deep value with alternate delimiter', (t) => {
  t.plan(1)
  const nixconfig = Object.create(nixconfigProto, {config: {value: {}}})
  nixconfig.delim = ':'
  nixconfig.config.foo = {bar: 'baz'}
  t.is(nixconfig.get('foo:bar'), 'baz')
})
