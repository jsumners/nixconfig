'use strict'

const test = require('tap').test
const kvmeshProto = require('../lib/kvmesh')

test('set throws error for missing path', (t) => {
  t.plan(1)
  const kvmesh = Object.create(kvmeshProto, {config: {value: {}}})
  t.throws(() => kvmesh.set('foo.bar', 'baz'), /Missing path/)
})

test('set adds a value', (t) => {
  t.plan(2)
  const kvmesh = Object.create(kvmeshProto, {config: {value: {}}})
  kvmesh.set('foo', 'bar')
  t.ok(kvmesh.config.foo)
  t.ok(kvmesh.config.foo, 'bar')
})

test('set sets a deep value', (t) => {
  t.plan(2)
  const kvmesh = Object.create(kvmeshProto, {config: {value: {}}})
  kvmesh.config.foo = {}
  kvmesh.set('foo.bar', 'baz')
  t.ok(kvmesh.config.foo.bar)
  t.is(kvmesh.config.foo.bar, 'baz')
})

test('get retrieves a value', (t) => {
  t.plan(1)
  const kvmesh = Object.create(kvmeshProto, {config: {value: {}}})
  kvmesh.config.foo = 'bar'
  t.is(kvmesh.get('foo'), 'bar')
})

test('get retrieves a deep value', (t) => {
  t.plan(1)
  const kvmesh = Object.create(kvmeshProto, {config: {value: {}}})
  kvmesh.config.foo = {bar: 'baz'}
  t.is(kvmesh.get('foo.bar'), 'baz')
})

test('get retrieves a deep value with alternate delimiter', (t) => {
  t.plan(1)
  const kvmesh = Object.create(kvmeshProto, {config: {value: {}}})
  kvmesh.delim = ':'
  kvmesh.config.foo = {bar: 'baz'}
  t.is(kvmesh.get('foo:bar'), 'baz')
})
