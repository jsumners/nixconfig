'use strict'

const test = require('tap').test
const kvmeshProto = require('../lib/kvmesh')

test('addLoader throws for invalid extension format', (t) => {
  const kvmesh = Object.create(kvmeshProto)
  t.throws(() => kvmesh.addLoader('foo', null), /have leading/)
  t.end()
})

test('addLoader throws for non-function method', (t) => {
  const kvmesh = Object.create(kvmeshProto)
  t.throws(() => kvmesh.addLoader('.foo', {}), /a function/)
  t.end()
})

test('addLoader adds a loader', (t) => {
  t.plan(1)
  const kvmesh = Object.create(kvmeshProto)
  kvmesh.addLoader('.foo', () => {})
  t.ok(kvmesh.loaders['.foo'])
})

// test('config.loaders adds loaders to the instance via an array', (t) => {
//   t.plan(1)
//   const kvmesh = kvmeshProto({
//     loaders: [{ext: '.foo', method: () => {}}]
//   })
//   t.ok(kvmesh.loaders['.foo'])
// })

// test('config.loaders adds loader to the intance via an object', (t) => {
//   t.plan(1)
//   const kvmesh = kvmeshProto({
//     loaders: {
//       '.foo': () => {}
//     }
//   })
//   t.ok(kvmesh.loaders['.foo'])
// })
