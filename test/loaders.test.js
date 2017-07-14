'use strict'

const test = require('tap').test
const nixconfigProto = require('../lib/nixconfig')

test('addLoader throws for invalid extension format', (t) => {
  const nixconfig = Object.create(nixconfigProto)
  t.throws(() => nixconfig.addLoader('foo', null), /have leading/)
  t.end()
})

test('addLoader throws for non-function method', (t) => {
  const nixconfig = Object.create(nixconfigProto)
  t.throws(() => nixconfig.addLoader('.foo', {}), /a function/)
  t.end()
})

test('addLoader adds a loader', (t) => {
  t.plan(1)
  const nixconfig = Object.create(nixconfigProto)
  nixconfig.addLoader('.foo', () => {})
  t.ok(nixconfig.loaders['.foo'])
})

// test('config.loaders adds loaders to the instance via an array', (t) => {
//   t.plan(1)
//   const nixconfig = nixconfigProto({
//     loaders: [{ext: '.foo', method: () => {}}]
//   })
//   t.ok(nixconfig.loaders['.foo'])
// })

// test('config.loaders adds loader to the intance via an object', (t) => {
//   t.plan(1)
//   const nixconfig = nixconfigProto({
//     loaders: {
//       '.foo': () => {}
//     }
//   })
//   t.ok(nixconfig.loaders['.foo'])
// })
